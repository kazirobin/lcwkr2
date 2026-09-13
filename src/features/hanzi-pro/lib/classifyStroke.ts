import { STANDARD_STROKES, type StandardStroke } from "../data/strokes";

/**
 * Classifies a hanzi-writer character-data "median" (the polyline skeleton of
 * a single stroke) into one of the 32 standard strokes by geometry, so the
 * learner can see the stroke's real name as it is drawn.
 *
 * Median points are in the 1024 data space, ordered in pen direction with a
 * y-up (math) convention: heng ≈ 0°, shu ≈ −90°, pie ≈ −135°, na ≈ −45°,
 * ti ≈ +45°.
 */

export type Pt = { x: number; y: number };

export function toPts(raw: number[][]): Pt[] {
  return raw.map((p) => ({ x: Number(p[0]), y: Number(p[1]) }));
}

function dist(a: Pt, b: Pt): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** Ramer–Douglas–Peucker polyline simplification. */
function simplify(points: Pt[], eps: number): Pt[] {
  if (points.length <= 2) return points.slice();
  const a = points[0];
  const b = points[points.length - 1];
  const abx = b.x - a.x;
  const aby = b.y - a.y;
  const lenSq = abx * abx + aby * aby || 1e-9;
  let maxD = 0;
  let idx = -1;
  for (let i = 1; i < points.length - 1; i++) {
    const t = Math.max(
      0,
      Math.min(1, ((points[i].x - a.x) * abx + (points[i].y - a.y) * aby) / lenSq),
    );
    const px = a.x + abx * t;
    const py = a.y + aby * t;
    const d = Math.hypot(points[i].x - px, points[i].y - py);
    if (d > maxD) {
      maxD = d;
      idx = i;
    }
  }
  if (maxD > eps && idx > 0) {
    return [
      ...simplify(points.slice(0, idx + 1), eps).slice(0, -1),
      ...simplify(points.slice(idx), eps),
    ];
  }
  return [a, b];
}

/** Direction angle of a segment, degrees (y-up space): 0=E, +90=N, −90=S. */
function angleDeg(dx: number, dy: number): number {
  return (Math.atan2(dy, dx) * 180) / Math.PI;
}

function angDiff(a: number, b: number): number {
  let d = Math.abs(a - b) % 360;
  if (d > 180) d = 360 - d;
  return d;
}

type Seg = { a: Pt; b: Pt; ang: number; len: number };

/** Quantize a segment angle to one of the stroke-shape codes (y-up space). */
function segCode(s: Seg): string {
  const d = s.ang;
  if (d >= -22 && d <= 22) return "E"; // horizontal →
  if (d < -22 && d >= -50) return "NA"; // falling right ↘ (na / xie / wo)
  if (d < -50 && d >= -125) return "S"; // vertical ↓ (shu — slight slant ok)
  if (d < -125 && d >= -158) return "PE"; // falling left ↙ (pie)
  if (d <= -158 || d >= 158) return "W"; // horizontal ←
  if (d > 22 && d <= 50) return "UP"; // rising ↗ (ti)
  if (d > 50 && d <= 125) return "N"; // vertical ↑
  return "SW"; // ↖ (up-left hook tick)
}

const byId = (id: string): StandardStroke | null =>
  STANDARD_STROKES.find((s) => s.id === id) ?? null;

const PLAIN: [string, string][] = [
  // 3+ turn bends
  ["E,S,E,PE", "heng-zhe-zhe-pie"],
  ["S,E,S", "shu-zhe-zhe"],
  ["E,S,E,S", "heng-zhe-zhe"],
  ["E,S,E", "heng-zhe-zhe"],
  ["E,NA,UP", "heng-zhe-zhe-zhe-gou"],
  // two-segment compounds
  ["E,S", "heng-zhe"],
  ["E,NA", "heng-zhe-wan"],
  ["E,PE", "heng-pie"],
  ["E,UP", "heng-zhe-ti"],
  ["S,E", "shu-zhe"],
  ["S,PE", "shu-zhe-pie"],
  ["S,UP", "shu-ti"],
  ["PE,NA", "pie-dian"],
  ["PE,E", "pie-zhe"],
];

const HOOK: [string, string][] = [
  // single-segment + hook
  ["E", "heng-gou"],
  ["S", "shu-gou"],
  ["NA", "xie-gou"],
  ["PE", "heng-pie-wan-gou"],
  // 九-type long curved hook
  ["E,S,E", "heng-zhe-wan-gou"],
  // compounds + hook
  ["E,S", "heng-zhe-gou"],
  ["E,NA", "heng-zhe-wan-gou"],
  ["E,PE", "heng-pie-wan-gou"],
  ["S,E", "shu-wan-gou"],
  ["S,PE", "shu-zhe-pie"],
  ["S,NA", "pie-dian"],
  ["S,E,S", "shu-zhe-wan-gou"],
  ["E,S,E", "heng-zhe-zhe"],
  ["E,S,NA", "heng-zhe-zhe-zhe"],
  ["E,S,E,NA", "heng-zhe-zhe-zhe"],
  ["E,S,E,NA,PE", "heng-zhe-zhe-zhe"],
];

function flexureOf(pts: Pt[]): number {
  if (pts.length < 2) return 0;
  const a = pts[0];
  const b = pts[pts.length - 1];
  const len = dist(a, b);
  if (len < 1e-6) return 0;
  const abx = b.x - a.x;
  const aby = b.y - a.y;
  let maxD = 0;
  for (const p of pts) {
    const t = Math.max(0, Math.min(1, ((p.x - a.x) * abx + (p.y - a.y) * aby) / (len * len)));
    const d = Math.hypot(p.x - (a.x + abx * t), p.y - (a.y + aby * t));
    if (d > maxD) maxD = d;
  }
  return maxD / len;
}

/** Flexure of the stroke's arc with the trailing hook portion excluded. */
function flexureBody(pts: Pt[], total: number, hookLen: number): number {
  if (pts.length < 2) return 0;
  const keepArc = Math.max(0, total - hookLen * 0.5);
  let cut = pts.length - 1;
  let acc = 0;
  for (let i = 1; i < pts.length; i++) {
    acc += dist(pts[i - 1], pts[i]);
    if (acc >= keepArc) {
      cut = i;
      break;
    }
  }
  return flexureOf(pts.slice(0, cut + 1));
}

function classifySegs(
  segs: Seg[],
  total: number,
  pts: Pt[],
): StandardStroke | null {
  if (segs.length === 0) return null;

  // hook = short final segment turned ≥40° back from the previous one
  const last = segs[segs.length - 1];
  const prev = segs.length >= 2 ? segs[segs.length - 2] : null;
  const hook =
    !!prev &&
    last.len <= Math.max(26, total * 0.24) &&
    angDiff(last.ang, prev.ang) >= 40;
  const body = hook ? segs.slice(0, -1) : segs;

  // split into "arms" at sharp turns (≥60°) — a real 折 corner; smooth
  // curvature stays inside one arm (撇/捺/竖钩 bow without splitting)
  const arms: { segs: Seg[]; len: number; ang: number; code: string }[] = [];
  for (const s of body) {
    const cur = arms[arms.length - 1];
    if (cur && angDiff(cur.segs[cur.segs.length - 1].ang, s.ang) < 60) {
      cur.segs.push(s);
      cur.len += s.len;
    } else {
      arms.push({ segs: [s], len: s.len, ang: s.ang, code: "" });
    }
  }
  for (const g of arms) {
    const a = g.segs[0].a;
    const b = g.segs[g.segs.length - 1].b;
    g.ang = angleDeg(b.x - a.x, b.y - a.y);
    g.code = segCode({ ang: g.ang } as Seg);
  }

  const codes = arms.map((g) => g.code);
  const shortStroke = total <= 130;
  const head = arms[0].segs[0].ang;
  const tail = arms[0].segs[arms[0].segs.length - 1].ang;

  // polyline of one arm (a→b of each member) for curvature checks
  const armPts = (g: (typeof arms)[number]): Pt[] =>
    g.segs.map((s) => [s.a, s.b]).flat();

  if (codes.length === 1) {
    const g = arms[0];
    const c = g.code;
    const flex = flexureOf(armPts(g));
    const up = hook ? last.ang > 0 : false;
    const flatTail =
      hook && g.segs[g.segs.length - 1].len > 0.22 * total;
    const bent =
      head > -28 && head < 28 && angDiff(head, tail) >= 60;
    if (c === "E" || c === "W") {
      if (!hook) return byId(shortStroke ? "dian" : "heng");
      // 己-style: long flat run then up-hook = 竖弯钩, otherwise 横钩
      return byId(up && flatTail ? "shu-wan-gou" : "heng-gou");
    }
    if (c === "NA") {
      if (!hook) return byId(shortStroke ? "dian" : "na");
      if (bent) {
        // 口/门-type slanted shaft = 横折钩
        const shaft = g.segs.slice(1).flatMap((s) => [s.a, s.b]);
        return byId(
          flexureOf(shaft) > 0.14 ? "heng-zhe-wan-gou" : "heng-zhe-gou",
        );
      }
      // 心 bows up-right; 己 has a long flat tail first
      return byId(
        up ? (flatTail ? "shu-wan-gou" : "bian-xie-gou") : "xie-gou",
      );
    }
    if (c === "S" || c === "N") {
      if (!hook) {
        // a curved body in the vertical zone is a steep 撇, not 竖
        return shortStroke
          ? byId("dian")
          : flex > 0.12
            ? byId("pie")
            : byId("shu");
      }
      if (bent) {
        const shaft = g.segs.slice(1).flatMap((s) => [s.a, s.b]);
        return byId(
          flexureOf(shaft) > 0.14 ? "heng-zhe-wan-gou" : "heng-zhe-gou",
        );
      }
      // flatter body = 斜钩 (我); bowed = 弯钩 (家); straight = 竖钩 (小)
      if (Math.abs(g.ang) <= 72) return byId("xie-gou");
      return byId(flex > 0.1 ? "wan-gou" : "shu-gou");
    }
    switch (c) {
      case "PE":
        return byId(shortStroke ? "dian" : "pie");
      case "UP":
        return byId("ti");
      default:
        return shortStroke ? byId("dian") : null;
    }
  }

  // precedence: 九-type bowed turn with hook vs straight 月-type
  if (
    hook &&
    codes.length === 2 &&
    codes[0] === "E" &&
    (codes[1] === "S" || codes[1] === "NA")
  ) {
    const secondFlex = flexureOf(armPts(arms[1]));
    return byId(secondFlex > 0.14 ? "heng-zhe-wan-gou" : "heng-zhe-gou");
  }
  // 门/国-type right-side shaft is a straight 横折钩
  if (hook && codes.length === 2 && codes[0] === "E" && codes[1] === "E") {
    return byId("heng-zhe-gou");
  }

  // 女-type short 撇 + long 点 vs 八-type long 撇 + short flick
  if (codes.length === 2 && codes[0] === "PE" && codes[1] === "NA") {
    return byId(arms[0].len <= total * 0.5 ? "pie-dian" : "pie");
  }
  if (codes.length === 2 && codes[0] === "S" && codes[1] === "NA") {
    return byId(arms[0].len <= total * 0.55 ? "pie-dian" : "pie");
  }
  // 又-type real horizontal arm vs 我/你-type slanted lead-in
  if (codes.length === 2 && codes[0] === "E" && codes[1] === "PE") {
    return byId(arms[0].len <= total * 0.28 ? "pie" : "heng-pie");
  }

  if (hook && codes.length === 1) {
    const c = codes[0];
    if (c === "E") return byId("heng-gou");
    if (c === "NA") return byId("xie-gou");
    if (c === "S" || c === "N") {
      return byId(
        Math.abs(arms[0].ang) <= 72
          ? "xie-gou"
          : flexureOf(armPts(arms[0])) > 0.1
            ? "wan-gou"
            : "shu-gou",
      );
    }
    if (c === "PE") return byId("heng-pie-wan-gou");
  }

  const table = hook ? HOOK : PLAIN;
  for (const [pat, id] of table) {
    if (codes.join(",") === pat) return byId(id);
  }
  // slack match: a slightly slanted vertical still reads as 竖
  const slack = codes.map((c) => (c === "NA" ? "S" : c)).join(",");
  for (const [pat, id] of table) {
    if (slack === pat) return byId(id);
  }

  if (codes.every((c) => c === "E" || c === "W")) return byId("heng");
  if (codes.every((c) => c === "S" || c === "N")) return byId("shu");

  return null;
}

/** Main entry: classify a single stroke's median (raw [x,y] pairs). */
export function classifyStrokeByMedian(raw: number[][]): StandardStroke | null {
  const pts = toPts(raw);
  if (pts.length < 2) return null;

  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  const diag = Math.hypot(
    Math.max(...xs) - Math.min(...xs),
    Math.max(...ys) - Math.min(...ys),
  );
  if (!isFinite(diag) || diag < 1e-6) return null;

  const eps = Math.max(8, Math.min(45, diag * 0.04));
  const key = simplify(pts, eps);
  if (key.length < 2) return null;

  const segs: Seg[] = [];
  let total = 0;
  for (let i = 0; i < key.length - 1; i++) {
    const a = key[i];
    const b = key[i + 1];
    const len = dist(a, b);
    total += len;
    segs.push({ a, b, ang: angleDeg(b.x - a.x, b.y - a.y), len });
  }
  if (total <= 0) return null;

  return classifySegs(segs, total, pts);
}
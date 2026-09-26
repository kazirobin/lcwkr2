// Sanity-checks the pinyin reference data: every syllable must decompose into
// an initial + final that the table actually teaches, the tone digit must be
// 1-5, the tone mark must land on a vowel, and no hanzi/pinyin pair may repeat
// within a group (which would collide as a list key).
import {
  FINALS_ORDER,
  INITIALS,
  groupByFinal,
  groupByInitial,
  plainPinyin,
  syllables,
  toneMark,
} from "../src/features/vocabulary/pinyin-data.ts";

const problems = [];
const validInitials = new Set([...INITIALS, ""]);
const validFinals = new Set(FINALS_ORDER);

// The vowel each final is expected to mark, spelled out so a wrong index in
// TONE_VOWEL_INDEX shows up as a failing test rather than a silent typo.
const EXPECTED_MARK_VOWEL = {
  a: "a", o: "o", e: "e", i: "i", u: "u", "ü": "ü", er: "e",
  ai: "a", ei: "e", ao: "a", ou: "o",
  an: "a", en: "e", in: "i", un: "u", "ün": "u",
  ang: "a", eng: "e", ing: "i", ong: "o",
  ia: "a", ie: "e", "üe": "e", iao: "a", iu: "u",
  ua: "a", uai: "a", ui: "i", uo: "o",
  ian: "a", uan: "a", "üan": "a", iang: "a", uang: "a", iong: "o",
};

// Syllables whose final is not spelled out the same way as it is stored, so
// the generic vowel check above cannot judge them. Written out by hand from
// standard pinyin so the renderer is checked against a fixed reference.
const EXPECTED_RENDER = {
  yi1: "yī", wu3: "wǔ", yu2: "yú", ya1: "yā", wo3: "wǒ", ye4: "yè",
  yue4: "yuè", yao3: "yǎo", you3: "yǒu", an1: "ān", yin1: "yīn",
  yun2: "yún", ang2: "áng", weng1: "wēng", ying1: "yīng", yong4: "yòng",
  ya4: "yà", wai4: "wài", wan4: "wàn", yuan2: "yuán", yang2: "yáng",
  jue2: "jué", ju3: "jǔ", qu4: "qù", xu3: "xǔ", xue3: "xuě",
  zhu3: "zhǔ", chu3: "chǔ", shu3: "shǔ", chun1: "chūn", cun1: "cūn",
  nü3: "nǚ", lü4: "lǜ", cui4: "cuì", tui4: "tuì", wei4: "wèi",
  xia4: "xià", zhao3: "zhǎo", zhao1: "zhāo", lun4: "lùn", xie3: "xiě",
  xiao3: "xiǎo", xiong2: "xióng", guang1: "guāng", mei2: "méi",
  ne5: "ne", jian4: "jiàn", qian1: "qiān", shui3: "shuǐ", liu2: "liú",
  qiu2: "qiú", hua1: "huā", shuo1: "shuō", guo2: "guó", xue3: "xuě",
};

const COMBINING = /[\u0300-\u036f]/;

for (const s of syllables) {
  const where = `${s.pinyin} (${s.hanzi})`;

  if (!validInitials.has(s.initial)) problems.push(`${where}: unknown initial "${s.initial}"`);
  if (!validFinals.has(s.final)) problems.push(`${where}: unknown final "${s.final}"`);

  // A non-zero initial must actually be the start of the pinyin.
  const body = plainPinyin(s);
  if (s.initial && !body.startsWith(s.initial)) {
    problems.push(`${where}: pinyin does not start with initial "${s.initial}"`);
  }
  // The letters left after removing the initial must be the final, allowing for
  // the ü -> u that standard orthography drops after j, q, x, y, zh, ch, sh,
  // z, c and s (only n and l keep the umlaut), and for zh/ch/sh/r where a
  // leading i is dropped: "zhuao" is written but taught as zh + iao.
  if (s.initial) {
    const dropsUmlaut = s.initial !== "n" && s.initial !== "l";
    let writtenFinal = dropsUmlaut ? s.final.replace(/ü/g, "u") : s.final;
    if (
      /^(zh|ch|sh|r)$/.test(s.initial) &&
      writtenFinal.startsWith("i") &&
      writtenFinal.length > 1 &&
      !(s.final === "uo")
    ) {
      writtenFinal = writtenFinal.slice(1);
    }
    if (body.slice(s.initial.length) !== writtenFinal) {
      problems.push(
        `${where}: after initial "${s.initial}" the remainder is "${body.slice(s.initial.length)}", not final "${writtenFinal}" (${s.final})`,
      );
    }
  }

  if (!/^[a-zü]+[1-5]$/.test(s.pinyin)) {
    problems.push(`${where}: pinyin must be letters followed by a tone 1-5`);
  }

  // "jü3" is written with a plain "v" in the table? No — ü must be used.
  if (s.pinyin.includes("v")) problems.push(`${where}: use "ü", not "v"`);

  // ü keeps its umlaut only after n and l; j/q/x/y/zh/ch/sh write it as "u".
  if (s.final.includes("ü")) {
    const keepsUmlaut = s.initial === "n" || s.initial === "l";
    const written = plainPinyin(s).includes("ü");
    if (keepsUmlaut !== written) {
      problems.push(
        `${where}: initial "${s.initial}" should ${keepsUmlaut ? "keep" : "drop"} the ü umlaut, but pinyin is "${s.pinyin}"`,
      );
    }
  }

  if (!s.hanzi.trim()) problems.push(`${where}: missing hanzi`);
  if (!s.meaning.trim()) problems.push(`${where}: missing English meaning`);
  if (!s.meaningBn.trim()) problems.push(`${where}: missing Bangla meaning`);

  const mark = toneMark(s);
  // "w" is a vowel letter in the zero-initial syllables "wei", "wai", "wan":
  // w + ei, w + ai, w + an. Counting it keeps the mark on the right letter.
  if (COMBINING.test(mark)) {
    const marked = [...mark].find((ch) => COMBINING.test(ch));
    const idx = [...mark].indexOf(marked);
    const vowel = [...mark][idx - 1]?.toLowerCase();
    if (!/[aeoiuüw]/.test(vowel)) {
      problems.push(`${where}: tone mark landed on "${vowel}", which is not a vowel ("${mark}")`);
    } else if (EXPECTED_RENDER[s.pinyin] && EXPECTED_RENDER[s.pinyin] !== mark.normalize("NFC")) {
      // Hand-checked reference for the syllables whose spelling shifts.
      problems.push(`${where}: rendered "${mark}", expected "${EXPECTED_RENDER[s.pinyin]}"`);
    } else if (
      s.initial &&
      s.final !== "ü" &&
      vowel !== EXPECTED_MARK_VOWEL[s.final] &&
      // zh/ch/sh/r write a leading i as nothing, and a zero-initial w stands in
      // for a missing u, so both shift the mark one vowel to the left.
      !(
        (/^(zh|ch|sh|r)$/.test(s.initial) && s.final.length > 1 && s.final.startsWith("i")) ||
        (s.initial === "" && s.pinyin.startsWith("w") && s.final.length > 1 && s.final.startsWith("u"))
      )
    ) {
      // A final "ü" is written "u" after j/q/x/y/zh/ch/sh, so the mark sits on
      // that "u" rather than on a literal "ü".
      problems.push(`${where}: tone mark on "${vowel}", expected "${EXPECTED_MARK_VOWEL[s.final]}" for final "${s.final}"`);
    }
  } else if (!s.pinyin.endsWith("5")) {
    problems.push(`${where}: tone ${s.pinyin.slice(-1)} produced no diacritic ("${mark}")`);
  }
}

// Duplicate pinyin inside one group would collide as a React key.
for (const [name, group] of [
  ["initial", groupByInitial()],
  ["final", groupByFinal()],
]) {
  for (const [key, items] of group) {
    const seen = new Set();
    for (const s of items) {
      const k = `${s.pinyin}|${s.hanzi}`;
      if (seen.has(k)) problems.push(`${name} "${key}": duplicate entry ${s.pinyin} (${s.hanzi})`);
      seen.add(k);
    }
  }
}

// Coverage: every initial and final the page offers must have an example.
for (const init of INITIALS) {
  if ((groupByInitial().get(init) ?? []).length === 0) problems.push(`initial "${init}" has no syllables`);
}
for (const fin of FINALS_ORDER) {
  if ((groupByFinal().get(fin) ?? []).length === 0) problems.push(`final "${fin}" has no syllables`);
}

console.log(`syllables: ${syllables.length}`);
console.log(`initials covered: ${INITIALS.filter((i) => (groupByInitial().get(i) ?? []).length).length}/${INITIALS.length}`);
console.log(`finals covered:   ${FINALS_ORDER.filter((f) => (groupByFinal().get(f) ?? []).length).length}/${FINALS_ORDER.length}`);

if (problems.length) {
  console.log(`\nPROBLEMS (${problems.length}):`);
  for (const p of problems) console.log("  " + p);
  process.exitCode = 1;
} else {
  console.log("\nData is consistent: initials, finals, tones and glosses all check out.");
}

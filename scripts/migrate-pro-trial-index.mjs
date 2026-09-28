// One-off repair: the ProTrial collection picked up a plain visitorId index
// from an earlier schema, which blocked the unique one, so three concurrent
// first-visits could each insert a row for the same browser. Collapse any
// duplicates onto the oldest row and put the unique index in place.
//
// Idempotent: safe to run again, and it is committed so a fresh database gets
// the same treatment if the schema ever changes shape again.
import { MongoClient } from "mongodb";
import fs from "node:fs";

const envPath =
  process.argv[2] ?? "C:/Users/Robin/Documents/Default Project/lcwkr2/.env.local";
const env = fs.readFileSync(envPath, "utf8");
const uri = env.match(/^MONGODB_URI=(.*)$/m)?.[1]?.trim();
if (!uri) {
  console.error("MONGODB_URI not found in", envPath);
  process.exit(1);
}

const client = new MongoClient(uri);
await client.connect();
const col = client.db().collection("protrials");

// 1. Fold duplicates onto the earliest row for each visitor.
const groups = await col
  .aggregate([
    { $group: { _id: "$visitorId", ids: { $push: "$_id" }, n: { $sum: 1 } } },
    { $match: { n: { $gt: 1 } } },
  ])
  .toArray();

let removed = 0;
for (const g of groups) {
  const ids = g.ids.map((id) => id.toString());
  const docs = await col.find({ _id: { $in: g.ids } }).toArray();
  docs.sort((a, b) => new Date(a.startedAt) - new Date(b.startedAt));
  const keep = docs[0];
  const drop = docs.slice(1);

  for (const d of drop) {
    // Carry the furthest-along state onto the row that survives, so a renewal
    // or spent time is not lost by the tidy-up.
    await col.updateOne(
      { _id: keep._id },
      {
        $max: {
          expiresAt: d.expiresAt,
          usedMs: d.usedMs ?? 0,
          renewals: d.renewals ?? 0,
        },
        $set: {
          whatsapp: keep.whatsapp || d.whatsapp || "",
          name: keep.name || d.name || "",
          rollNumber: keep.rollNumber ?? d.rollNumber ?? null,
        },
      },
    );
    await col.deleteOne({ _id: d._id });
    removed += 1;
  }
  console.log(`  ${g._id.slice(0, 12)}: kept 1 of ${docs.length}`);
}
console.log(`duplicate rows removed: ${removed}`);

// 2. Swap the plain index for the unique one.
const indexes = await col.indexes();
const plain = indexes.find((i) => i.key?.visitorId === 1 && i.unique !== true);
if (plain) {
  await col.dropIndex(plain.name);
  console.log(`dropped non-unique index "${plain.name}"`);
}
await col.createIndex({ visitorId: 1 }, { unique: true, name: "visitorId_1" });
console.log("created unique index on visitorId");

const after = await col.indexes();
console.log("\nindexes now:");
for (const i of after) {
  console.log(`  ${i.name.padEnd(18)} ${JSON.stringify(i.key)} unique=${!!i.unique}`);
}
console.log(`\nrows: ${await col.countDocuments()}`);

await client.close();

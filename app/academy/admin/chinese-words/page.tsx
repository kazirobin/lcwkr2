"use client";

import React, { useState, useEffect } from "react";

export default function AdminChineseWordsPage() {
  const [words, setWords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
// ১. স্টেট ও হ্যান্ডলার ফাংশনটি যোগ করুন:
const [seeding, setSeeding] = useState(false);

const handleBulkSeed = async () => {
  if (!confirm("Are you sure you want to push all pre-defined demo words to MongoDB?")) return;
  
  setSeeding(true);
  try {
    const res = await fetch("/api/chinese-words/seed", { method: "POST" });
    const json = await res.json();
    if (json.success) {
      alert("✅ " + json.message);
      loadWords(); // ডাটা রিফ্রেশ করবে
    } else {
      alert("❌ " + json.message);
    }
  } catch (err: any) {
    alert("Error: " + err.message);
  } finally {
    setSeeding(false);
  }
};
  // Form State
  const [editId, setEditId] = useState<string | null>(null);
  const [character, setCharacter] = useState("");
  const [pinyin, setPinyin] = useState("");
  const [meaningEn, setMeaningEn] = useState("");
  const [meaningBn, setMeaningBn] = useState("");
  const [hskLevel, setHskLevel] = useState(1);
  const [relatedWords, setRelatedWords] = useState<any[]>([]);

  // Fetch words
  const loadWords = async () => {
    setLoading(true);
    const res = await fetch("/api/chinese-words");
    const json = await res.json();
    if (json.success) setWords(json.data);
    setLoading(false);
  };

  useEffect(() => {
    loadWords();
  }, []);

  // Form Reset
  const resetForm = () => {
    setEditId(null);
    setCharacter("");
    setPinyin("");
    setMeaningEn("");
    setMeaningBn("");
    setHskLevel(1);
    setRelatedWords([]);
  };

  // Edit Trigger
  const handleEdit = (item: any) => {
    setEditId(item._id);
    setCharacter(item.character);
    setPinyin(item.pinyin);
    setMeaningEn(item.meaningEn);
    setMeaningBn(item.meaningBn);
    setHskLevel(item.hskLevel || 1);
    setRelatedWords(item.relatedWords || []);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this word?")) return;
    const res = await fetch(`/api/chinese-words?id=${id}`, { method: "DELETE" });
    if (res.ok) loadWords();
  };

  // Add / Remove dynamic related words
  const addRelatedWord = () => {
    setRelatedWords([
      ...relatedWords,
      { word: "", pinyin: "", meaningEn: "", meaningBn: "", examples: [] },
    ]);
  };

  const removeRelatedWord = (idx: number) => {
    setRelatedWords(relatedWords.filter((_, i) => i !== idx));
  };

  // Add example inside related word
  const addExample = (wordIdx: number) => {
    const updated = [...relatedWords];
    updated[wordIdx].examples.push({ chinese: "", pinyin: "", meaningEn: "", meaningBn: "" });
    setRelatedWords(updated);
  };

  // Submit Handler (Create & Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      _id: editId,
      character,
      pinyin,
      meaningEn,
      meaningBn,
      hskLevel: Number(hskLevel),
      relatedWords,
    };

    const method = editId ? "PUT" : "POST";
    const res = await fetch("/api/chinese-words", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      resetForm();
      loadWords();
      alert(editId ? "Updated successfully!" : "Created successfully!");
    } else {
      alert("Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen bg-background text-text p-6 sm:p-10 max-w-6xl mx-auto space-y-12 font-sans">
      <div>
        <h1 className="text-2xl font-bold">Chinese Words Admin (CRUD)</h1>
        <p className="text-xs text-text/60">
          Create, edit, and delete core characters with sub-word networks.
        </p>
      </div>
      <button
  type="button"
  onClick={handleBulkSeed}
  disabled={seeding}
  className="px-3.5 py-2 bg-primary hover:bg-primary/90 text-background font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all shadow-sm"
>
  {seeding ? "Pushing Words..." : "⚡ Push Bulk Demo Words"}
</button>

      {/* Form: Create or Edit */}
      <form
        onSubmit={handleSubmit}
        className="p-6 border border-text/15 rounded-2xl bg-background/50 space-y-6 shadow-sm"
      >
        <div className="flex justify-between items-center border-b border-text/10 pb-3">
          <h2 className="font-semibold text-base">
            {editId ? `Editing: ${character}` : "Add New Core Character"}
          </h2>
          {editId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-xs text-secondary underline cursor-pointer"
            >
              Cancel Edit
            </button>
          )}
        </div>

        {/* Core fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <input
            placeholder="Character (学)"
            value={character}
            onChange={(e) => setCharacter(e.target.value)}
            required
            className="border border-text/20 p-2 rounded-lg bg-background text-sm"
          />
          <input
            placeholder="Pinyin (xué)"
            value={pinyin}
            onChange={(e) => setPinyin(e.target.value)}
            required
            className="border border-text/20 p-2 rounded-lg bg-background text-sm"
          />
          <input
            placeholder="English Meaning"
            value={meaningEn}
            onChange={(e) => setMeaningEn(e.target.value)}
            required
            className="border border-text/20 p-2 rounded-lg bg-background text-sm"
          />
          <input
            placeholder="Bangla Meaning"
            value={meaningBn}
            onChange={(e) => setMeaningBn(e.target.value)}
            required
            className="border border-text/20 p-2 rounded-lg bg-background text-sm"
          />
          <select
            value={hskLevel}
            onChange={(e) => setHskLevel(Number(e.target.value))}
            className="border border-text/20 p-2 rounded-lg bg-background text-sm"
          >
            {[1, 2, 3, 4, 5, 6].map((l) => (
              <option key={l} value={l}>
                HSK {l}
              </option>
            ))}
          </select>
        </div>

        {/* Related words */}
        <div className="space-y-4 pt-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono uppercase tracking-wider text-text/60">
              Related Words ({relatedWords.length})
            </span>
            <button
              type="button"
              onClick={addRelatedWord}
              className="px-3 py-1 bg-text text-background text-xs rounded-md font-medium"
            >
              + Add Word
            </button>
          </div>

          {relatedWords.map((rw, rwIdx) => (
            <div key={rwIdx} className="p-4 border border-text/10 rounded-xl bg-text/[0.02] space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold">Word #{rwIdx + 1}</span>
                <button
                  type="button"
                  onClick={() => removeRelatedWord(rwIdx)}
                  className="text-secondary text-xs hover:underline"
                >
                  Remove
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <input
                  placeholder="Word (学习)"
                  value={rw.word}
                  onChange={(e) => {
                    const u = [...relatedWords];
                    u[rwIdx].word = e.target.value;
                    setRelatedWords(u);
                  }}
                  className="border border-text/20 p-1.5 rounded text-xs bg-background"
                />
                <input
                  placeholder="Pinyin (xuéxí)"
                  value={rw.pinyin}
                  onChange={(e) => {
                    const u = [...relatedWords];
                    u[rwIdx].pinyin = e.target.value;
                    setRelatedWords(u);
                  }}
                  className="border border-text/20 p-1.5 rounded text-xs bg-background"
                />
                <input
                  placeholder="English"
                  value={rw.meaningEn}
                  onChange={(e) => {
                    const u = [...relatedWords];
                    u[rwIdx].meaningEn = e.target.value;
                    setRelatedWords(u);
                  }}
                  className="border border-text/20 p-1.5 rounded text-xs bg-background"
                />
                <input
                  placeholder="Bangla"
                  value={rw.meaningBn}
                  onChange={(e) => {
                    const u = [...relatedWords];
                    u[rwIdx].meaningBn = e.target.value;
                    setRelatedWords(u);
                  }}
                  className="border border-text/20 p-1.5 rounded text-xs bg-background"
                />
              </div>

              {/* Examples in word */}
              <div className="pl-4 border-l-2 border-text/15 space-y-2 pt-1">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-text/50">Sentences</span>
                  <button
                    type="button"
                    onClick={() => addExample(rwIdx)}
                    className="text-[11px] text-secondary font-medium"
                  >
                    + Add Sentence
                  </button>
                </div>

                {rw.examples?.map((ex: any, exIdx: number) => (
                  <div key={exIdx} className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    <input
                      placeholder="Chinese Sentence"
                      value={ex.chinese}
                      onChange={(e) => {
                        const u = [...relatedWords];
                        u[rwIdx].examples[exIdx].chinese = e.target.value;
                        setRelatedWords(u);
                      }}
                      className="border border-text/15 p-1 rounded text-[11px] bg-background"
                    />
                    <input
                      placeholder="Pinyin"
                      value={ex.pinyin}
                      onChange={(e) => {
                        const u = [...relatedWords];
                        u[rwIdx].examples[exIdx].pinyin = e.target.value;
                        setRelatedWords(u);
                      }}
                      className="border border-text/15 p-1 rounded text-[11px] bg-background"
                    />
                    <input
                      placeholder="English"
                      value={ex.meaningEn}
                      onChange={(e) => {
                        const u = [...relatedWords];
                        u[rwIdx].examples[exIdx].meaningEn = e.target.value;
                        setRelatedWords(u);
                      }}
                      className="border border-text/15 p-1 rounded text-[11px] bg-background"
                    />
                    <input
                      placeholder="Bangla"
                      value={ex.meaningBn}
                      onChange={(e) => {
                        const u = [...relatedWords];
                        u[rwIdx].examples[exIdx].meaningBn = e.target.value;
                        setRelatedWords(u);
                      }}
                      className="border border-text/15 p-1 rounded text-[11px] bg-background"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="w-full bg-secondary text-background py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition cursor-pointer"
        >
          {editId ? "Update Character" : "Save Character"}
        </button>
      </form>

      {/* Words List Table */}
      <div className="space-y-4">
        <h2 className="font-semibold text-lg">Existing Core Words ({words.length})</h2>
        {loading ? (
          <p className="text-sm text-text/50">Loading...</p>
        ) : (
          <div className="border border-text/15 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-text/5 text-xs text-text/60 border-b border-text/10">
                <tr>
                  <th className="p-3">Character</th>
                  <th className="p-3">Pinyin</th>
                  <th className="p-3">Meanings</th>
                  <th className="p-3">HSK</th>
                  <th className="p-3">Words</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-text/10">
                {words.map((w) => (
                  <tr key={w._id} className="hover:bg-text/[0.02]">
                    <td className="p-3 font-serif text-xl font-bold">{w.character}</td>
                    <td className="p-3 text-secondary font-mono">{w.pinyin}</td>
                    <td className="p-3">
                      <div>{w.meaningEn}</div>
                      <div className="text-xs text-text/50">{w.meaningBn}</div>
                    </td>
                    <td className="p-3">HSK {w.hskLevel}</td>
                    <td className="p-3">{w.relatedWords?.length || 0}</td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(w)}
                        className="text-xs text-blue-500 hover:underline cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(w._id)}
                        className="text-xs text-secondary hover:underline cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, X } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { AdminShell } from "@/features/academy/components/admin/AdminShell";
import {
  Button,
  Card,
  EmptyState,
  Field,
  IconButton,
  LoadingBlock,
  SelectField,
  TableFrame,
  Td,
  Th,
  useConfirm,
  useToast,
} from "@/components/ui";

type Example = { chinese: string; pinyin: string; meaningEn: string; meaningBn: string };
type Related = { word: string; pinyin: string; meaningEn: string; meaningBn: string; examples: Example[] };
type Word = {
  _id: string;
  character: string;
  pinyin: string;
  meaningEn: string;
  meaningBn: string;
  hskLevel: number;
  relatedWords?: Related[];
};

const EMPTY = { character: "", pinyin: "", meaningEn: "", meaningBn: "", hskLevel: 1, relatedWords: [] as Related[] };

export default function AdminChineseWordsPage() {
  const { language } = useLanguage();
  const t = useCallback(
    (bn: string, en: string) => (language === "bn" ? bn : en),
    [language],
  );
  const toast = useToast();
  const confirm = useConfirm();

  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [saving, setSaving] = useState(false);

  const loadWords = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/chinese-words", { cache: "no-store" });
      const json = await res.json();
      if (json.success) setWords(json.data || []);
    } catch {
      toast(t("শব্দ লোড করা যায়নি।", "Couldn't load words."), "error");
    } finally {
      setLoading(false);
    }
  }, [t, toast]);

  useEffect(() => {
    loadWords();
  }, [loadWords]);

  const reset = () => {
    setEditId(null);
    setForm({ ...EMPTY });
  };

  const startEdit = (w: Word) => {
    setEditId(w._id);
    setForm({
      character: w.character,
      pinyin: w.pinyin,
      meaningEn: w.meaningEn,
      meaningBn: w.meaningBn,
      hskLevel: w.hskLevel || 1,
      relatedWords: w.relatedWords || [],
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const setRelated = (i: number, patch: Partial<Related>) =>
    setForm((f) => ({
      ...f,
      relatedWords: f.relatedWords.map((r, idx) => (idx === i ? { ...r, ...patch } : r)),
    }));

  const setExample = (ri: number, ei: number, patch: Partial<Example>) =>
    setForm((f) => ({
      ...f,
      relatedWords: f.relatedWords.map((r, idx) =>
        idx === ri
          ? { ...r, examples: r.examples.map((ex, j) => (j === ei ? { ...ex, ...patch } : ex)) }
          : r,
      ),
    }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/chinese-words", {
        method: editId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: editId, ...form, hskLevel: Number(form.hskLevel) }),
      });
      if (res.ok) {
        toast(editId ? t("আপডেট হয়েছে।", "Updated.") : t("যোগ করা হয়েছে।", "Added."), "success");
        reset();
        loadWords();
      } else {
        toast(t("সংরক্ষণ হয়নি।", "Save failed."), "error");
      }
    } catch {
      toast(t("সমস্যা হয়েছে।", "Something went wrong."), "error");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (w: Word) => {
    const ok = await confirm({
      title: t("শব্দ মুছবেন?", "Delete this word?"),
      message: `${w.character} · ${w.pinyin}`,
      confirmLabel: t("মুছুন", "Delete"),
      destructive: true,
    });
    if (!ok) return;
    try {
      const res = await fetch(`/api/chinese-words?id=${w._id}`, { method: "DELETE" });
      if (res.ok) {
        toast(t("মুছে ফেলা হয়েছে।", "Deleted."), "success");
        loadWords();
      } else toast(t("মোছা যায়নি।", "Delete failed."), "error");
    } catch {
      toast(t("সমস্যা হয়েছে।", "Something went wrong."), "error");
    }
  };

  return (
    <AdminShell
      title={t("চাইনিজ কোর ওয়ার্ডস", "Chinese core words")}
      crumb={t("কোর ওয়ার্ডস", "Core words")}
      seal="字"
      lede={t("কোর ক্যারেক্টার, তাদের পিনইন, অর্থ ও সম্পর্কিত শব্দ পরিবার পরিচালনা করুন।", "Manage core characters, their pinyin, meanings, and related word families.")}
    >
      <Card className="p-6">
        <form onSubmit={submit} className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-text">
              {editId ? t(`সম্পাদনা: ${form.character}`, `Editing: ${form.character}`) : t("নতুন কোর ক্যারেক্টার", "New core character")}
            </h2>
            {editId && (
              <Button type="button" variant="ghost" size="sm" onClick={reset}>
                {t("সম্পাদনা বাতিল", "Cancel edit")}
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label={t("ক্যারেক্টার", "Character")} required lang="zh" placeholder="学" value={form.character} onChange={(e) => setForm({ ...form, character: e.target.value })} />
            <Field label={t("পিনইন", "Pinyin")} required placeholder="xué" value={form.pinyin} onChange={(e) => setForm({ ...form, pinyin: e.target.value })} />
            <SelectField label={t("HSK স্তর", "HSK level")} value={form.hskLevel} onChange={(e) => setForm({ ...form, hskLevel: Number(e.target.value) })}>
              {[1, 2, 3, 4, 5, 6].map((l) => (
                <option key={l} value={l}>
                  HSK {l}
                </option>
              ))}
            </SelectField>
            <Field label={t("ইংরেজি অর্থ", "English meaning")} required value={form.meaningEn} onChange={(e) => setForm({ ...form, meaningEn: e.target.value })} />
            <Field label={t("বাংলা অর্থ", "Bangla meaning")} required value={form.meaningBn} onChange={(e) => setForm({ ...form, meaningBn: e.target.value })} />
          </div>

          <div className="space-y-4 border-t border-text/10 pt-4">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-text/55">
                {t(`সম্পর্কিত শব্দ (${form.relatedWords.length})`, `Related words (${form.relatedWords.length})`)}
              </p>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                iconLeft={<Plus className="h-3.5 w-3.5" />}
                onClick={() =>
                  setForm((f) => ({
                    ...f,
                    relatedWords: [...f.relatedWords, { word: "", pinyin: "", meaningEn: "", meaningBn: "", examples: [] }],
                  }))
                }
              >
                {t("শব্দ যোগ", "Add word")}
              </Button>
            </div>

            {form.relatedWords.map((rw, ri) => (
              <div key={ri} className="rounded-xl border border-text/10 bg-text/2 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-text/70">
                    {t(`শব্দ ${ri + 1}`, `Word ${ri + 1}`)}
                  </span>
                  <IconButton
                    label={t("এই শব্দ সরান", "Remove this word")}
                    size="sm"
                    className="h-7 w-7"
                    onClick={() => setForm((f) => ({ ...f, relatedWords: f.relatedWords.filter((_, i) => i !== ri) }))}
                  >
                    <X className="h-3.5 w-3.5" />
                  </IconButton>
                </div>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field label={t("শব্দ", "Word")} lang="zh" placeholder="学习" value={rw.word} onChange={(e) => setRelated(ri, { word: e.target.value })} />
                  <Field label={t("পিনইন", "Pinyin")} placeholder="xuéxí" value={rw.pinyin} onChange={(e) => setRelated(ri, { pinyin: e.target.value })} />
                  <Field label={t("ইংরেজি", "English")} value={rw.meaningEn} onChange={(e) => setRelated(ri, { meaningEn: e.target.value })} />
                  <Field label={t("বাংলা", "Bangla")} value={rw.meaningBn} onChange={(e) => setRelated(ri, { meaningBn: e.target.value })} />
                </div>

                <div className="mt-3 border-l-2 border-text/15 pl-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-text/50">{t("উদাহরণ বাক্য", "Example sentences")}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setRelated(ri, {
                          examples: [...rw.examples, { chinese: "", pinyin: "", meaningEn: "", meaningBn: "" }],
                        })
                      }
                    >
                      {t("বাক্য যোগ", "Add sentence")}
                    </Button>
                  </div>
                  {rw.examples.map((ex, ei) => (
                    <div key={ei} className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <Field label={t("চাইনিজ বাক্য", "Chinese sentence")} lang="zh" value={ex.chinese} onChange={(e) => setExample(ri, ei, { chinese: e.target.value })} />
                      <Field label={t("পিনইন", "Pinyin")} value={ex.pinyin} onChange={(e) => setExample(ri, ei, { pinyin: e.target.value })} />
                      <Field label={t("ইংরেজি", "English")} value={ex.meaningEn} onChange={(e) => setExample(ri, ei, { meaningEn: e.target.value })} />
                      <Field label={t("বাংলা", "Bangla")} value={ex.meaningBn} onChange={(e) => setExample(ri, ei, { meaningBn: e.target.value })} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <Button type="submit" loading={saving} className="w-full">
            {editId ? t("ক্যারেক্টার আপডেট", "Update character") : t("ক্যারেক্টার সংরক্ষণ", "Save character")}
          </Button>
        </form>
      </Card>

      <section className="mt-10">
        <h2 className="text-base font-bold text-text">
          {t(`বিদ্যমান কোর ওয়ার্ডস (${words.length})`, `Existing core words (${words.length})`)}
        </h2>
        <div className="mt-4">
          {loading ? (
            <LoadingBlock label={t("লোড হচ্ছে", "Loading")} rows={3} />
          ) : words.length === 0 ? (
            <EmptyState title={t("কোনো শব্দ নেই", "No words yet")} />
          ) : (
            <TableFrame
              caption={t("কোর ওয়ার্ডসের তালিকা", "Core words")}
              minWidth="44rem"
              head={
                <>
                  <Th>{t("ক্যারেক্টার", "Character")}</Th>
                  <Th>{t("পিনইন", "Pinyin")}</Th>
                  <Th>{t("অর্থ", "Meaning")}</Th>
                  <Th>HSK</Th>
                  <Th>{t("শব্দ", "Words")}</Th>
                  <Th className="text-right">{t("কাজ", "Actions")}</Th>
                </>
              }
            >
              {words.map((w) => (
                <tr key={w._id}>
                  <Td lang="zh" className="text-xl font-bold text-text">
                    {w.character}
                  </Td>
                  <Td>{w.pinyin}</Td>
                  <Td>
                    <span className="block text-text">{w.meaningEn}</span>
                    <span className="block text-xs text-text/50">{w.meaningBn}</span>
                  </Td>
                  <Td className="tabular-nums">HSK {w.hskLevel}</Td>
                  <Td className="tabular-nums">{w.relatedWords?.length || 0}</Td>
                  <Td className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="secondary" size="sm" onClick={() => startEdit(w)}>
                        {t("সম্পাদনা", "Edit")}
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => remove(w)}>
                        {t("মুছুন", "Delete")}
                      </Button>
                    </div>
                  </Td>
                </tr>
              ))}
            </TableFrame>
          )}
        </div>
      </section>
    </AdminShell>
  );
}

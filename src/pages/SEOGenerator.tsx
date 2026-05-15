import { useState } from "react";
import { Search, Star, BarChart3, Hash } from "lucide-react";
import { seoApi } from "../services/api";
import type { SEOTitleResponse, KeywordResponse } from "../types";
import PageHeader from "../components/ui/PageHeader";
import LoadingState from "../components/ui/LoadingState";
import CopyButton from "../components/ui/CopyButton";
import toast from "react-hot-toast";

export default function SEOGenerator() {
  const [topic,        setTopic]        = useState("");
  const [keywords,     setKeywords]     = useState("");
  const [activeTab,    setActiveTab]    = useState<"titles"|"keywords">("titles");
  const [titlesLoading,setTitlesLoading]= useState(false);
  const [kwLoading,    setKwLoading]    = useState(false);
  const [titlesResult, setTitlesResult] = useState<SEOTitleResponse | null>(null);
  const [kwResult,     setKwResult]     = useState<KeywordResponse  | null>(null);

  const handleGenerateTitles = async () => {
    if (!topic.trim()) return toast.error("Please enter a topic");
    setTitlesLoading(true); setTitlesResult(null); setActiveTab("titles");
    try {
      const kw = keywords.trim() ? keywords.split(",").map(k => k.trim()) : undefined;
      setTitlesResult(await seoApi.generateTitles({ topic: topic.trim(), keywords: kw }) as SEOTitleResponse);
      toast.success("SEO titles generated!");
    } catch (err) { toast.error(err instanceof Error ? err.message : "Failed"); }
    finally       { setTitlesLoading(false); }
  };

  const handleResearchKeywords = async () => {
    if (!topic.trim()) return toast.error("Please enter a topic");
    setKwLoading(true); setKwResult(null); setActiveTab("keywords");
    try {
      setKwResult(await seoApi.researchKeywords({ topic: topic.trim() }) as KeywordResponse);
      toast.success("Keyword research complete!");
    } catch (err) { toast.error(err instanceof Error ? err.message : "Failed"); }
    finally       { setKwLoading(false); }
  };

  const scoreColor    = (s: number) => s >= 8 ? "text-emerald-600" : s >= 5 ? "text-amber-600" : "text-red-600";
  const scoreBarColor = (s: number) => s >= 8 ? "bg-emerald-500"   : s >= 5 ? "bg-amber-500"   : "bg-red-500";
  const busy = titlesLoading || kwLoading;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<Search size={18} className="text-white" />}
        title="SEO & Title Generator"
        subtitle="SEO-optimized titles, keyword research, and tag suggestions"
        gradient="from-indigo-400 to-violet-500"
      />

      <div className="gen-layout">

        {/* ── Left: Form ── */}
        <div className="form-panel">
          <div className="glass-card p-5 space-y-4">
            <div>
              <label className="field-label">Topic *</label>
              <input className="input-field"
                placeholder="e.g., AI tools for productivity in 2025"
                value={topic} onChange={e => setTopic(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter") activeTab === "titles" ? handleGenerateTitles() : handleResearchKeywords();
                }} />
            </div>
            <div>
              <label className="field-label">Target Keywords <span className="normal-case font-normal text-slate-400">(comma separated)</span></label>
              <input className="input-field"
                placeholder="e.g., AI tools, productivity, best AI apps"
                value={keywords} onChange={e => setKeywords(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2.5">
              <button className="btn-gradient w-full" onClick={handleGenerateTitles} disabled={busy}>
                <Search size={15} />
                {titlesLoading ? "Generating…" : "SEO Titles"}
              </button>
              <button className="btn-ghost w-full" onClick={handleResearchKeywords} disabled={busy}>
                <Hash size={14} />
                {kwLoading ? "Researching…" : "Keyword Research"}
              </button>
            </div>
          </div>
        </div>

        {/* ── Right: Results ── */}
        <div className="results-panel">

          {/* Tabs */}
          {(titlesResult || kwResult) && (
            <div className="tab-bar">
              <button className={`tab-btn ${activeTab === "titles"   ? "tab-btn-active" : "tab-btn-inactive"}`} onClick={() => setActiveTab("titles")}>Titles</button>
              <button className={`tab-btn ${activeTab === "keywords" ? "tab-btn-active" : "tab-btn-inactive"}`} onClick={() => setActiveTab("keywords")}>Keywords</button>
            </div>
          )}

          {/* Loading */}
          {titlesLoading && <LoadingState message="Crafting SEO-optimized titles…" />}
          {kwLoading     && <LoadingState message="Performing deep keyword research…" />}

          {/* Empty */}
          {!busy && !titlesResult && !kwResult && (
            <div className="empty-state">
              <Search size={32} className="text-indigo-300" />
              <p className="text-sm font-medium text-slate-500">Enter a topic to start</p>
              <p className="text-xs text-slate-400">Choose SEO Titles or Keyword Research</p>
            </div>
          )}

          {/* Titles */}
          {activeTab === "titles" && titlesResult && !titlesLoading && (
            <>
              {titlesResult.titleFormulas && (
                <div className="result-section animate-fade-in-up">
                  <h3 className="text-sm font-bold text-slate-900 mb-3">📐 Proven Title Formulas</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {titlesResult.titleFormulas.map((f, i) => (
                      <div key={i} className="flex gap-2 p-2.5 rounded-lg muted-surface text-xs text-slate-600 leading-relaxed">
                        <span className="text-violet-600 font-semibold shrink-0">{i + 1}.</span>{f}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {titlesResult.titles?.map((t, i) => (
                <div key={i}
                  className={`result-section ${i === titlesResult.bestTitle ? "border-emerald-200 bg-emerald-50/30 ring-1 ring-emerald-100" : ""}`}
                  style={{ animationDelay: `${i * .04}s` }}>
                  <div className="flex gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-xs font-bold text-indigo-500">#{i + 1}</span>
                        {i === titlesResult.bestTitle && <span className="badge badge-easy"><Star size={10} /> Best Pick</span>}
                        <span className="tag">{t.category}</span>
                      </div>
                      <p className="text-[.93rem] font-semibold text-slate-900 mb-3 leading-snug">{t.title}</p>

                      <div className="grid grid-cols-2 gap-3 mb-3">
                        {[{ label: "SEO Score", score: t.seoScore }, { label: "CTR Score", score: t.ctrScore }].map(({ label, score }) => (
                          <div key={label}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-slate-500">{label}</span>
                              <span className={`text-xs font-bold ${scoreColor(score)}`}>{score}/10</span>
                            </div>
                            <div className="score-bar"><div className={`score-bar-fill ${scoreBarColor(score)}`} style={{ width: `${score * 10}%` }} /></div>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500 mb-2">
                        <span>Emotion: <span className="text-amber-700 font-medium">{t.emotionalTrigger}</span></span>
                        <span>{t.characterCount} chars</span>
                        <span>Intent: {t.searchIntent}</span>
                      </div>
                      {t.powerWords && (
                        <div className="flex flex-wrap gap-1.5">
                          {t.powerWords.map((w, j) => <span key={j} className="tag">{w}</span>)}
                        </div>
                      )}
                    </div>
                    <CopyButton text={t.title} />
                  </div>
                </div>
              ))}

              {titlesResult.keywordSuggestions && (
                <div className="result-section animate-fade-in-up">
                  <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <BarChart3 size={14} className="text-violet-600 shrink-0" /> Related Keywords
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {titlesResult.keywordSuggestions.map((kw, i) => (
                      <button key={i} className="tag cursor-pointer"
                        onClick={() => { navigator.clipboard.writeText(kw); toast.success("Copied!"); }}>
                        {kw}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Keywords */}
          {activeTab === "keywords" && kwResult && !kwLoading && (
            <>
              {kwResult.primaryKeywords && (
                <div className="result-section animate-fade-in-up">
                  <h3 className="text-sm font-bold text-slate-900 mb-3">🎯 Primary Keywords</h3>
                  <div className="overflow-x-auto -mx-5 px-5" style={{ scrollbarWidth: "thin" }}>
                    <table className="w-full text-sm" style={{ minWidth: 400 }}>
                      <thead>
                        <tr className="text-left text-[.67rem] text-slate-500 border-b border-slate-200 uppercase tracking-wider">
                          <th className="py-2 pr-4 font-semibold">Keyword</th>
                          <th className="py-2 pr-4 font-semibold">Volume</th>
                          <th className="py-2 pr-4 font-semibold">Competition</th>
                          <th className="py-2 font-semibold">Difficulty</th>
                        </tr>
                      </thead>
                      <tbody>
                        {kwResult.primaryKeywords.map((kw, i) => (
                          <tr key={i} className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors">
                            <td className="py-2.5 pr-4 text-slate-900 font-medium text-[.84rem]">{kw.keyword}</td>
                            <td className="py-2.5 pr-4 text-slate-600 text-[.84rem]">{kw.searchVolume}</td>
                            <td className="py-2.5 pr-4">
                              <span className={`badge ${kw.competition === "low" ? "badge-easy" : kw.competition === "medium" ? "badge-medium" : "badge-hard"}`}>
                                {kw.competition}
                              </span>
                            </td>
                            <td className="py-2.5">
                              <span className={`text-xs font-bold ${scoreColor(11 - kw.difficulty)}`}>{kw.difficulty}/10</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {kwResult.tagSuggestions && (
                <div className="result-section animate-fade-in-up">
                  <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
                    <h3 className="text-sm font-bold text-slate-900">🏷️ YouTube Tags ({kwResult.tagSuggestions.length})</h3>
                    <CopyButton text={kwResult.tagSuggestions.join(", ")} label="Copy All" />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {kwResult.tagSuggestions.map((tag, i) => <span key={i} className="tag">{tag}</span>)}
                  </div>
                </div>
              )}

              {kwResult.hashtagSuggestions && (
                <div className="result-section animate-fade-in-up">
                  <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
                    <h3 className="text-sm font-bold text-slate-900"># Hashtags</h3>
                    <CopyButton text={kwResult.hashtagSuggestions.join(" ")} label="Copy All" />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {kwResult.hashtagSuggestions.map((h, i) => <span key={i} className="tag text-indigo-600">{h}</span>)}
                  </div>
                </div>
              )}

              {kwResult.seoStrategy && (
                <div className="result-section animate-fade-in-up">
                  <h3 className="text-sm font-bold text-slate-900 mb-3">📋 SEO Strategy</h3>
                  <p className="text-[.84rem] text-slate-700 mb-3 leading-relaxed">{kwResult.seoStrategy.summary}</p>
                  <p className="text-xs text-emerald-700 mb-3">
                    Best keyword: <strong className="font-semibold">{kwResult.seoStrategy.bestKeywordToTarget}</strong>
                  </p>
                  {kwResult.seoStrategy.contentCalendar && (
                    <div className="space-y-1.5">
                      <p className="text-xs font-semibold text-slate-600 mb-2">Content Calendar</p>
                      {kwResult.seoStrategy.contentCalendar.map((item, i) => (
                        <div key={i} className="flex gap-2 text-xs text-slate-600 leading-relaxed">
                          <span className="text-indigo-600 font-semibold shrink-0">{i + 1}.</span>
                          {typeof item === "string" ? item : `${item.day || item.Day || ""} ${item.topic || item.Topic || ""}`}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

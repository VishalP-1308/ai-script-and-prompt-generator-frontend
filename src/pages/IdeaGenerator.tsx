import { useState } from "react";
import { Lightbulb, TrendingUp, Flame, Clock, Tag, Sparkles } from "lucide-react";
import { ideasApi } from "../services/api";
import type { IdeaGeneratorResponse } from "../types";
import PageHeader from "../components/ui/PageHeader";
import LoadingState from "../components/ui/LoadingState";
import CopyButton from "../components/ui/CopyButton";
import toast from "react-hot-toast";

export default function IdeaGenerator() {
  const [niche,    setNiche]    = useState("");
  const [audience, setAudience] = useState("");
  const [style,    setStyle]    = useState("");
  const [count,    setCount]    = useState(20);
  const [loading,  setLoading]  = useState(false);
  const [result,   setResult]   = useState<IdeaGeneratorResponse | null>(null);

  const handleGenerate = async () => {
    if (!niche.trim()) return toast.error("Please enter a niche");
    setLoading(true); 
    setResult(null);

    try {
      const data = await ideasApi.generate({
        niche: niche.trim(),
        targetAudience: audience || undefined,
        contentStyle:   style    || undefined,
        count,
      }) as IdeaGeneratorResponse;
      setResult(data);
      toast.success(`${data.ideas?.length ?? 0} ideas generated!`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Generation failed");
    } finally { setLoading(false); }
  };

  const diffClass = (d: string) =>
    d === "easy" ? "badge-easy" : d === "medium" ? "badge-medium" : "badge-hard";

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<Lightbulb size={18} className="text-white" />}
        title="Viral Video Idea Generator"
        subtitle="20+ ranked ideas with trending analysis, viral scores, and Shorts angles"
        gradient="from-amber-400 to-orange-500"
      />

      <div className="gen-layout">
        {/* ── Left: Form ── */}
        <div className="form-panel">
          <div className="glass-card p-5 space-y-4">
            <div>
              <label className="field-label">Niche / Topic *</label>
              <input className="input-field"
                placeholder="e.g., AI tools, personal finance…"
                value={niche} onChange={e => setNiche(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleGenerate()} />
            </div>
            <div>
              <label className="field-label">Target Audience</label>
              <input className="input-field"
                placeholder="e.g., beginners, entrepreneurs…"
                value={audience} onChange={e => setAudience(e.target.value)} />
            </div>
            <div>
              <label className="field-label">Content Style</label>
              <select className="select-field" value={style} onChange={e => setStyle(e.target.value)}>
                <option value="">Any style</option>
                <option value="educational">Educational</option>
                <option value="entertaining">Entertaining</option>
                <option value="listicle">Listicle</option>
                <option value="tutorial">Tutorial</option>
                <option value="review">Review</option>
                <option value="story">Story-telling</option>
              </select>
            </div>
            <div>
              <label className="field-label">Number of Ideas</label>
              <select className="select-field" value={count} onChange={e => setCount(+e.target.value)}>
                <option value={10}>10 ideas</option>
                <option value={15}>15 ideas</option>
                <option value={20}>20 ideas</option>
                <option value={25}>25 ideas</option>
              </select>
            </div>
            <button className="btn-gradient w-full" onClick={handleGenerate} disabled={loading}>
              <Lightbulb size={16} />
              {loading ? "Generating…" : "Generate Viral Ideas"}
            </button>
          </div>
        </div>

        {/* ── Right: Results ── */}
        <div className="results-panel">
          {loading && <LoadingState message="Researching viral topics and generating ideas…" />}

          {!loading && !result && (
            <div className="empty-state">
              <Sparkles size={32} className="text-indigo-300" />
              <p className="text-sm font-medium text-slate-500">Enter a niche and generate ideas</p>
              <p className="text-xs text-slate-400">Results appear here</p>
            </div>
          )}

          {result && (
            <>
              {/* Niche Analysis */}
              {result.nicheAnalysis && (
                <div className="result-section animate-fade-in-up">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <TrendingUp size={14} className="text-indigo-500 shrink-0" />
                      Niche Analysis
                    </h3>
                    <CopyButton text={result.nicheAnalysis} />
                  </div>
                  <p className="text-[.84rem] text-slate-600 leading-relaxed mt-2">{result.nicheAnalysis}</p>
                </div>
              )}

              {/* Content Gaps */}
              {result.contentGaps && result.contentGaps.length > 0 && (
                <div className="result-section animate-fade-in-up">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
                    <Flame size={14} className="text-orange-500 shrink-0" />
                    Content Gaps &amp; Opportunities
                  </h3>
                  <div className="space-y-2">
                    {result.contentGaps.map((gap, i) => (
                      <div key={i} className="flex gap-3 p-3 rounded-lg muted-surface">
                        <span className="text-xs font-bold text-orange-500 shrink-0 mt-0.5">{i + 1}</span>
                        <p className="text-[.84rem] text-slate-700 leading-relaxed">{gap}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ideas */}
              <div className="flex items-center justify-between px-1">
                <p className="text-sm font-bold text-slate-900">
                  Ideas <span className="text-slate-400 font-normal ml-1">({result.ideas?.length ?? 0})</span>
                </p>
              </div>

              {result.ideas?.map((idea, i) => (
                <div key={i} className="result-section" style={{ animationDelay: `${i * .04}s` }}>
                  <div className="flex gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 mb-1.5">
                        <span className="text-xs font-bold text-indigo-400 shrink-0 mt-0.5">#{i + 1}</span>
                        <h4 className="text-[.93rem] font-bold text-slate-900 leading-snug">{idea.title}</h4>
                      </div>
                      <p className="text-[.83rem] text-slate-600 mb-3 leading-relaxed">{idea.description}</p>

                      <div className="flex flex-wrap gap-1.5 mb-3">
                        <span className={`badge ${diffClass(idea.difficulty)}`}>{idea.difficulty}</span>
                        <span className={`badge ${idea.searchVolume === "high" ? "badge-high" : "badge-low"}`}>
                          Search: {idea.searchVolume}
                        </span>
                        <span className="badge badge-high">
                          <Flame size={10} /> {idea.trendingScore}/10
                        </span>
                        <span className="badge badge-low">
                          <Clock size={10} /> {idea.bestTimeToPost}
                        </span>
                      </div>

                      <p className="text-xs text-emerald-700 mb-1 leading-relaxed">
                        <span className="font-semibold">Why it works: </span>{idea.whyItWorks}
                      </p>
                      <p className="text-xs text-amber-700 mb-3 leading-relaxed">
                        <span className="font-semibold">Views potential: </span>{idea.estimatedViews}
                      </p>

                      {idea.shortsIdea && (
                        <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 mb-3">
                          <p className="text-[.7rem] font-bold text-indigo-700 mb-1">💡 Shorts Angle</p>
                          <p className="text-[.83rem] text-slate-700">{idea.shortsIdea}</p>
                        </div>
                      )}

                      {idea.tags && (
                        <div className="flex flex-wrap items-center gap-1.5">
                          <Tag size={11} className="text-slate-400 shrink-0" />
                          {idea.tags.map((tag, j) => <span key={j} className="tag">{tag}</span>)}
                        </div>
                      )}
                    </div>
                    <CopyButton
                      text={`${idea.title}\n\n${idea.description}\n\nWhy it works: ${idea.whyItWorks}\nShorts idea: ${idea.shortsIdea ?? ""}`}
                    />
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { TrendingUp, Clock, Search } from "lucide-react";
import { ideasApi } from "../services/api";
import PageHeader from "../components/ui/PageHeader";
import LoadingState from "../components/ui/LoadingState";
import CopyButton from "../components/ui/CopyButton";
import toast from "react-hot-toast";

export default function TrendingTopics() {
  const [niche, setNiche] = useState("");
  const [count, setCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setResult(null);

    try {
      const data = await ideasApi.getTrending({
        niche: niche.trim(),
        count,
      });
      setResult(data);
      toast.success(`Found trending topics!`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Search failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<TrendingUp size={18} className="text-white" />}
        title="Trending Topics Finder"
        subtitle="Discover what's blowing up right now in your niche"
        gradient="from-indigo-400 to-violet-500"
      />

      <div className="gen-layout">
        {/* ── Left: Form ── */}
        <div className="form-panel">
          <div className="glass-card p-5 space-y-4">
            <div>
              <label className="field-label">Niche / Category (Optional)</label>
              <input className="input-field"
                placeholder="Leave empty for general trends, or enter e.g., 'tech'"
                value={niche} onChange={e => setNiche(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleGenerate()} />
            </div>
            
            <div>
              <label className="field-label">Number of Trends</label>
              <select className="select-field" value={count} onChange={e => setCount(+e.target.value)}>
                <option value={5}>5 topics</option>
                <option value={10}>10 topics</option>
                <option value={15}>15 topics</option>
                <option value={20}>20 topics</option>
                <option value={25}>25 topics</option>
                <option value={50}>50 topics</option>
              </select>
            </div>
            
            <button className="btn-gradient w-full" onClick={handleGenerate} disabled={loading}>
              <TrendingUp size={16} />
              {loading ? "Searching…" : "Find Trending Topics"}
            </button>
          </div>
        </div>

        {/* ── Right: Results ── */}
        <div className="results-panel">
          {loading && <LoadingState message="Analyzing YouTube trends…" />}

          {!loading && !result && (
            <div className="empty-state">
              <TrendingUp size={32} className="text-indigo-300" />
              <p className="text-sm font-medium text-slate-500">Find trending topics</p>
              <p className="text-xs text-slate-400">Leave niche empty for general trends</p>
            </div>
          )}

          {result && (
            <>
              {result.overallTrend && (
                <div className="result-section animate-fade-in-up">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-2">
                    <TrendingUp size={14} className="text-indigo-500 shrink-0" />
                    Overall Trend
                  </h3>
                  <p className="text-[.84rem] text-slate-600 leading-relaxed">{result.overallTrend}</p>
                </div>
              )}
              
              <div className="flex items-center justify-between px-1 mt-4 mb-2">
                <p className="text-sm font-bold text-slate-900">
                  Trending Topics <span className="text-slate-400 font-normal ml-1">({result.trendingTopics?.length ?? 0})</span>
                </p>
              </div>

              {result.trendingTopics?.map((topic: any, i: number) => (
                <div key={i} className="result-section" style={{ animationDelay: `${i * .04}s` }}>
                  <div className="flex gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 mb-1.5">
                        <span className="text-xs font-bold text-indigo-400 shrink-0 mt-0.5">#{i + 1}</span>
                        <h4 className="text-[.93rem] font-bold text-slate-900 leading-snug">{topic.topic}</h4>
                      </div>
                      <p className="text-[.83rem] text-slate-600 mb-3 leading-relaxed">{topic.reason}</p>

                      <div className="flex flex-wrap gap-1.5 mb-3">
                        <span className={`badge ${topic.competitionLevel === "low" ? "badge-easy" : topic.competitionLevel === "medium" ? "badge-medium" : "badge-hard"}`}>
                          Competition: {topic.competitionLevel}
                        </span>
                        <span className="badge badge-high">
                          <Clock size={10} /> Urgency: {topic.urgency}
                        </span>
                      </div>

                      {topic.suggestedAngle && (
                        <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 mb-3">
                          <p className="text-[.7rem] font-bold text-indigo-700 mb-1">💡 Suggested Angle</p>
                          <p className="text-[.83rem] text-slate-700">{topic.suggestedAngle}</p>
                        </div>
                      )}

                      {topic.relatedSearches && (
                        <div className="flex flex-wrap items-center gap-1.5">
                          <Search size={11} className="text-slate-400 shrink-0" />
                          {topic.relatedSearches.map((search: string, j: number) => <span key={j} className="tag">{search}</span>)}
                        </div>
                      )}
                    </div>
                    <CopyButton
                      text={`${topic.topic}\n\nReason: ${topic.reason}\nAngle: ${topic.suggestedAngle}`}
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

import { useState } from "react";
import { Zap, Flame } from "lucide-react";
import { shortsApi } from "../services/api";
import type { ShortsResponse } from "../types";
import PageHeader from "../components/ui/PageHeader";
import LoadingState from "../components/ui/LoadingState";
import CopyButton from "../components/ui/CopyButton";
import toast from "react-hot-toast";

export default function ShortsGenerator() {
  const [topic,    setTopic]    = useState("");
  const [platform, setPlatform] = useState("youtube-shorts");
  const [style,    setStyle]    = useState("energetic");
  const [duration, setDuration] = useState("30 seconds");
  const [niche,    setNiche]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [result,   setResult]   = useState<ShortsResponse | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) return toast.error("Please enter a topic");
    setLoading(true); setResult(null);
    try {
      setResult(await shortsApi.generate({
        topic: topic.trim(), platform, style, duration, niche: niche || undefined,
      }) as ShortsResponse);
      toast.success("Shorts scripts generated!");
    } catch (err) { toast.error(err instanceof Error ? err.message : "Failed"); }
    finally       { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<Zap size={18} className="text-white" />}
        title="Shorts & Reels Generator"
        subtitle="Viral short-form scripts with hooks, captions, and hashtags"
        gradient="from-amber-400 to-red-500"
      />

      <div className="gen-layout">

        {/* ── Left: Form ── */}
        <div className="form-panel">
          <div className="glass-card p-5 space-y-4">
            <div>
              <label className="field-label">Topic *</label>
              <input className="input-field"
                placeholder="e.g., 5 AI tools you need to know about"
                value={topic} onChange={e => setTopic(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleGenerate()} />
            </div>
            <div>
              <label className="field-label">Platform</label>
              <select className="select-field" value={platform} onChange={e => setPlatform(e.target.value)}>
                <option value="youtube-shorts">YouTube Shorts</option>
                <option value="instagram-reels">Instagram Reels</option>
              </select>
            </div>
            <div>
              <label className="field-label">Style</label>
              <select className="select-field" value={style} onChange={e => setStyle(e.target.value)}>
                <option value="energetic">Energetic</option>
                <option value="calm">Calm</option>
                <option value="dramatic">Dramatic</option>
                <option value="humorous">Humorous</option>
                <option value="informative">Informative</option>
              </select>
            </div>
            <div>
              <label className="field-label">Duration</label>
              <select className="select-field" value={duration} onChange={e => setDuration(e.target.value)}>
                <option value="15 seconds">15 Seconds</option>
                <option value="30 seconds">30 Seconds</option>
                <option value="45 seconds">45 Seconds</option>
                <option value="60 seconds">60 Seconds</option>
              </select>
            </div>
            <div>
              <label className="field-label">Niche <span className="normal-case font-normal text-slate-400">(optional)</span></label>
              <input className="input-field" placeholder="e.g., tech, fitness…"
                value={niche} onChange={e => setNiche(e.target.value)} />
            </div>
            <button className="btn-gradient w-full" onClick={handleGenerate} disabled={loading}>
              <Zap size={15} />
              {loading ? "Generating…" : "Generate Shorts"}
            </button>
          </div>
        </div>

        {/* ── Right: Results ── */}
        <div className="results-panel">
          {loading && <LoadingState message="Creating viral short-form content…" />}

          {!loading && !result && (
            <div className="empty-state">
              <Zap size={32} className="text-amber-300" />
              <p className="text-sm font-medium text-slate-500">Enter a topic and generate scripts</p>
              <p className="text-xs text-slate-400">Results appear here</p>
            </div>
          )}

          {result && (
            <>
              {/* Format Tips */}
              {result.formatTips && (
                <div className="result-section animate-fade-in-up">
                  <h3 className="text-sm font-bold text-slate-900 mb-3">💡 Format Tips</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {result.formatTips.map((tip, i) => (
                      <div key={i} className="flex gap-2 p-2.5 rounded-lg muted-surface text-xs text-slate-600 leading-relaxed">
                        <span className="text-amber-500 shrink-0 mt-0.5">✦</span>{tip}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Scripts */}
              {result.shorts?.map((short, i) => (
                <div key={i} className="result-section" style={{ animationDelay: `${i * .06}s` }}>
                  <div className="flex items-start gap-3 mb-4">
                    <span className="w-9 h-9 rounded-xl bg-linear-to-br from-amber-100 to-red-100 border border-amber-200
                      flex items-center justify-center text-sm font-bold text-amber-700 shrink-0">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">{short.title}</h4>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className="badge badge-high"><Flame size={10} /> Viral: {short.viralScore}/10</span>
                        <span className="text-xs text-slate-500">{short.estimatedViews} views</span>
                      </div>
                    </div>
                    <CopyButton
                      text={`${short.hook}\n\n${short.script}\n\n${short.caption}\n\n${short.hashtags?.join(" ")}`}
                      label="Copy All"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-100 mb-3">
                    <p className="text-[.67rem] font-bold text-amber-700 uppercase tracking-wider mb-1">🎣 Hook</p>
                    <p className="text-[.84rem] text-slate-900 font-medium leading-relaxed">{short.hook}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 mb-3">
                    <p className="text-[.67rem] font-bold text-slate-500 uppercase tracking-wider mb-2">📝 Script</p>
                    <p className="text-[.84rem] text-slate-700 leading-relaxed whitespace-pre-wrap">{short.script}</p>
                  </div>

                  {short.visualInstructions && (
                    <div className="p-3 rounded-xl bg-violet-50/70 border border-violet-100 mb-3">
                      <p className="text-[.67rem] font-bold text-violet-700 uppercase tracking-wider mb-1">🎬 Visuals</p>
                      <p className="text-xs text-slate-700 leading-relaxed">{short.visualInstructions}</p>
                    </div>
                  )}

                  <div className="p-3 rounded-xl muted-surface mb-3">
                    <p className="text-[.67rem] font-bold text-slate-500 uppercase tracking-wider mb-1">📱 Caption</p>
                    <p className="text-[.84rem] text-slate-700 leading-relaxed">{short.caption}</p>
                  </div>

                  {short.hashtags && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {short.hashtags.map((h, j) => <span key={j} className="tag text-indigo-600">{h}</span>)}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                    {short.trendingAudio   && <span>🎵 {short.trendingAudio}</span>}
                    {short.bestPostingTime && <span>⏰ {short.bestPostingTime}</span>}
                    {short.callToAction    && <span>📢 {short.callToAction}</span>}
                  </div>
                </div>
              ))}

              {/* Calendar */}
              {result.contentCalendar && result.contentCalendar.length > 0 && (
                <div className="result-section animate-fade-in-up">
                  <h3 className="text-sm font-bold text-slate-900 mb-3">📅 7-Day Content Calendar</h3>
                  <div className="space-y-2">
                    {result.contentCalendar.map((item, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl muted-surface">
                        <span className="w-7 h-7 rounded-lg bg-white border border-indigo-100
                          flex items-center justify-center text-xs font-bold text-indigo-600 shrink-0 shadow-sm">{i + 1}</span>
                        <div className="min-w-0 flex-1 text-[.84rem]">
                          {typeof item === "string" ? (
                            <p className="text-slate-700">{item}</p>
                          ) : (
                            <>
                              <p className="text-slate-800 font-medium">
                                <span className="text-indigo-600 font-bold mr-1">{item.day || item.Day}:</span>
                                {item.topic || item.Topic}
                              </p>
                              {item.format      && <p className="text-xs text-slate-500 italic mt-0.5">{item.format}</p>}
                              {item.description && <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>}
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

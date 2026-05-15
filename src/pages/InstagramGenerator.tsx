import { useState } from "react";
import { AtSign, Heart, MessageCircle, Bookmark } from "lucide-react";
import { instagramApi } from "../services/api";
import type { InstagramResponse } from "../types";
import PageHeader from "../components/ui/PageHeader";
import LoadingState from "../components/ui/LoadingState";
import CopyButton from "../components/ui/CopyButton";
import toast from "react-hot-toast";

export default function InstagramGenerator() {
  const [topic,    setTopic]    = useState("");
  const [tone,     setTone]     = useState("engaging");
  const [postType, setPostType] = useState("carousel");
  const [niche,    setNiche]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [result,   setResult]   = useState<InstagramResponse | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) return toast.error("Please enter a topic");
    setLoading(true); setResult(null);
    try {
      setResult(await instagramApi.generateCaptions({
        topic: topic.trim(), tone, postType, niche: niche || undefined,
      }) as InstagramResponse);
      toast.success("Instagram content generated!");
    } catch (err) { toast.error(err instanceof Error ? err.message : "Failed"); }
    finally       { setLoading(false); }
  };

  const scoreBar = (score: number, color: string) => (
    <div className="score-bar flex-1">
      <div className={`score-bar-fill ${color}`} style={{ width: `${score * 10}%` }} />
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<AtSign size={18} className="text-white" />}
        title="Instagram Content Studio"
        subtitle="Captions, hashtag strategies, carousel ideas, and engagement tips"
        gradient="from-fuchsia-400 to-pink-500"
      />

      <div className="gen-layout">

        {/* ── Left: Form ── */}
        <div className="form-panel">
          <div className="glass-card p-5 space-y-4">
            <div>
              <label className="field-label">Post Topic *</label>
              <input className="input-field"
                placeholder="e.g., 5 AI tools every entrepreneur needs"
                value={topic} onChange={e => setTopic(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleGenerate()} />
            </div>
            <div>
              <label className="field-label">Tone</label>
              <select className="select-field" value={tone} onChange={e => setTone(e.target.value)}>
                <option value="engaging">Engaging</option>
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="inspirational">Inspirational</option>
                <option value="educational">Educational</option>
                <option value="humorous">Humorous</option>
              </select>
            </div>
            <div>
              <label className="field-label">Post Type</label>
              <select className="select-field" value={postType} onChange={e => setPostType(e.target.value)}>
                <option value="carousel">Carousel</option>
                <option value="single">Single Image</option>
                <option value="reel">Reel</option>
              </select>
            </div>
            <div>
              <label className="field-label">Niche <span className="normal-case font-normal text-slate-400">(optional)</span></label>
              <input className="input-field" placeholder="e.g., tech, fitness, business…"
                value={niche} onChange={e => setNiche(e.target.value)} />
            </div>
            <button className="btn-gradient w-full" onClick={handleGenerate} disabled={loading}>
              <AtSign size={15} />
              {loading ? "Generating…" : "Generate Content"}
            </button>
          </div>
        </div>

        {/* ── Right: Results ── */}
        <div className="results-panel">
          {loading && <LoadingState message="Crafting Instagram-worthy content…" />}

          {!loading && !result && (
            <div className="empty-state">
              <AtSign size={32} className="text-pink-300" />
              <p className="text-sm font-medium text-slate-500">Enter a topic and generate captions</p>
              <p className="text-xs text-slate-400">Results appear here</p>
            </div>
          )}

          {result && (
            <>
              {/* Engagement Tips */}
              {result.engagementTips && (
                <div className="result-section animate-fade-in-up">
                  <h3 className="text-sm font-bold text-slate-900 mb-3">💡 Engagement Tips</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {result.engagementTips.map((tip, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-600 p-2.5 rounded-lg muted-surface leading-relaxed">
                        <span className="text-pink-500 shrink-0 mt-0.5">✦</span>{tip}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Captions */}
              {result.captions?.map((cap, i) => (
                <div key={i} className="result-section" style={{ animationDelay: `${i * .06}s` }}>
                  {/* Header */}
                  <div className="flex items-start gap-3 mb-4">
                    <span className="w-9 h-9 rounded-xl bg-linear-to-br from-fuchsia-100 to-pink-100 border border-pink-200
                      flex items-center justify-center text-sm font-bold text-pink-600 shrink-0">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0 flex items-center gap-3 flex-wrap">
                      <div className="flex items-center gap-1 text-xs text-slate-600">
                        <Heart size={12} className="text-rose-500" />
                        <span className="font-semibold">{cap.engagementScore}/10</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-600">
                        <Bookmark size={12} className="text-amber-500" />
                        <span className="font-semibold">{cap.saveability}/10</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-600">
                        <MessageCircle size={12} className="text-sky-500" />
                        <span className="font-semibold">{cap.shareability}/10</span>
                      </div>
                    </div>
                    <CopyButton text={`${cap.caption}\n\n${cap.hashtags?.join(" ")}`} label="Copy All" />
                  </div>

                  {/* Hook */}
                  <div className="p-3 rounded-xl bg-fuchsia-50/80 border border-pink-100 mb-3">
                    <p className="text-[.67rem] font-bold text-pink-700 uppercase tracking-wider mb-1">🎣 Hook</p>
                    <p className="text-[.84rem] text-slate-900 font-medium leading-relaxed">{cap.hook}</p>
                  </div>

                  {/* Caption */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 mb-3">
                    <p className="text-[.84rem] text-slate-700 leading-relaxed whitespace-pre-wrap">{cap.caption}</p>
                  </div>

                  {/* Score bars */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                    {[
                      { icon: Heart,         color: "bg-rose-500",   label: "Engagement", score: cap.engagementScore, ic: "text-rose-500" },
                      { icon: Bookmark,      color: "bg-amber-500",  label: "Saves",      score: cap.saveability,     ic: "text-amber-500" },
                      { icon: MessageCircle, color: "bg-sky-500",    label: "Shares",     score: cap.shareability,    ic: "text-sky-500" },
                    ].map(({ icon: Icon, color, label, score, ic }) => (
                      <div key={label} className="flex items-center gap-2">
                        <Icon size={13} className={`${ic} shrink-0`} />
                        <span className="text-xs text-slate-500 shrink-0">{label}</span>
                        {scoreBar(score, color)}
                      </div>
                    ))}
                  </div>

                  {/* Carousel Slides */}
                  {cap.carouselSlides && cap.carouselSlides.length > 0 && (
                    <div className="mb-3">
                      <p className="text-[.67rem] font-bold text-slate-500 uppercase tracking-wider mb-2">📑 Carousel Slides</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {cap.carouselSlides.map((slide, j) => (
                          <div key={j} className="p-3 rounded-lg muted-surface">
                            <span className="text-[.62rem] font-bold text-indigo-600 uppercase tracking-wider">Slide {j + 1}</span>
                            <p className="text-xs text-slate-700 mt-1 leading-relaxed">{slide}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Hashtags */}
                  {cap.hashtags && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
                        <p className="text-[.67rem] font-bold text-slate-500 uppercase tracking-wider">
                          # Hashtags ({cap.hashtags.length})
                        </p>
                        <CopyButton text={cap.hashtags.join(" ")} label="Copy Tags" />
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {cap.hashtags.map((h, j) => <span key={j} className="tag text-pink-600">{h}</span>)}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                    {cap.bestPostTime  && <span>⏰ {cap.bestPostTime}</span>}
                    {cap.callToAction  && <span>📢 {cap.callToAction}</span>}
                  </div>
                </div>
              ))}

              {/* Content Ideas */}
              {result.contentIdeas && (
                <div className="result-section animate-fade-in-up">
                  <h3 className="text-sm font-bold text-slate-900 mb-3">💡 More Content Ideas</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {result.contentIdeas.map((idea, i) => (
                      <div key={i} className="flex items-start gap-2 text-[.84rem] text-slate-700 p-2.5 rounded-lg muted-surface leading-relaxed">
                        <span className="text-xs text-pink-600 font-bold shrink-0 mt-0.5">{i + 1}.</span>
                        {idea}
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

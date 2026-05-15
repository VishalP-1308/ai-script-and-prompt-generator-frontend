import { useState } from "react";
import { Image, Palette } from "lucide-react";
import { thumbnailsApi } from "../services/api";
import type { ThumbnailResponse } from "../types";
import PageHeader from "../components/ui/PageHeader";
import LoadingState from "../components/ui/LoadingState";
import CopyButton from "../components/ui/CopyButton";
import toast from "react-hot-toast";

export default function ThumbnailGenerator() {
  const [topic,    setTopic]    = useState("");
  const [style,    setStyle]    = useState("cinematic");
  const [platform, setPlatform] = useState("midjourney");
  const [count,    setCount]    = useState(5);
  const [loading,  setLoading]  = useState(false);
  const [result,   setResult]   = useState<ThumbnailResponse | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) return toast.error("Please enter a video topic");
    setLoading(true); setResult(null);
    try {
      setResult(await thumbnailsApi.generate({ topic: topic.trim(), style, platform, count }) as ThumbnailResponse);
      toast.success("Thumbnail prompts generated!");
    } catch (err) { toast.error(err instanceof Error ? err.message : "Generation failed"); }
    finally       { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<Image size={18} className="text-white" />}
        title="Thumbnail Prompt Generator"
        subtitle="AI image prompts for Midjourney, Leonardo AI, Ideogram & DALL-E"
        gradient="from-pink-400 to-rose-500"
      />

      <div className="gen-layout">

        {/* ── Left: Form ── */}
        <div className="form-panel">
          <div className="glass-card p-5 space-y-4">
            <div>
              <label className="field-label">Video Topic *</label>
              <input className="input-field"
                placeholder="e.g., AI robots replacing human jobs"
                value={topic} onChange={e => setTopic(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleGenerate()} />
            </div>
            <div>
              <label className="field-label">Visual Style</label>
              <select className="select-field" value={style} onChange={e => setStyle(e.target.value)}>
                <option value="cinematic">Cinematic</option>
                <option value="3d-render">3D Render</option>
                <option value="photorealistic">Photorealistic</option>
                <option value="cartoon">Cartoon / Illustration</option>
                <option value="minimalist">Minimalist</option>
                <option value="futuristic">Futuristic / Sci-Fi</option>
                <option value="dark-moody">Dark & Moody</option>
              </select>
            </div>
            <div>
              <label className="field-label">AI Platform</label>
              <select className="select-field" value={platform} onChange={e => setPlatform(e.target.value)}>
                <option value="midjourney">Midjourney v6</option>
                <option value="leonardo">Leonardo AI</option>
                <option value="ideogram">Ideogram</option>
                <option value="dalle">DALL-E 3</option>
              </select>
            </div>
            <div>
              <label className="field-label">Number of Prompts</label>
              <select className="select-field" value={count} onChange={e => setCount(+e.target.value)}>
                <option value={3}>3 prompts</option>
                <option value={5}>5 prompts</option>
                <option value={8}>8 prompts</option>
              </select>
            </div>
            <button className="btn-gradient w-full" onClick={handleGenerate} disabled={loading}>
              <Image size={15} />
              {loading ? "Generating…" : "Generate Prompts"}
            </button>
          </div>
        </div>

        {/* ── Right: Results ── */}
        <div className="results-panel">
          {loading && <LoadingState message="Creating high-CTR thumbnail prompts…" />}

          {!loading && !result && (
            <div className="empty-state">
              <Image size={32} className="text-rose-300" />
              <p className="text-sm font-medium text-slate-500">Enter a topic and generate prompts</p>
              <p className="text-xs text-slate-400">Results appear here</p>
            </div>
          )}

          {result && (
            <>
              {/* Tips */}
              {result.thumbnailTips && (
                <div className="result-section animate-fade-in-up">
                  <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Palette size={14} className="text-rose-500 shrink-0" /> Thumbnail Tips
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {result.thumbnailTips.map((tip, i) => (
                      <div key={i} className="flex gap-2 p-2.5 rounded-lg muted-surface text-xs text-slate-600 leading-relaxed">
                        <span className="text-rose-500 shrink-0 mt-0.5">✦</span>{tip}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Prompts */}
              {result.thumbnails?.map((thumb, i) => (
                <div key={i} className="result-section" style={{ animationDelay: `${i * .06}s` }}>
                  <div className="flex items-start gap-3 mb-3">
                    <span className="w-9 h-9 rounded-xl bg-linear-to-br from-pink-100 to-rose-100 border border-rose-200
                      flex items-center justify-center text-sm font-bold text-rose-600 shrink-0">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">{thumb.concept}</h4>
                      <span className={`badge mt-1.5 inline-flex ${
                        thumb.ctrPrediction === "high" ? "badge-easy" :
                        thumb.ctrPrediction === "medium" ? "badge-medium" : "badge-hard"
                      }`}>CTR: {thumb.ctrPrediction}</span>
                    </div>
                    <CopyButton text={thumb.prompt} />
                  </div>

                  {/* Generated Image from Pollinations AI */}
                  <div className="mb-4 bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                    <img 
                      src={`https://image.pollinations.ai/prompt/${encodeURIComponent(thumb.prompt + (thumb.negativePrompt ? ` --no ${thumb.negativePrompt}` : ''))}?width=1280&height=720&nologo=true`} 
                      alt={thumb.concept} 
                      className="w-full h-auto object-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* Prompt */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 mb-3 overflow-x-auto">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-500 uppercase">Text Prompt</span>
                    </div>
                    <p className="text-[.82rem] text-slate-800 leading-relaxed font-mono whitespace-pre-wrap">{thumb.prompt}</p>
                  </div>

                  {thumb.negativePrompt && (
                    <div className="p-3 rounded-lg bg-red-50/70 border border-red-100 mb-3">
                      <p className="text-xs text-red-700">
                        <strong className="font-semibold">Negative:</strong> {thumb.negativePrompt}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs text-slate-600 mb-3">
                    <div><strong className="font-semibold text-slate-800">Why it works:</strong> {thumb.whyItWorks}</div>
                    <div><strong className="font-semibold text-slate-800">Emotion:</strong> {thumb.emotionalTrigger}</div>
                    {thumb.textOverlay && <div><strong className="font-semibold text-slate-800">Text overlay:</strong> {thumb.textOverlay}</div>}
                    <div><strong className="font-semibold text-slate-800">Composition:</strong> {thumb.composition}</div>
                  </div>

                  {thumb.colorPalette && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-slate-500 font-medium">Colors:</span>
                      {thumb.colorPalette.map((color, j) => (
                        <div key={j} className="w-6 h-6 rounded-md border border-slate-200 shadow-sm shrink-0"
                          style={{ backgroundColor: color }} title={color} />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </>
          )}

          {!loading && !result && (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}

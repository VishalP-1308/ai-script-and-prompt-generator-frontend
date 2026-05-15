import { useState } from "react";
import { Copy, Sparkles, Wand2 } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import CopyButton from "../components/ui/CopyButton";
import toast from "react-hot-toast";
import LoadingState from "../components/ui/LoadingState";
import { promptsApi } from "../services/api";

export default function PromptBuilder() {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("youtube-shorts");
  const [style, setStyle] = useState("energetic");
  const [duration, setDuration] = useState("30 seconds");
  const [niche, setNiche] = useState("");
  const [extraDetails, setExtraDetails] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return toast.error("Please enter a topic");
    setLoading(true);
    setGeneratedPrompt("");

    try {
      const data: any = await promptsApi.generate({
        topic: topic.trim(),
        platform,
        style,
        duration,
        niche: niche.trim(),
        extraDetails: extraDetails.trim()
      });
      // the backend returns a JSON block with 'prompt', or if the LLM output raw text, it might just be a string.
      // let's handle if it's an object { prompt: ... } or just raw string
      const finalPrompt = data.prompt || (typeof data === 'string' ? data : JSON.stringify(data));
      setGeneratedPrompt(finalPrompt);
      toast.success("Prompt generated successfully!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<Wand2 size={18} className="text-white" />}
        title="Mega Prompt Builder"
        subtitle="Generate perfectly engineered prompts to copy/paste into ChatGPT, Claude, or Gemini"
        gradient="from-emerald-400 to-teal-500"
      />

      <div className="gen-layout">
        {/* ── Left: Form ── */}
        <div className="form-panel">
          <div className="glass-card p-5 space-y-4">
            <div>
              <label className="field-label">Topic *</label>
              <input className="input-field"
                placeholder="e.g., 5 best AI tools for productivity"
                value={topic} onChange={e => setTopic(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleGenerate()} />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="field-label">Platform</label>
                <select className="select-field" value={platform} onChange={e => setPlatform(e.target.value)}>
                  <option value="youtube-shorts">YouTube Shorts</option>
                  <option value="instagram-reels">Instagram Reels</option>
                </select>
              </div>
              <div>
                <label className="field-label">Duration</label>
                <select className="select-field" value={duration} onChange={e => setDuration(e.target.value)}>
                  <option value="15 seconds">15 seconds</option>
                  <option value="30 seconds">30 seconds</option>
                  <option value="60 seconds">60 seconds</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="field-label">Style/Tone</label>
                <select className="select-field" value={style} onChange={e => setStyle(e.target.value)}>
                  <option value="energetic">Energetic</option>
                  <option value="educational">Educational</option>
                  <option value="storytelling">Storytelling</option>
                  <option value="humorous">Humorous</option>
                  <option value="dramatic">Dramatic</option>
                </select>
              </div>
              <div>
                <label className="field-label">Niche</label>
                <input className="input-field"
                  placeholder="e.g., tech, fitness"
                  value={niche} onChange={e => setNiche(e.target.value)} />
              </div>
            </div>

            <div>
              <label className="field-label">Extra Details (optional)</label>
              <textarea 
                className="input-field min-h-[80px]"
                placeholder="Any specific angles, keywords, or CTA you want included..."
                value={extraDetails} onChange={e => setExtraDetails(e.target.value)} 
              />
            </div>
            
            <button className="btn-gradient w-full" onClick={handleGenerate} disabled={loading}>
              <Wand2 size={16} />
              {loading ? "Engineering Prompt…" : "Build Mega Prompt"}
            </button>
          </div>
        </div>

        {/* ── Right: Results ── */}
        <div className="results-panel">
          {loading && <LoadingState message="Engineering the ultimate prompt..." />}

          {!loading && !generatedPrompt && (
            <div className="empty-state">
              <Sparkles size={32} className="text-teal-300" />
              <p className="text-sm font-medium text-slate-500">Enter your video details</p>
              <p className="text-xs text-slate-400">Your engineered prompt will appear here</p>
            </div>
          )}

          {generatedPrompt && (
            <div className="result-section animate-fade-in-up">
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Copy size={14} className="text-teal-500 shrink-0" />
                  Your Engineered Prompt
                </h3>
                <CopyButton text={generatedPrompt} label="Copy Prompt" />
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 whitespace-pre-wrap font-mono text-[.82rem] text-slate-800 leading-relaxed overflow-x-auto">
                {generatedPrompt}
              </div>
              <p className="text-xs text-slate-500 mt-4 text-center">
                Copy this prompt and paste it into ChatGPT, Claude, or Gemini to get your highly optimized script!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

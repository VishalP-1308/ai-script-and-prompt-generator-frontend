import { useState } from "react";
import { FileText, Sparkles } from "lucide-react";
import { scriptsApi } from "../services/api";
import type { ScriptResponse, HookResponse } from "../types";
import PageHeader from "../components/ui/PageHeader";
import LoadingState from "../components/ui/LoadingState";
import CopyButton from "../components/ui/CopyButton";
import toast from "react-hot-toast";

export default function ScriptGenerator() {
  const [topic,        setTopic]        = useState("");
  const [style,        setStyle]        = useState("energetic");
  const [duration,     setDuration]     = useState("5 minutes");
  const [tone,         setTone]         = useState("conversational");
  const [loading,      setLoading]      = useState(false);
  const [hookLoading,  setHookLoading]  = useState(false);
  const [result,       setResult]       = useState<ScriptResponse | null>(null);
  const [hooks,        setHooks]        = useState<HookResponse | null>(null);
  const [activeTab,    setActiveTab]    = useState<"script"|"hooks">("script");
  const [streamContent,setStreamContent]= useState("");
  const [isStreaming,  setIsStreaming]  = useState(false);

  const handleGenerateScript = async () => {
    if (!topic.trim()) return toast.error("Please enter a topic");
    setLoading(true); setResult(null); setStreamContent("");
    try {
      setResult(await scriptsApi.generate({ topic: topic.trim(), style, duration, tone }) as ScriptResponse);
      toast.success("Script generated!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Script generation failed");
    } finally { setLoading(false); }
  };

  const handleStreamScript = async () => {
    if (!topic.trim()) return toast.error("Please enter a topic");
    setIsStreaming(true); setStreamContent(""); setResult(null);
    await scriptsApi.stream(
      { topic: topic.trim(), style, duration },
      content  => setStreamContent(prev => prev + content),
      ()       => { setIsStreaming(false); toast.success("Stream complete!"); },
      error    => { setIsStreaming(false); toast.error(error); },
    );
  };

  const handleGenerateHooks = async () => {
    if (!topic.trim()) return toast.error("Please enter a topic");
    setHookLoading(true); setHooks(null);
    try {
      setHooks(await scriptsApi.generateHooks({ topic: topic.trim(), count: 10 }) as HookResponse);
      toast.success("Hooks generated!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Hook generation failed");
    } finally { setHookLoading(false); }
  };

  const getFullScript = () => {
    if (!result) return "";
    const sections = result.mainContent
      ?.map(s => `[${s.timestamp}] ${s.heading}\n${s.content}\n\n[VISUAL: ${s.visualSuggestion}]`)
      .join("\n\n") ?? "";
    return `HOOK:\n${result.hook?.text}\n\nINTRODUCTION:\n${result.introduction?.text}\n\nMAIN CONTENT:\n${sections}\n\nCTA:\n${result.callToAction?.text}\n\nOUTRO:\n${result.outro?.text}`;
  };

  const busy = loading || isStreaming;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<FileText size={18} className="text-white" />}
        title="Script Generator"
        subtitle="Retention-optimized scripts with hooks, visuals, and CTAs"
        gradient="from-emerald-400 to-teal-500"
      />

      <div className="gen-layout">

        {/* ── Left: Form ── */}
        <div className="form-panel space-y-4">
          <div className="glass-card p-5 space-y-4">
            <div>
              <label className="field-label">Video Topic *</label>
              <input className="input-field"
                placeholder="e.g., Top 5 AI tools that will replace your job"
                value={topic} onChange={e => setTopic(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleGenerateScript()} />
            </div>
            <div>
              <label className="field-label">Style</label>
              <select className="select-field" value={style} onChange={e => setStyle(e.target.value)}>
                <option value="energetic">Energetic</option>
                <option value="calm">Calm & Professional</option>
                <option value="casual">Casual</option>
                <option value="dramatic">Dramatic</option>
                <option value="humorous">Humorous</option>
              </select>
            </div>
            <div>
              <label className="field-label">Duration</label>
              <select className="select-field" value={duration} onChange={e => setDuration(e.target.value)}>
                <option value="60 seconds">60 Seconds</option>
                <option value="3 minutes">3 Minutes</option>
                <option value="5 minutes">5 Minutes</option>
                <option value="8 minutes">8 Minutes</option>
                <option value="10 minutes">10 Minutes</option>
                <option value="15 minutes">15 Minutes</option>
              </select>
            </div>
            <div>
              <label className="field-label">Tone</label>
              <select className="select-field" value={tone} onChange={e => setTone(e.target.value)}>
                <option value="conversational">Conversational</option>
                <option value="authoritative">Authoritative</option>
                <option value="inspirational">Inspirational</option>
                <option value="educational">Educational</option>
              </select>
            </div>
            <div className="flex flex-col gap-2.5">
              <button className="btn-gradient w-full" onClick={handleGenerateScript} disabled={busy}>
                <FileText size={15} />
                {loading ? "Generating…" : "Full Script"}
              </button>
              <button className="btn-ghost w-full" onClick={handleStreamScript} disabled={busy}>
                <Sparkles size={14} />
                {isStreaming ? "Streaming…" : "Stream Script"}
              </button>
            </div>
          </div>

          {/* Hooks button shown below form */}
          <button
            className="btn-ghost w-full"
            onClick={() => { setActiveTab("hooks"); if (!hooks && !hookLoading) handleGenerateHooks(); }}
            disabled={hookLoading}
          >
            <Sparkles size={14} />
            {hookLoading ? "Generating Hooks…" : "Generate Hooks Only"}
          </button>
        </div>

        {/* ── Right: Results ── */}
        <div className="results-panel">

          {/* Tab bar */}
          {(result || streamContent || hooks) && (
            <div className="tab-bar">
              <button className={`tab-btn ${activeTab === "script" ? "tab-btn-active" : "tab-btn-inactive"}`}
                onClick={() => setActiveTab("script")}>Script</button>
              <button className={`tab-btn ${activeTab === "hooks" ? "tab-btn-active" : "tab-btn-inactive"}`}
                onClick={() => { setActiveTab("hooks"); if (!hooks && !hookLoading) handleGenerateHooks(); }}>
                Hooks
              </button>
            </div>
          )}

          {/* Loading */}
          {loading && <LoadingState message="Crafting retention-optimized script…" />}

          {/* Stream */}
          {(isStreaming || streamContent) && activeTab === "script" && (
            <div className="result-section">
              <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles size={14} className="text-emerald-600 shrink-0" />
                  {isStreaming ? "Writing Script…" : "Streamed Script"}
                </h3>
                {!isStreaming && <CopyButton text={streamContent} />}
              </div>
              <div className="text-[.84rem] text-slate-700 leading-relaxed whitespace-pre-wrap">
                {streamContent}
                {isStreaming && <span className="inline-block w-1.5 h-4 bg-indigo-500 align-middle animate-pulse ml-0.5" />}
              </div>
            </div>
          )}

          {/* Script result */}
          {result && activeTab === "script" && (
            <>
              <div className="flex justify-end">
                <CopyButton text={getFullScript()} label="Copy Full Script" />
              </div>

              {[
                { label: "🎣 Hook",         color: "border-l-amber-400",  badge: "text-amber-700",  content: result.hook?.text,
                  meta: result.hook && (
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500 mt-2">
                      <span>Technique: <span className="text-slate-700 font-medium">{result.hook.technique}</span></span>
                      <span className="text-emerald-600">{result.hook.retentionTip}</span>
                    </div>
                  )},
                { label: "📖 Introduction", color: "border-l-sky-400",    badge: "text-sky-700",    content: result.introduction?.text, meta: null },
              ].map(({ label, color, badge, content, meta }) => (
                <div key={label} className={`result-section border-l-4 ${color}`}>
                  <p className={`text-[.67rem] font-bold uppercase tracking-wider mb-2 ${badge}`}>{label}</p>
                  <p className="text-[.84rem] text-slate-700 leading-relaxed">{content}</p>
                  {meta}
                </div>
              ))}

              {result.mainContent?.map((section, i) => (
                <div key={i} className="result-section border-l-4 border-l-indigo-400">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-xs font-mono font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                      {section.timestamp}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">{section.heading}</h3>
                  </div>
                  <p className="text-[.84rem] text-slate-700 leading-relaxed mb-3">{section.content}</p>
                  {section.visualSuggestion && (
                    <p className="text-xs text-violet-700 mb-1">🎬 <strong>Visual:</strong> {section.visualSuggestion}</p>
                  )}
                  {section.bRoll && (
                    <p className="text-xs text-slate-500">📹 <strong className="text-slate-600">B-Roll:</strong> {section.bRoll}</p>
                  )}
                </div>
              ))}

              {[
                { label: "📢 Call to Action", color: "border-l-emerald-400", badge: "text-emerald-700", content: result.callToAction?.text },
                { label: "👋 Outro",          color: "border-l-pink-400",    badge: "text-pink-700",    content: result.outro?.text       },
              ].map(({ label, color, badge, content }) => (
                <div key={label} className={`result-section border-l-4 ${color}`}>
                  <p className={`text-[.67rem] font-bold uppercase tracking-wider mb-2 ${badge}`}>{label}</p>
                  <p className="text-[.84rem] text-slate-700 leading-relaxed">{content}</p>
                </div>
              ))}

              {result.metadata && (
                <div className="result-section">
                  <h3 className="text-sm font-bold text-slate-900 mb-3">📊 Script Metadata</h3>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {[
                      { label: "Words",    value: result.metadata.estimatedWordCount },
                      { label: "Duration", value: result.metadata.estimatedDuration  },
                      { label: "WPM",      value: result.metadata.readingSpeed       },
                    ].map(({ label, value }) => (
                      <div key={label} className="p-3 rounded-xl muted-surface text-center">
                        <p className="text-[.65rem] text-slate-500 uppercase tracking-wider">{label}</p>
                        <p className="text-sm font-bold text-slate-900 mt-0.5">{value}</p>
                      </div>
                    ))}
                  </div>
                  {result.metadata.retentionTips && (
                    <ul className="space-y-1.5">
                      {result.metadata.retentionTips.map((tip, i) => (
                        <li key={i} className="flex gap-2 text-xs text-slate-600 leading-relaxed">
                          <span className="text-emerald-500 shrink-0">✓</span>{tip}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </>
          )}

          {/* Hooks tab */}
          {activeTab === "hooks" && hookLoading && <LoadingState message="Crafting irresistible hooks…" />}
          {activeTab === "hooks" && hooks && (
            <div className="space-y-3 animate-fade-in-up">
              {hooks.hooks?.map((hook, i) => (
                <div key={i}
                  className={`result-section ${i === hooks.bestHook ? "border-emerald-200 bg-emerald-50/30 ring-1 ring-emerald-100" : ""}`}>
                  <div className="flex gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="text-xs font-bold text-indigo-500">#{i + 1}</span>
                        {i === hooks.bestHook && <span className="badge badge-easy">⭐ Recommended</span>}
                      </div>
                      <p className="text-[.84rem] text-slate-900 font-medium leading-relaxed mb-2">"{hook.text}"</p>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
                        <span>Technique: <span className="text-slate-700 font-medium">{hook.technique}</span></span>
                        <span>Emotion: <span className="text-amber-600 font-medium">{hook.emotion}</span></span>
                        <span>Retention: <span className="text-emerald-600 font-medium">{hook.retentionScore}/10</span></span>
                      </div>
                    </div>
                    <CopyButton text={hook.text} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && !isStreaming && !result && !streamContent && activeTab === "script" && !hooks && (
            <div className="empty-state">
              <FileText size={32} className="text-emerald-300" />
              <p className="text-sm font-medium text-slate-500">Enter a topic and generate your script</p>
              <p className="text-xs text-slate-400">Results appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

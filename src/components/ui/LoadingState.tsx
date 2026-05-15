interface LoadingStateProps { message?: string; }

export default function LoadingState({ message = "Generating content…" }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
      <div className="loading-dots mb-5">
        <span /><span /><span />
      </div>
      <p className="text-sm font-semibold text-slate-700">{message}</p>
      <p className="text-xs text-slate-400 mt-1">Usually takes 10–20 seconds</p>
    </div>
  );
}

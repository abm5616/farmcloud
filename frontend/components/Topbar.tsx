export default function Topbar({ title }: { title: string }) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="bg-card border-b border-border px-8 h-[60px] flex items-center justify-between sticky top-0 z-40">
      <h1 className="text-[1.25rem] font-semibold">{title}</h1>
      <div className="flex items-center gap-4">
        <span className="text-[0.85rem] text-muted">{today}</span>
        <div className="relative">
          <button className="w-9 h-9 rounded-full bg-bg border border-border flex items-center justify-center text-[1.1rem] hover:bg-gray-100 transition-colors">
            🔔
          </button>
          <div className="absolute top-[6px] right-[6px] w-2 h-2 bg-destructive rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

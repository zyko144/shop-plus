import { useEffect, useState } from "react";

export type Cat = { id: string; label: string; emoji: string; color: string; count: number };

export function CategorySidebar({ cats, active, onSelect }: { cats: Cat[]; active: string; onSelect: (id: string) => void }) {
  const [stuck, setStuck] = useState(false);
  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 100);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <aside className="lg:sticky lg:top-20 lg:self-start">
      <div className="glass rounded-2xl p-3 lg:p-4">
        <div className="px-2 pb-3 text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-bold">
          Catégories
        </div>
        <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible no-scrollbar">
          {cats.map((c) => {
            const isActive = c.id === active;
            return (
              <button
                key={c.id}
                onClick={() => onSelect(c.id)}
                className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap lg:w-full ${
                  isActive ? "text-white" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
                style={isActive ? { background: `linear-gradient(90deg, ${c.color}22, transparent)`, boxShadow: `inset 0 0 0 1px ${c.color}55` } : undefined}
              >
                <span
                  className="grid place-items-center w-8 h-8 rounded-lg text-base shrink-0"
                  style={{
                    background: isActive ? c.color : `${c.color}1a`,
                    color: isActive ? "#000" : c.color,
                    boxShadow: isActive ? `0 0 16px ${c.color}80` : undefined,
                  }}
                >
                  {c.emoji}
                </span>
                <span className="flex-1 text-left">{c.label}</span>
                <span className="text-[10px] opacity-60 tabular-nums">{c.count}</span>
              </button>
            );
          })}
        </nav>
      </div>
      {stuck && <div className="hidden lg:block mt-3 text-[10px] text-muted-foreground px-2">⚡ Paiement PayPal sécurisé</div>}
    </aside>
  );
}
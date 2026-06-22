import { useEffect, useState } from "react";

export type Cat = { id: string; label: string; emoji: string; color: string; count: number };

export function CategorySidebar({ cats, active, onSelect }: { cats: Cat[]; active: string; onSelect: (id: string) => void }) {
  return (
    <aside className="w-full z-40 sticky top-16 bg-background/90 backdrop-blur-xl border-b border-white/5 py-4 mt-0 shadow-xl">
      <div className="max-w-[1000px] mx-auto px-2 md:px-6">
        <nav className="flex flex-wrap items-center justify-center gap-2 md:gap-3 pb-1 px-2">
          {cats.map((c) => {
            const isActive = c.id === active;
            return (
              <button
                key={c.id}
                onClick={() => onSelect(c.id)}
                className={`group shrink-0 relative flex items-center gap-2 md:gap-3 px-3 py-2 md:px-4 md:py-2.5 rounded-2xl text-xs md:text-sm font-medium transition-all ${
                  isActive ? "text-white" : "text-muted-foreground hover:text-foreground bg-white/5 hover:bg-white/10"
                }`}
                style={isActive ? { background: `linear-gradient(135deg, ${c.color}33, transparent)`, boxShadow: `inset 0 0 0 1px ${c.color}66` } : undefined}
              >
                <span
                  className="grid place-items-center w-8 h-8 rounded-xl text-base shrink-0 transition-transform group-hover:scale-110"
                  style={{
                    background: isActive ? c.color : `${c.color}22`,
                    color: isActive ? "#000" : c.color,
                    boxShadow: isActive ? `0 0 16px ${c.color}80` : undefined,
                  }}
                >
                  {c.emoji}
                </span>
                <span className="text-left font-bold">{c.label}</span>
                <span className="text-[10px] opacity-60 tabular-nums bg-black/20 px-1.5 py-0.5 rounded-md">{c.count}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
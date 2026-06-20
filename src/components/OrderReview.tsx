import { useEffect, useState } from "react";

const KEY = "zyko_reviews_v1";

type Stored = Record<string, { rating: number; comment: string; auto?: boolean; at: number }>;

function readAll(): Stored {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; }
}
function writeAll(s: Stored) { localStorage.setItem(KEY, JSON.stringify(s)); }

export function OrderReview({ orderId, createdAt }: { orderId: string; createdAt: string }) {
  const [all, setAll] = useState<Stored>({});
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => { setAll(readAll()); }, []);

  // Auto 5★ after 2h
  useEffect(() => {
    const t = setInterval(() => {
      const current = readAll();
      if (current[orderId]) return;
      const ageMs = Date.now() - new Date(createdAt).getTime();
      if (ageMs >= 2 * 60 * 60 * 1000) {
        current[orderId] = { rating: 5, comment: "", auto: true, at: Date.now() };
        writeAll(current);
        setAll(current);
      }
    }, 30_000);
    return () => clearInterval(t);
  }, [orderId, createdAt]);

  const existing = all[orderId];

  const submit = (rating: number) => {
    const next = { ...readAll(), [orderId]: { rating, comment, at: Date.now() } };
    writeAll(next);
    setAll(next);
  };

  if (existing) {
    return (
      <div className="mt-3 border-t border-border pt-3">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Votre avis :</span>
          <Stars value={existing.rating} />
          {existing.auto && <span className="text-xs text-muted-foreground">(automatique)</span>}
        </div>
        {existing.comment && <p className="text-sm mt-1 text-muted-foreground italic">« {existing.comment} »</p>}
      </div>
    );
  }

  const msLeft = 2 * 60 * 60 * 1000 - (Date.now() - new Date(createdAt).getTime());
  const hoursLeft = Math.max(0, Math.ceil(msLeft / (60 * 60 * 1000)));

  return (
    <div className="mt-3 border-t border-border pt-3">
      <div className="text-sm mb-2">Laissez votre avis :</div>
      <div className="flex items-center gap-1 mb-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            onClick={() => submit(n)}
            className="text-2xl transition-transform hover:scale-110"
            aria-label={`${n} étoile${n > 1 ? "s" : ""}`}
          >
            <span className={n <= hover ? "text-yellow-400" : "text-muted-foreground"}>★</span>
          </button>
        ))}
      </div>
      <input
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Un commentaire ? (optionnel)"
        className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm"
      />
      <p className="text-[11px] text-muted-foreground mt-1">
        Sans réponse, un avis 5★ automatique sera ajouté dans ~{hoursLeft}h.
      </p>
    </div>
  );
}

export function Stars({ value }: { value: number }) {
  return (
    <span>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= value ? "text-yellow-400" : "text-muted-foreground/40"}>★</span>
      ))}
    </span>
  );
}
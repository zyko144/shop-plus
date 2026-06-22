import { useState } from "react";
import { MessageCircle, X, ExternalLink, Ticket } from "lucide-react";

export function DiscordSupport({ link = "https://discord.gg/UUBFjjCp" }: { link?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-[90] h-14 w-14 rounded-full grid place-items-center text-white shadow-[0_10px_40px_rgba(220,38,38,.55)] hover:scale-110 active:scale-95 transition-all"
        style={{ background: "linear-gradient(135deg,#dc2626,#991b1b)" }}
        aria-label="Support Discord"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
        <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 ring-2 ring-black animate-pulse" />
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 right-5 z-[90] w-[min(92vw,340px)] rounded-2xl glass border border-white/10 p-5 shadow-2xl animate-fade-in">
          <div className="flex items-start gap-3">
            <div
              className="h-11 w-11 rounded-xl grid place-items-center shrink-0"
              style={{ background: "linear-gradient(135deg,#dc2626,#991b1b)" }}
            >
              <Ticket size={20} className="text-white" />
            </div>
            <div className="min-w-0">
              <div className="font-bold leading-tight">Support & livraison</div>
              <p className="text-xs text-muted-foreground mt-1">
                Après ton paiement PayPal, ouvre un ticket Discord pour recevoir ton produit instantanément.
              </p>
            </div>
          </div>

          <ol className="mt-4 space-y-2 text-xs text-muted-foreground">
            <li className="flex gap-2"><span className="text-foreground font-bold">1.</span> Rejoins le serveur Discord</li>
            <li className="flex gap-2"><span className="text-foreground font-bold">2.</span> Va dans <span className="text-foreground">#créer-un-ticket</span></li>
            <li className="flex gap-2"><span className="text-foreground font-bold">3.</span> Envoie ta preuve PayPal + le produit acheté</li>
            <li className="flex gap-2"><span className="text-foreground font-bold">4.</span> Livraison sous quelques minutes 🚀</li>
          </ol>

          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            className="mt-4 w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white transition hover:scale-[1.02]"
            style={{ background: "linear-gradient(135deg,#dc2626,#991b1b)", boxShadow: "0 8px 24px rgba(220,38,38,.45)" }}
          >
            Ouvrir un ticket Discord <ExternalLink size={14} />
          </a>
        </div>
      )}
    </>
  );
}

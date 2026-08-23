import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Star, MessageSquare, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getAllProducts, Product } from "@/lib/products";
import { Header } from "@/components/Header";
import { CartDrawer } from "@/components/CartDrawer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/avis")({
  component: AvisPage,
  head: () => ({ meta: [{ title: "Avis clients — Vercell" }] }),
});

type Review = {
  id: string;
  product_id: string;
  rating: number;
  comment: string;
  created_at: string;
  screenshot_url: string | null;
  profiles: { username: string } | null;
};

function StarsRow({ value }: { value: number }) {
  return (
    <div className="flex text-gray-400">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={14} className={i < value ? "fill-gray-400" : "opacity-25"} />
      ))}
    </div>
  );
}

function AvisPage() {
  const { profile } = useAuth();
  const isAdmin = profile?.role === "admin";
  const [reviews, setReviews] = useState<Review[]>([]);
  const [products, setProducts] = useState<Record<string, Product>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [{ data: reviewsData }, allProducts] = await Promise.all([
        supabase.from("reviews").select("*, profiles(username)").order("created_at", { ascending: false }).limit(60),
        getAllProducts(),
      ]);
      setReviews(reviewsData || []);
      setProducts(Object.fromEntries(allProducts.map((p) => [p.id, p])));
      setLoading(false);
    })();
  }, []);

  const deleteReview = async (id: string) => {
    if (!window.confirm("Supprimer cet avis définitivement ?")) return;
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) {
      toast.error("Erreur : " + error.message);
    } else {
      setReviews((prev) => prev.filter((r) => r.id !== id));
      toast.success("Avis supprimé");
    }
  };

  const avg = reviews.length ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : "0.0";

  return (
    <div className="min-h-screen pb-20 selection:bg-gray-500/30">
      <Header />
      <CartDrawer />

      <main className="max-w-5xl mx-auto px-6 py-12 md:py-20">
        <ScrollReveal>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/70 font-semibold text-sm mb-4">
              <MessageSquare size={16} /> Avis clients
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-black leading-tight mb-3">Ce que disent nos clients</h1>
            {reviews.length > 0 && (
              <div className="flex items-center justify-center gap-2 text-white/60">
                <StarsRow value={Math.round(Number(avg))} />
                <span className="font-bold text-white">{avg}</span>
                <span>· {reviews.length} avis</span>
              </div>
            )}
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="text-center text-white/40 py-20 animate-pulse">Chargement des avis...</div>
        ) : reviews.length === 0 ? (
          <div className="text-center text-white/40 py-20 italic">Aucun avis pour l'instant. Soyez le premier à en laisser un depuis votre espace client !</div>
        ) : (
          <ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((r) => {
                const product = products[r.product_id];
                return (
                  <div key={r.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-sm">{r.profiles?.username || "Client Vercell"}</div>
                      <div className="flex items-center gap-2">
                        <StarsRow value={r.rating} />
                        {isAdmin && (
                          <button
                            onClick={() => deleteReview(r.id)}
                            className="p-1 rounded-lg text-white/30 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                            title="Supprimer cet avis"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                    {r.comment && <p className="text-sm text-white/70 flex-1">« {r.comment} »</p>}
                    {r.screenshot_url && (
                      <img src={r.screenshot_url} alt="Preuve" className="rounded-xl border border-white/10 max-h-48 object-cover" />
                    )}
                    <div className="flex items-center justify-between text-[11px] text-white/35 pt-2 border-t border-white/5">
                      <span>{product?.name || "Produit Vercell"}</span>
                      <span>{new Date(r.created_at).toLocaleDateString("fr-FR")}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollReveal>
        )}
      </main>
    </div>
  );
}

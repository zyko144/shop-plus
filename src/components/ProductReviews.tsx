import { useState, useEffect } from "react";
import { Star, MessageSquare, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export function ProductReviewsModal({ productId, productName, color, onClose }: { productId: string, productName: string, color: string, onClose: () => void }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    const { data } = await supabase
      .from("reviews")
      .select("*, profiles(username)")
      .eq("product_id", productId)
      .order("created_at", { ascending: false });
    setReviews(data || []);
    setLoading(false);
  };

  const submitReview = async () => {
    if (!user) {
      toast.error("Veuillez vous connecter pour laisser un avis.");
      return;
    }
    if (!newComment.trim()) return;
    setSubmitting(true);
    const { error } = await supabase.from("reviews").insert({
      product_id: productId,
      user_id: user.id,
      rating: newRating,
      comment: newComment.trim(),
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Votre avis a été publié !");
      setNewComment("");
      fetchReviews();
    }
  };

  const avgRating = reviews.length ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : "0.0";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-black/90 border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <MessageSquare size={20} style={{ color }} /> Avis sur {productName}
            </h2>
            <div className="flex items-center gap-2 text-sm text-white/50 mt-1">
              <Star size={14} className="fill-yellow-500 text-yellow-500" />
              <span>{avgRating} ({reviews.length} avis)</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-4">
          {loading ? (
            <div className="animate-pulse text-center text-white/50 py-10">Chargement...</div>
          ) : reviews.length === 0 ? (
            <div className="text-center text-white/40 py-10 italic">Aucun avis pour l'instant. Soyez le premier !</div>
          ) : (
            reviews.map((r) => (
              <div key={r.id} className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-bold text-sm text-white/90">{r.profiles?.username || "Utilisateur"}</div>
                  <div className="flex text-yellow-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={12} className={i < r.rating ? "fill-yellow-500" : "opacity-30"} />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-white/70">{r.comment}</p>
                <div className="text-[10px] text-white/30 mt-2">{new Date(r.created_at).toLocaleDateString()}</div>
              </div>
            ))
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-white/10">
          {!user ? (
            <div className="text-center text-sm text-white/50 bg-white/5 p-3 rounded-xl border border-white/10">
              Connectez-vous pour laisser un avis.
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button key={i} onClick={() => setNewRating(i + 1)} className="p-1 hover:scale-110 transition">
                    <Star size={20} className={i < newRating ? "fill-yellow-500 text-yellow-500" : "text-white/30"} />
                  </button>
                ))}
              </div>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Votre avis sur ce produit..."
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-white/30 resize-none outline-none focus:border-white/30"
                rows={3}
              />
              <button
                onClick={submitReview}
                disabled={submitting || !newComment.trim()}
                className="w-full py-2.5 rounded-xl font-bold text-sm disabled:opacity-50 transition"
                style={{ background: color, color: "#000" }}
              >
                {submitting ? "Publication..." : "Publier mon avis"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

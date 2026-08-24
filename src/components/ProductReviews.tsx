import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Star, MessageSquare, X, Paperclip, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { notifyDiscordReview } from "@/lib/discord";

export function ProductReviewsModal({ productId, productName, color, logo, onClose }: { productId: string, productName: string, color: string, logo?: string | null, onClose: () => void }) {
  const { user, profile } = useAuth();
  const isAdmin = profile?.role === "admin";
  const isDiscordUser = Boolean(user && ((user.app_metadata as any)?.provider === "discord" || (user.app_metadata as any)?.providers?.includes?.("discord")));
  const discordUsername = (user?.user_metadata as any)?.full_name || (user?.user_metadata as any)?.preferred_username || (user?.user_metadata as any)?.name || "";
  const discordAvatarUrl = (user?.user_metadata as any)?.avatar_url as string | undefined;

  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (!user || !isDiscordUser) return;
    if (!newComment.trim() || !screenshotFile) {
      toast.error("Ajoute un commentaire et une capture d'écran.");
      return;
    }
    setSubmitting(true);
    try {
      if (discordUsername) {
        await supabase.from("profiles").update({ username: discordUsername }).eq("id", user.id);
      }

      const fileExt = screenshotFile.name.split(".").pop();
      const fileName = `review-${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from("chat_attachments").upload(fileName, screenshotFile);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from("chat_attachments").getPublicUrl(fileName);

      const { error } = await supabase.from("reviews").insert({
        product_id: productId,
        user_id: user.id,
        rating: newRating,
        comment: newComment.trim(),
        screenshot_url: publicUrl,
      });
      if (error) throw error;

      toast.success("Votre avis a été publié !");
      notifyDiscordReview({
        data: {
          username: discordUsername || "Client Vercell",
          avatarUrl: discordAvatarUrl,
          productName,
          rating: newRating,
          comment: newComment.trim(),
          productLogo: logo,
          productColor: color,
          screenshotUrl: publicUrl,
        },
      }).catch(() => {});
      setNewComment("");
      setScreenshotFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchReviews();
    } catch (e: any) {
      toast.error(e.message || "Erreur lors de la publication.");
    } finally {
      setSubmitting(false);
    }
  };

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

  const avgRating = reviews.length ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : "0.0";

  const modalContent = (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-black/90 border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <MessageSquare size={20} style={{ color }} /> Avis sur {productName}
            </h2>
            <div className="flex items-center gap-2 text-sm text-white/50 mt-1">
              <Star size={14} className="fill-gray-500 text-gray-500" />
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
                  <div className="flex items-center gap-2">
                    <div className="flex text-gray-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={12} className={i < r.rating ? "fill-gray-500" : "opacity-30"} />
                      ))}
                    </div>
                    {isAdmin && (
                      <button onClick={() => deleteReview(r.id)} className="p-1 rounded-lg text-white/30 hover:text-red-500 hover:bg-red-500/10 transition-colors" title="Supprimer cet avis">
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-sm text-white/70">{r.comment}</p>
                {r.screenshot_url && (
                  <img src={r.screenshot_url} alt="Preuve" className="mt-2 rounded-xl border border-white/10 max-h-40 object-cover" />
                )}
                <div className="text-[10px] text-white/30 mt-2">{new Date(r.created_at).toLocaleDateString()}</div>
              </div>
            ))
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-white/10">
          {!user || !isDiscordUser ? (
            <div className="text-center space-y-3">
              <div className="text-sm text-white/50 bg-white/5 p-3 rounded-xl border border-white/10">
                Connecte-toi avec Discord pour laisser un avis.
              </div>
              <button
                onClick={() => supabase.auth.signInWithOAuth({ provider: "discord", options: { redirectTo: window.location.href } })}
                className="w-full py-2.5 rounded-xl font-bold text-sm bg-[#5865F2] hover:bg-[#4752c4] text-white transition-colors"
              >
                Se connecter avec Discord
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-white/60">
                {discordAvatarUrl && <img src={discordAvatarUrl} alt="" className="w-6 h-6 rounded-full" />}
                <span>Publié en tant que <strong className="text-white">{discordUsername || "toi"}</strong></span>
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button key={i} onClick={() => setNewRating(i + 1)} className="p-1 hover:scale-110 transition">
                    <Star size={20} className={i < newRating ? "fill-gray-500 text-gray-500" : "text-white/30"} />
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
              <label className="flex items-center gap-2 w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white/70 cursor-pointer hover:border-white/30 transition-colors">
                <Paperclip size={16} className="shrink-0" />
                <span className="truncate">{screenshotFile ? screenshotFile.name : "Ajouter une capture d'écran (obligatoire)"}</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setScreenshotFile(e.target.files?.[0] || null)}
                />
              </label>
              <button
                onClick={submitReview}
                disabled={submitting || !newComment.trim() || !screenshotFile}
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

  if (typeof document !== "undefined") {
    return createPortal(modalContent, document.body);
  }

  return modalContent;
}

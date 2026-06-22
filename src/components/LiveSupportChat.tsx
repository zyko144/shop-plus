import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, User, Paperclip, ChevronDown, ChevronUp, Image as ImageIcon, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

type SupportMessage = {
  id: string;
  user_id: string;
  content: string;
  is_admin_reply: boolean;
  created_at: string;
};

export function LiveSupportChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [showFaq, setShowFaq] = useState(false);
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOpen = () => setOpen(true);
    window.addEventListener("open-support-chat", handleOpen);
    return () => window.removeEventListener("open-support-chat", handleOpen);
  }, []);

  useEffect(() => {
    if (!open || !user) return;

    const fetchMessages = async () => {
      const { data } = await supabase
        .from("support_messages")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });
      if (data) setMessages(data);
    };

    fetchMessages();

    const channel = supabase
      .channel("public:support_messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "support_messages", filter: `user_id=eq.${user.id}` },
        (payload) => {
          setMessages((current) => [...current, payload.new as SupportMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [open, user]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const handleUpload = async (file: File) => {
    if (!user) return;
    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('chat_attachments')
        .upload(fileName, file);
        
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('chat_attachments')
        .getPublicUrl(fileName);
        
      await supabase.from("support_messages").insert({
        user_id: user.id,
        content: `[IMAGE] ${publicUrl}`,
        is_admin_reply: false,
      });
    } catch (e) {
      console.error("Upload error:", e);
      alert("Erreur lors de l'envoi de l'image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();
        if (file) handleUpload(file);
      }
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || isUploading) return;

    const content = newMessage.trim();
    setNewMessage("");

    await supabase.from("support_messages").insert({
      user_id: user.id,
      content,
      is_admin_reply: false,
    });
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 p-4 rounded-full shadow-2xl transition-all hover:scale-110 z-50 animate-pulse group"
        style={{ background: "linear-gradient(135deg, #dc2626, #991b1b)" }}
      >
        <MessageSquare size={28} className="text-white group-hover:rotate-12 transition-transform" />
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 w-[350px] sm:w-[400px] bg-black/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          <div className="p-4 border-b border-white/10 bg-gradient-to-r from-red-600/20 to-transparent flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 border border-red-500/50">
                <User size={20} />
              </div>
              <div>
                <h3 className="font-bold text-white">Support en direct</h3>
                <p className="text-xs text-green-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> En ligne
                </p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/50 hover:text-white transition">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 p-4 h-[350px] overflow-y-auto flex flex-col gap-3 scrollbar-hide">
            {!user ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground p-4">
                <MessageSquare size={48} className="mb-4 opacity-20" />
                <p className="mb-4">Connectez-vous pour discuter avec notre équipe d'assistance.</p>
                <a href="/auth" className="px-4 py-2 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition">
                  Se connecter
                </a>
              </div>
            ) : (
              <>
                {/* FAQ Section */}
                <div className="mb-2 bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                  <button 
                    onClick={() => setShowFaq(!showFaq)}
                    className="w-full px-4 py-2 flex items-center justify-between text-sm font-bold text-white/80 hover:bg-white/5 transition"
                  >
                    <span>Foire Aux Questions</span>
                    {showFaq ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  {showFaq && (
                    <div className="p-4 text-xs space-y-3 bg-black/40 border-t border-white/5">
                      <div>
                        <strong className="text-red-400 block mb-0.5">Mon compte a un problème ?</strong>
                        <span className="text-muted-foreground">Tout problème avec un compte est remplacé immédiatement sous preuve (capture d'écran). N'hésitez pas à coller/uploader vos images ici.</span>
                      </div>
                      <div>
                        <strong className="text-red-400 block mb-0.5">Puis-je changer les identifiants ?</strong>
                        <span className="text-muted-foreground">Il est strictement interdit de modifier l'e-mail ou le mot de passe des comptes fournis, sous peine d'annulation de votre garantie.</span>
                      </div>
                      <div>
                        <strong className="text-red-400 block mb-0.5">Combien de temps dure la garantie ?</strong>
                        <span className="text-muted-foreground">La garantie est valable sur toute la durée de l'abonnement acheté. S'il y a une coupure, nous vous fournissons un compte de remplacement.</span>
                      </div>
                      <div>
                        <strong className="text-red-400 block mb-0.5">Quels paiements acceptez-vous ?</strong>
                        <span className="text-muted-foreground">Les paiements s'effectuent de manière 100% sécurisée via PayPal pour une livraison instantanée.</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-center text-[10px] text-muted-foreground my-2 uppercase tracking-wider font-bold">
                  Un membre de l'équipe vous répondra
                </div>
                {messages.map((msg) => {
                  const isImage = msg.content.startsWith('[IMAGE] ');
                  const imageUrl = isImage ? msg.content.replace('[IMAGE] ', '') : '';
                  return (
                  <div key={msg.id} className={`flex ${msg.is_admin_reply ? "justify-start" : "justify-end"}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                        msg.is_admin_reply
                          ? "bg-white/10 text-white rounded-tl-none"
                          : "bg-red-600 text-white rounded-tr-none"
                      }`}
                    >
                      {isImage ? (
                        <a href={imageUrl} target="_blank" rel="noreferrer">
                          <img src={imageUrl} alt="Pièce jointe" className="rounded-lg max-w-full h-auto max-h-[150px] object-contain border border-white/10 mt-1 mb-1 hover:opacity-80 transition cursor-zoom-in" />
                        </a>
                      ) : (
                        msg.content
                      )}
                      <div className={`text-[10px] mt-1 ${msg.is_admin_reply ? "text-white/40" : "text-red-200"}`}>
                        {new Date(msg.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                )})}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {user && (
            <div className="p-3 border-t border-white/10 bg-black/50">
              <form onSubmit={sendMessage} className="flex gap-2">
                <label className={`p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-muted-foreground hover:text-white rounded-xl transition cursor-pointer flex items-center justify-center ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                  {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Paperclip size={18} />}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} />
                </label>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onPaste={handlePaste}
                  placeholder="Écrivez ou Ctrl+V..."
                  disabled={isUploading}
                  className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:border-red-500 outline-none transition disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || isUploading}
                  className="p-2.5 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white rounded-xl transition flex-shrink-0"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </>
  );
}

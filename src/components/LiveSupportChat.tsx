import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, User } from "lucide-react";
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

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

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
                <div className="text-center text-xs text-muted-foreground my-2">
                  Un membre de l'équipe vous répondra dans les plus brefs délais.
                </div>
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.is_admin_reply ? "justify-start" : "justify-end"}`}>
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                        msg.is_admin_reply
                          ? "bg-white/10 text-white rounded-tl-none"
                          : "bg-red-600 text-white rounded-tr-none"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {user && (
            <div className="p-3 border-t border-white/10 bg-black/50">
              <form onSubmit={sendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Écrivez votre message..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:border-red-500 outline-none transition"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="p-2.5 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white rounded-xl transition"
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

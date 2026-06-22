import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MessageSquare, Send, User } from "lucide-react";

export function AdminSupport() {
  const [conversations, setConversations] = useState<{user_id: string, email: string, username: string, unread: number, lastMessageDate: string}[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [reply, setReply] = useState("");

  const loadConversations = async () => {
    // We fetch all messages and group them
    const { data } = await supabase
      .from("support_messages")
      .select("*, profiles:user_id(email, username)")
      .order("created_at", { ascending: false });
      
    if (data) {
      const grouped = data.reduce((acc: any, msg: any) => {
        if (!acc[msg.user_id]) {
          acc[msg.user_id] = {
            user_id: msg.user_id,
            email: msg.profiles?.email || "Inconnu",
            username: msg.profiles?.username || "Anonyme",
            unread: 0,
            lastMessageDate: msg.created_at
          };
        }
        if (!msg.is_admin_reply && !msg.read) {
          acc[msg.user_id].unread += 1;
        }
        return acc;
      }, {});
      setConversations(Object.values(grouped).sort((a: any, b: any) => new Date(b.lastMessageDate).getTime() - new Date(a.lastMessageDate).getTime()));
    }
  };

  useEffect(() => {
    loadConversations();
    const channel = supabase.channel('admin_support_sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'support_messages' }, () => {
        loadConversations();
        if (selectedUser) loadMessages(selectedUser);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const loadMessages = async (userId: string) => {
    const { data } = await supabase
      .from("support_messages")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });
    if (data) setMessages(data);
    
    // Mark as read
    await supabase.from("support_messages").update({ read: true }).eq("user_id", userId).eq("is_admin_reply", false);
    loadConversations();
  };

  useEffect(() => {
    if (selectedUser) loadMessages(selectedUser);
  }, [selectedUser]);

  const sendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim() || !selectedUser) return;
    
    const content = reply.trim();
    setReply("");
    
    await supabase.from("support_messages").insert({
      user_id: selectedUser,
      content,
      is_admin_reply: true,
      read: true
    });
  };

  return (
    <div className="glass rounded-2xl overflow-hidden border border-border/50 flex h-[600px]">
      {/* Sidebar */}
      <div className="w-1/3 border-r border-border/50 bg-black/40 overflow-y-auto">
        <div className="p-4 border-b border-white/10 sticky top-0 bg-black/80 backdrop-blur-md">
          <h2 className="font-bold text-lg flex items-center gap-2"><MessageSquare size={18} /> Conversations</h2>
        </div>
        {conversations.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">Aucun message de support.</div>
        ) : (
          <div className="divide-y divide-white/5">
            {conversations.map(conv => (
              <button 
                key={conv.user_id}
                onClick={() => setSelectedUser(conv.user_id)}
                className={`w-full text-left p-4 hover:bg-white/5 transition-colors ${selectedUser === conv.user_id ? 'bg-white/10' : ''}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="font-bold text-white text-sm truncate flex-1 mr-2">{conv.email}</div>
                  {conv.unread > 0 && <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{conv.unread}</span>}
                </div>
                <div className="text-xs text-muted-foreground">{conv.username}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-black/20">
        {!selectedUser ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Sélectionnez une conversation pour répondre.
          </div>
        ) : (
          <>
            <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.is_admin_reply ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${msg.is_admin_reply ? "bg-red-600 text-white rounded-tr-none" : "bg-white/10 text-white rounded-tl-none"}`}>
                    {msg.content}
                    <div className="text-[10px] opacity-50 mt-1">{new Date(msg.created_at).toLocaleTimeString()}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-white/10 bg-black/40">
              <form onSubmit={sendReply} className="flex gap-2">
                <input
                  type="text"
                  value={reply}
                  onChange={e => setReply(e.target.value)}
                  placeholder="Répondre au client..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:border-red-500 outline-none transition"
                />
                <button type="submit" disabled={!reply.trim()} className="px-4 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white rounded-xl font-bold transition flex items-center gap-2">
                  <Send size={16} /> Envoyer
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

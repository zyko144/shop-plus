import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MessageSquare, Send, User, Paperclip, Loader2 } from "lucide-react";

export function AdminSupport() {
  const [conversations, setConversations] = useState<{user_id: string, email: string, username: string, unread: number, lastMessageDate: string}[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [reply, setReply] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const loadConversations = async () => {
    // 1. Fetch messages
    const { data: messagesData, error } = await supabase
      .from("support_messages")
      .select("*")
      .order("created_at", { ascending: false });
      
    if (error) {
      console.error("Error fetching support messages:", error);
      return;
    }
      
    if (messagesData) {
      // 2. Extract unique user IDs
      const userIds = [...new Set(messagesData.map((m: any) => m.user_id))];
      
      // 3. Fetch profiles
      let profilesMap: Record<string, any> = {};
      if (userIds.length > 0) {
        const { data: profilesData } = await supabase
          .from("profiles")
          .select("id, email, username")
          .in("id", userIds);
          
        profilesMap = (profilesData || []).reduce((acc: any, p: any) => {
          acc[p.id] = p;
          return acc;
        }, {});
      }

      // 4. Group messages
      const grouped = messagesData.reduce((acc: any, msg: any) => {
        if (!acc[msg.user_id]) {
          acc[msg.user_id] = {
            user_id: msg.user_id,
            email: profilesMap[msg.user_id]?.email || "Inconnu",
            username: profilesMap[msg.user_id]?.username || "Anonyme",
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

  const handleUpload = async (file: File) => {
    if (!selectedUser) return;
    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `admin-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('chat_attachments')
        .upload(fileName, file);
        
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('chat_attachments')
        .getPublicUrl(fileName);
        
      await supabase.from("support_messages").insert({
        user_id: selectedUser,
        content: `[IMAGE] ${publicUrl}`,
        is_admin_reply: true,
        read: true
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

  const sendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim() || !selectedUser || isUploading) return;
    
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
              {messages.map(msg => {
                const isImage = msg.content.startsWith('[IMAGE] ');
                const imageUrl = isImage ? msg.content.replace('[IMAGE] ', '') : '';
                return (
                <div key={msg.id} className={`flex ${msg.is_admin_reply ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${msg.is_admin_reply ? "bg-red-600 text-white rounded-tr-none" : "bg-white/10 text-white rounded-tl-none"}`}>
                    {isImage ? (
                      <a href={imageUrl} target="_blank" rel="noreferrer">
                        <img src={imageUrl} alt="Pièce jointe" className="rounded-lg max-w-full h-auto max-h-[150px] object-contain border border-white/10 mt-1 mb-1 hover:opacity-80 transition cursor-zoom-in" />
                      </a>
                    ) : (
                      msg.content
                    )}
                    <div className="text-[10px] opacity-50 mt-1">{new Date(msg.created_at).toLocaleTimeString()}</div>
                  </div>
                </div>
              )})}
            </div>
            <div className="p-4 border-t border-white/10 bg-black/40">
              <form onSubmit={sendReply} className="flex gap-2">
                <label className={`p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-muted-foreground hover:text-white rounded-xl transition cursor-pointer flex items-center justify-center ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                  {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Paperclip size={18} />}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} />
                </label>
                <input
                  type="text"
                  value={reply}
                  onChange={e => setReply(e.target.value)}
                  onPaste={handlePaste}
                  placeholder="Répondre au client ou Ctrl+V..."
                  disabled={isUploading}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:border-red-500 outline-none transition disabled:opacity-50"
                />
                <button type="submit" disabled={!reply.trim() || isUploading} className="px-4 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white rounded-xl font-bold transition flex items-center gap-2">
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

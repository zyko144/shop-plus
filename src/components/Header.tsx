import { Link } from "@tanstack/react-router";
import { ShoppingCart, User, LogOut, Shield, MessageSquare } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import logoImg from "@/assets/logo.png";

export function Header() {
  const { count, setOpen } = useCart();
  const { user, profile, signOut } = useAuth();
  const [hasUnreadSupport, setHasUnreadSupport] = useState(false);

  useEffect(() => {
    if (profile?.role === "admin") {
      const checkUnread = async () => {
        const { count } = await supabase
          .from("support_messages")
          .select("*", { count: "exact", head: true })
          .eq("is_admin_reply", false)
          .eq("read", false);
        setHasUnreadSupport((count || 0) > 0);
      };
      checkUnread();

      const channel = supabase
        .channel("admin_notifications")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "support_messages", filter: "is_admin_reply=eq.false" },
          () => setHasUnreadSupport(true)
        )
        .subscribe();
      
      return () => { supabase.removeChannel(channel); };
    }
  }, [profile]);

  return (
    <header className="sticky top-0 z-50 glass border-b border-border">
      <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Left: Logo */}
        <div className="flex-1 flex items-center">
          <Link to="/" className="flex items-center gap-2.5 font-black text-lg">
            <img src={logoImg} alt="SHOP+" className="w-9 h-9 rounded-xl shadow-[0_0_24px_rgba(220,38,38,.6)]" />
            <span className="tracking-tight">SHOP<span className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 bg-clip-text text-transparent">+</span></span>
          </Link>
        </div>

        {/* Center: Navigation */}
        <div className="hidden md:flex flex-1 items-center justify-center gap-4 text-sm">
          <Link to="/premium" className="px-4 py-1.5 rounded-full border border-white/5 bg-white/5 text-muted-foreground hover:bg-purple-500/10 hover:text-purple-400 hover:border-purple-500/30 font-semibold transition-all flex items-center gap-2 backdrop-blur-md">
            👑 Premium
          </Link>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("open-support-chat"))}
            className="px-4 py-1.5 rounded-full border border-white/5 bg-white/5 text-muted-foreground hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 font-semibold transition-all flex items-center gap-2 backdrop-blur-md"
          >
            <MessageSquare size={16} /> Support en direct
          </button>
        </div>
        
        {/* Right: User Actions */}
        <div className="flex-1 flex items-center justify-end gap-2 md:gap-4">
          {user ? (
            <div className="flex items-center gap-1">
              {profile?.role === "admin" && (
                <Link to="/admin" className="relative text-sm px-3 py-2 rounded-xl hover:bg-white/5 text-red-500 flex items-center gap-2 font-bold transition-colors">
                  <Shield size={16} /> <span className="hidden sm:inline">Admin</span>
                  {hasUnreadSupport && (
                    <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                    </span>
                  )}
                </Link>
              )}
              <Link to="/profile" className="text-sm px-3 py-2 rounded-xl hover:bg-white/5 text-muted-foreground hover:text-foreground flex items-center gap-2 font-medium transition-colors">
                <User size={16} /> <span className="hidden sm:inline">Espace Client</span>
              </Link>
              <button onClick={signOut} className="text-sm px-3 py-2 rounded-xl hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors" title="Déconnexion">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link to="/auth" className="text-sm px-5 py-2 rounded-xl bg-white text-black hover:bg-gray-200 font-bold transition-colors">
              Connexion
            </Link>
          )}
          
          <div className="w-px h-6 bg-white/10 hidden sm:block mx-1"></div>
          
          <button
            onClick={() => setOpen(true)}
            className="relative p-2 rounded-lg hover:bg-muted"
            aria-label="Cart"
          >
            <ShoppingCart size={20} />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full grid place-items-center font-bold">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
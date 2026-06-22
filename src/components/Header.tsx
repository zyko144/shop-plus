import { Link } from "@tanstack/react-router";
import { ShoppingCart, User, LogOut, Shield } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import logoImg from "@/assets/logo.png";

export function Header() {
  const { count, setOpen } = useCart();
  const { user, profile, signOut } = useAuth();
  return (
    <header className="sticky top-0 z-50 glass border-b border-border">
      <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 font-black text-lg">
          <img src={logoImg} alt="SHOP+" className="w-9 h-9 rounded-xl shadow-[0_0_24px_rgba(220,38,38,.6)]" />
          <span className="tracking-tight">SHOP<span className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 bg-clip-text text-transparent">+</span></span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm">
          <Link to="/premium" className="text-muted-foreground hover:text-purple-400 font-bold transition-colors flex items-center gap-2">
            👑 Premium
          </Link>
          <a
            href="https://discord.gg/UUBFjjCp"
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-red-500 font-bold transition-colors flex items-center gap-2"
          >
            🎫 Support Discord
          </a>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          {user ? (
            <div className="flex items-center gap-1">
              {profile?.role === "admin" && (
                <Link to="/admin" className="text-sm px-3 py-2 rounded-xl hover:bg-white/5 text-red-500 flex items-center gap-2 font-bold transition-colors">
                  <Shield size={16} /> <span className="hidden sm:inline">Admin</span>
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
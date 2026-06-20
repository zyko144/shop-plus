import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Connexion — ZYKO Store" }, { name: "description", content: "Connectez-vous ou créez un compte pour commander sur ZYKO Store." }] }),
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate({ to: "/" });
  }, [user, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin, data: { username } },
        });
        if (error) throw error;
        toast.success("Compte créé ! Vérifie tes emails pour confirmer ton adresse.", { duration: 6000 });
        setMode("login");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Connecté !");
      }
    } catch (e: any) {
      console.error("Auth error:", e);
      toast.error(e?.message || "Erreur du serveur d'envoi d'emails (SMTP).");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-black grid place-items-center px-6">
      {/* Animated 3D-like floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-red-600/30 rounded-full mix-blend-screen filter blur-[50px] animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-1/4 right-1/3 w-40 h-40 bg-orange-600/20 rounded-full mix-blend-screen filter blur-[60px] animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-900/40 rounded-full mix-blend-screen filter blur-[100px]" />
        
        {/* Floating abstract shapes mimicking 3D platform logos */}
        {/* Ligne du haut */}
        <img src="https://cdn.jsdelivr.net/npm/simple-icons@11.0.0/icons/netflix.svg" alt="Netflix" className="absolute top-[10%] left-[10%] w-16 h-16 opacity-30 filter blur-[2px] invert" style={{ animation: 'float 6s ease-in-out infinite' }} />
        <img src="https://cdn.jsdelivr.net/npm/simple-icons@11.0.0/icons/twitch.svg" alt="Twitch" className="absolute top-[15%] right-[20%] w-14 h-14 opacity-40 filter blur-[1px] invert" style={{ animation: 'float 7s ease-in-out infinite 1s reverse' }} />
        <img src="https://cdn.jsdelivr.net/npm/simple-icons@11.0.0/icons/discord.svg" alt="Discord" className="absolute top-[5%] right-[40%] w-12 h-12 opacity-30 filter blur-[3px] invert" style={{ animation: 'float 8s ease-in-out infinite 2s' }} />
        <img src="https://cdn.jsdelivr.net/npm/simple-icons@11.0.0/icons/xbox.svg" alt="Xbox" className="absolute top-[8%] left-[40%] w-12 h-12 opacity-30 filter blur-[1.5px] invert" style={{ animation: 'float 6.5s ease-in-out infinite 0.5s reverse' }} />
        
        {/* Ligne du milieu gauche/droite */}
        <img src="https://cdn.jsdelivr.net/npm/simple-icons@11.0.0/icons/youtube.svg" alt="YouTube" className="absolute top-[40%] left-[5%] w-16 h-12 opacity-40 filter blur-[1.5px] invert" style={{ animation: 'float 5s ease-in-out infinite 1.5s' }} />
        <img src="https://cdn.jsdelivr.net/npm/simple-icons@11.0.0/icons/disneyplus.svg" alt="Disney+" className="absolute top-[35%] right-[8%] w-20 h-10 opacity-30 filter blur-[2px] invert" style={{ animation: 'float 9s ease-in-out infinite reverse' }} />
        
        <img src="https://cdn.jsdelivr.net/npm/simple-icons@11.0.0/icons/steam.svg" alt="Steam" className="absolute top-[55%] left-[20%] w-14 h-14 opacity-30 filter blur-[3px] invert" style={{ animation: 'float 6s ease-in-out infinite 0.5s' }} />
        <img src="https://cdn.jsdelivr.net/npm/simple-icons@11.0.0/icons/nintendoswitch.svg" alt="Switch" className="absolute top-[42%] left-[32%] w-12 h-12 opacity-40 filter blur-[1.5px] invert" style={{ animation: 'float 7.5s ease-in-out infinite 1.8s reverse' }} />

        <img src="https://cdn.jsdelivr.net/npm/simple-icons@11.0.0/icons/primevideo.svg" alt="Prime" className="absolute top-[60%] right-[15%] w-16 h-8 opacity-30 filter blur-[1.5px] invert" style={{ animation: 'float 7s ease-in-out infinite 1s' }} />
        <img src="https://cdn.jsdelivr.net/npm/simple-icons@11.0.0/icons/hulu.svg" alt="Hulu" className="absolute top-[45%] right-[25%] w-16 h-8 opacity-20 filter blur-[2px] invert" style={{ animation: 'float 8s ease-in-out infinite 1.5s' }} />

        {/* Ligne du bas */}
        <img src="https://cdn.jsdelivr.net/npm/simple-icons@11.0.0/icons/spotify.svg" alt="Spotify" className="absolute bottom-[20%] left-[10%] w-14 h-14 opacity-40 filter blur-[2px] invert" style={{ animation: 'float 8s ease-in-out infinite 2.5s reverse' }} />
        <img src="https://cdn.jsdelivr.net/npm/simple-icons@11.0.0/icons/epicgames.svg" alt="Epic Games" className="absolute bottom-[10%] right-[25%] w-14 h-16 opacity-30 filter blur-[3px] invert" style={{ animation: 'float 6.5s ease-in-out infinite' }} />
        <img src="https://cdn.jsdelivr.net/npm/simple-icons@11.0.0/icons/crunchyroll.svg" alt="Crunchyroll" className="absolute bottom-[25%] right-[5%] w-14 h-14 opacity-50 filter blur-[1px] invert" style={{ animation: 'float 5.5s ease-in-out infinite 3s' }} />
        <img src="https://cdn.jsdelivr.net/npm/simple-icons@11.0.0/icons/playstation.svg" alt="PlayStation" className="absolute bottom-[35%] left-[30%] w-16 h-12 opacity-30 filter blur-[1px] invert" style={{ animation: 'float 7s ease-in-out infinite 0.8s reverse' }} />
        <img src="https://cdn.jsdelivr.net/npm/simple-icons@11.0.0/icons/appletv.svg" alt="Apple TV" className="absolute bottom-[15%] left-[60%] w-14 h-8 opacity-30 filter blur-[2.5px] invert" style={{ animation: 'float 6s ease-in-out infinite 2s' }} />
      </div>

      <div className="w-full max-w-md relative z-10 p-8 space-y-8 rounded-[2rem] border border-red-500/20 bg-black/40 backdrop-blur-2xl" style={{ boxShadow: "0 0 80px -20px rgba(220,38,38,0.3), inset 0 0 20px -10px rgba(220,38,38,0.2)" }}>
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-black shadow-[0_0_40px_rgba(220,38,38,0.4)] border border-red-600/30 mb-4 overflow-hidden p-2">
            <img src="/logo.png" alt="SHOP+ Logo" className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center justify-center gap-2">
            {mode === "login" ? "Connexion" : "Rejoindre"}
            <span className="bg-gradient-to-r from-red-500 to-red-800 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]">SHOP+</span>
          </h1>
          <p className="text-sm text-red-200/60 font-medium">L'accès premium à vos plateformes préférées.</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {mode === "signup" && (
            <div className="space-y-1">
              <input
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Votre pseudo"
                className="w-full px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:bg-white/10 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 outline-none transition-all"
              />
            </div>
          )}
          <div className="space-y-1">
            <input
              required type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Adresse email"
              className="w-full px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:bg-white/10 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 outline-none transition-all"
            />
          </div>
          <div className="space-y-1">
            <input
              required type="password" minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              className="w-full px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:bg-white/10 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 outline-none transition-all"
            />
          </div>
          <div className="pt-2">
            <button
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-red-600 to-red-800 text-white font-bold tracking-wide disabled:opacity-50 hover:shadow-[0_0_30px_-5px_rgba(220,38,38,0.6)] hover:-translate-y-0.5 transition-all duration-300"
            >
              {loading ? "Chargement..." : mode === "login" ? "Accéder à mon compte" : "Créer mon compte"}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-white/50 pt-2">
          {mode === "login" ? "Nouveau sur SHOP+ ?" : "Vous avez déjà un compte ?"}{" "}
          <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className="text-red-400 font-bold hover:text-red-300 transition-colors">
            {mode === "login" ? "Créer un compte" : "Se connecter"}
          </button>
        </p>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
      `}} />
    </div>
  );
}
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { CustomCaptcha } from "@/components/CustomCaptcha";

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
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
    if (user) navigate({ to: "/" });
  }, [user, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin, data: { username } },
        });
        if (error) throw error;
        
        // Bonus de bienvenue de 50 + Coins
        if (data.user) {
          await supabase.from("profiles").update({ plus_coins: 50 }).eq("id", data.user.id);
        }

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

          <div className="flex justify-center py-2">
            {mounted && <CustomCaptcha onSuccess={() => setCaptchaToken("verified")} />}
          </div>

          <div className="pt-2">
            <button
              disabled={loading || !captchaToken}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-red-600 to-red-800 text-white font-bold tracking-wide disabled:opacity-50 hover:shadow-[0_0_30px_-5px_rgba(220,38,38,0.6)] hover:-translate-y-0.5 transition-all duration-300"
            >
              {loading ? "Chargement..." : mode === "login" ? "Accéder à mon compte" : "Créer mon compte"}
            </button>
          </div>
        </form>

        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="flex-shrink-0 mx-4 text-xs font-semibold uppercase tracking-wider text-white/30">OU</span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>

        <div className="space-y-3">
          <button
            onClick={async () => {
              setLoading(true);
              const { error } = await supabase.auth.signInWithOAuth({ provider: "discord", options: { redirectTo: window.location.origin } });
              if (error) { toast.error(error.message); setLoading(false); }
            }}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl bg-[#5865F2]/10 hover:bg-[#5865F2]/20 border border-[#5865F2]/30 text-[#5865F2] font-semibold transition-all disabled:opacity-50"
          >
            <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
            </svg>
            Continuer avec Discord
          </button>
          
          <button
            onClick={async () => {
              setLoading(true);
              const { error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.origin } });
              if (error) { toast.error(error.message); setLoading(false); }
            }}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl bg-white text-black hover:bg-gray-100 font-semibold transition-all disabled:opacity-50"
          >
            <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continuer avec Google
          </button>
        </div>

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
import { useState, useEffect } from "react";
import { CheckCircle2, ShieldAlert } from "lucide-react";

const ICONS = [
  { name: "Netflix", id: "netflix" },
  { name: "Spotify", id: "spotify" },
  { name: "Discord", id: "discord" },
  { name: "YouTube", id: "youtube" },
  { name: "Xbox", id: "xbox" },
  { name: "PlayStation", id: "playstation" },
  { name: "Steam", id: "steam" },
  { name: "Crunchyroll", id: "crunchyroll" },
  { name: "Epic Games", id: "epicgames" },
  { name: "Twitch", id: "twitch" },
];

export function CustomCaptcha({ onSuccess }: { onSuccess: () => void }) {
  const [options, setOptions] = useState<typeof ICONS>([]);
  const [target, setTarget] = useState<typeof ICONS[0] | null>(null);
  const [status, setStatus] = useState<"idle" | "error" | "success">("idle");

  const generateTest = () => {
    const shuffled = [...ICONS].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 4);
    const targetIcon = selected[Math.floor(Math.random() * 4)];
    setOptions(selected);
    setTarget(targetIcon);
    setStatus("idle");
  };

  useEffect(() => {
    generateTest();
  }, []);

  const handleSelect = (icon: typeof ICONS[0]) => {
    if (status === "success") return;
    
    if (icon.id === target?.id) {
      setStatus("success");
      onSuccess();
    } else {
      setStatus("error");
      setTimeout(() => {
        generateTest();
      }, 800);
    }
  };

  if (!target) return null;

  return (
    <div className={`p-5 rounded-2xl border transition-all duration-300 w-full ${
      status === "success" ? "bg-green-500/10 border-green-500/50" : 
      status === "error" ? "bg-red-500/10 border-red-500/50" : 
      "bg-black/40 border-white/10"
    }`}>
      {status === "success" ? (
        <div className="flex flex-col items-center justify-center gap-2 text-green-500 py-2 animate-in zoom-in duration-300">
          <CheckCircle2 className="w-8 h-8" />
          <span className="font-bold text-lg">Vérification réussie !</span>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-white/90 text-sm font-medium justify-center">
            <ShieldAlert className="w-5 h-5 text-orange-500" />
            <span>Sécurité : Sélectionnez le logo <strong className="text-white bg-white/10 px-2 py-1 rounded-md text-base">{target.name}</strong></span>
          </div>
          
          <div className={`flex justify-center gap-3 transition-transform ${status === "error" ? "animate-[shake_0.4s_ease-in-out]" : ""}`}>
            {options.map((icon) => (
              <button
                type="button"
                key={icon.id}
                onClick={() => handleSelect(icon)}
                className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 hover:bg-white/20 hover:scale-110 hover:border-white/30 transition-all flex items-center justify-center shadow-lg"
              >
                <img 
                  src={`https://cdn.simpleicons.org/${icon.id}/white`} 
                  alt={icon.name}
                  className="w-7 h-7"
                />
              </button>
            ))}
          </div>
        </div>
      )}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          50% { transform: translateX(5px); }
          75% { transform: translateX(-5px); }
        }
      `}} />
    </div>
  );
}

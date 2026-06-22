import { useState, useEffect, useRef } from "react";
import { CheckCircle2, ShieldAlert } from "lucide-react";

// Pool of 24 logos for massive randomness
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
  { name: "Rockstar Games", id: "rockstargames" },
  { name: "Riot Games", id: "riotgames" },
  { name: "Ubisoft", id: "ubisoft" },
  { name: "EA", id: "ea" },
  { name: "Nintendo Switch", id: "nintendoswitch" },
  { name: "Apple", id: "apple" },
  { name: "Windows", id: "windows" },
  { name: "Prime Video", id: "primevideo" },
  { name: "Hulu", id: "hulu" },
  { name: "Disney+", id: "disneyplus" },
  { name: "Google", id: "google" },
  { name: "TikTok", id: "tiktok" },
  { name: "Roblox", id: "roblox" },
  { name: "Nvidia", id: "nvidia" },
];

export function CustomCaptcha({ onSuccess }: { onSuccess: () => void }) {
  const [testType, setTestType] = useState<"logos" | "math">("logos");
  
  // Logos State
  const [options, setOptions] = useState<typeof ICONS>([]);
  const [target, setTarget] = useState<typeof ICONS[0] | null>(null);
  
  // Math State
  const [mathQuestion, setMathQuestion] = useState("");
  const [mathAnswers, setMathAnswers] = useState<number[]>([]);
  const [correctMathAnswer, setCorrectMathAnswer] = useState(0);

  // General State
  const [status, setStatus] = useState<"idle" | "error" | "success">("idle");
  
  // Security metrics
  const [startTime, setStartTime] = useState<number>(0);
  const mouseMoves = useRef(0);

  useEffect(() => {
    const handleMouseMove = () => { mouseMoves.current += 1; };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const generateTest = () => {
    // Advanced Security Reset
    setStartTime(Date.now());
    mouseMoves.current = 0; // Require mouse movement for each new test
    setStatus("idle");

    const isMath = Math.random() > 0.5;
    
    if (isMath) {
      setTestType("math");
      const num1 = Math.floor(Math.random() * 10) + 1;
      const num2 = Math.floor(Math.random() * 10) + 1;
      const ops = ["+", "-", "x"];
      const op = ops[Math.floor(Math.random() * ops.length)];
      
      let answer = 0;
      if (op === "+") answer = num1 + num2;
      if (op === "-") {
        // Ensure positive result for simplicity
        const max = Math.max(num1, num2);
        const min = Math.min(num1, num2);
        answer = max - min;
        setMathQuestion(`${max} ${op} ${min}`);
      } else {
        answer = num1 * num2;
        setMathQuestion(`${num1} ${op} ${num2}`);
      }
      
      if (op !== "-") setMathQuestion(`${num1} ${op} ${num2}`);
      setCorrectMathAnswer(answer);

      // Generate 4 random options including the correct one
      let answersSet = new Set<number>();
      answersSet.add(answer);
      while(answersSet.size < 4) {
        let fake = answer + Math.floor(Math.random() * 10) - 5;
        if (fake < 0) fake = Math.floor(Math.random() * 20); // avoid negative fakes
        answersSet.add(fake);
      }
      setMathAnswers(Array.from(answersSet).sort(() => 0.5 - Math.random()));

    } else {
      setTestType("logos");
      const shuffled = [...ICONS].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 4);
      const targetIcon = selected[Math.floor(Math.random() * 4)];
      setOptions(selected);
      setTarget(targetIcon);
    }
  };

  useEffect(() => {
    generateTest();
  }, []);

  const validate = (isValid: boolean) => {
    if (status === "success") return;
    
    const timeTaken = Date.now() - startTime;
    
    // ANTI-BOT SECURITY CHECK:
    // 1. Time must be realistic (> 500ms)
    // 2. Mouse must have moved (bots usually just trigger onClick without mousemove events)
    const isBot = timeTaken < 500 || mouseMoves.current === 0;

    if (isValid && !isBot) {
      setStatus("success");
      onSuccess();
    } else {
      setStatus("error");
      setTimeout(() => {
        generateTest();
      }, 800);
    }
  };

  if (testType === "logos" && !target) return null;

  return (
    <div className={`p-5 rounded-2xl border transition-all duration-300 w-full select-none ${
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
          <div className="flex items-center gap-2 text-white/90 text-sm font-medium justify-center flex-wrap text-center">
            <ShieldAlert className="w-5 h-5 text-orange-500 shrink-0" />
            <span>
              Sécurité Anti-Robot : {" "}
              {testType === "logos" ? (
                <>Sélectionnez <strong className="text-white bg-white/10 px-2 py-1 rounded-md text-base ml-1">{target?.name}</strong></>
              ) : (
                <>Résolvez <strong className="text-white bg-white/10 px-2 py-1 rounded-md text-base tracking-widest ml-1">{mathQuestion} = ?</strong></>
              )}
            </span>
          </div>
          
          <div className={`flex justify-center gap-3 transition-transform ${status === "error" ? "animate-[shake_0.4s_ease-in-out]" : ""}`}>
            {testType === "logos" ? options.map((icon) => (
              <button
                type="button"
                key={icon.id}
                onClick={() => validate(icon.id === target?.id)}
                className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 hover:bg-white/20 hover:scale-110 hover:border-white/30 transition-all flex items-center justify-center shadow-lg group"
              >
                <img 
                  src={`https://cdn.simpleicons.org/${icon.id}/white`} 
                  alt="Option"
                  className="w-7 h-7 group-hover:scale-110 transition-transform"
                  draggable={false}
                />
              </button>
            )) : mathAnswers.map((ans, i) => (
              <button
                type="button"
                key={i}
                onClick={() => validate(ans === correctMathAnswer)}
                className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 hover:bg-white/20 hover:scale-110 hover:border-white/30 transition-all flex items-center justify-center shadow-lg font-bold text-xl text-white"
              >
                {ans}
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

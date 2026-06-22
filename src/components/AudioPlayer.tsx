import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

export function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("audio_playing") === "true";
    }
    return false;
  });
  
  const [sliderVolume, setSliderVolume] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("audio_volume");
      if (saved !== null) return parseFloat(saved);
    }
    return 0.3; // Curseur à 30% par défaut
  });
  
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      // Courbe exponentielle (puissance 3) : rend les bas volumes VRAIMENT très bas.
      // 0.3 sur le curseur donne un volume réel de 0.027 (très doux)
      audioRef.current.volume = Math.pow(sliderVolume, 3);
      localStorage.setItem("audio_volume", sliderVolume.toString());
    }
  }, [sliderVolume]);

  useEffect(() => {
    // Si l'utilisateur avait explicitement mis en pause, on ne force pas la lecture
    if (typeof window !== "undefined" && localStorage.getItem("audio_playing") === "false") {
      setIsPlaying(false);
      return;
    }

    const playAudio = async () => {
      if (!audioRef.current) return;
      try {
        await audioRef.current.play();
        setIsPlaying(true);
        localStorage.setItem("audio_playing", "true");
      } catch (err) {
        // Autoplay bloqué par le navigateur, on attend une interaction
        const onInteract = async () => {
          if (audioRef.current && localStorage.getItem("audio_playing") !== "false") {
            try {
              await audioRef.current.play();
              setIsPlaying(true);
              localStorage.setItem("audio_playing", "true");
            } catch (e) {
              console.error("Interaction play blocked", e);
            }
          }
          document.removeEventListener('click', onInteract);
          document.removeEventListener('keydown', onInteract);
        };
        document.addEventListener('click', onInteract);
        document.addEventListener('keydown', onInteract);
      }
    };
    
    // Petit délai pour laisser le DOM monter
    const timer = setTimeout(() => {
      playAudio();
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        localStorage.setItem("audio_playing", "false");
      } else {
        audioRef.current.play().catch(e => console.error("Play blocked:", e));
        localStorage.setItem("audio_playing", "true");
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-[100] bg-black/60 backdrop-blur-xl rounded-full px-4 py-2.5 flex items-center gap-3 border border-white/10 shadow-[0_0_20px_rgba(220,38,38,0.2)]">
      <button 
        onClick={togglePlay} 
        className="w-8 h-8 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center transition-colors shrink-0 shadow-lg shadow-red-600/30"
      >
        {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-1" />}
      </button>
      
      <div className="flex flex-col">
        <div className="text-[10px] font-bold text-red-500 uppercase tracking-wider mb-0.5">En cours</div>
        <div className="text-xs font-medium text-white/90 truncate w-32 md:w-40 scroll-text">
          SKIMA BENZ
        </div>
      </div>
      
      <div className="h-6 w-px bg-white/10 mx-1"></div>
      
      <div className="flex items-center gap-2">
        <button onClick={() => setSliderVolume(sliderVolume === 0 ? 0.3 : 0)} className="text-white/60 hover:text-white transition-colors">
          {sliderVolume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
        <input 
          type="range" 
          min="0" max="1" step="0.01" 
          value={sliderVolume} 
          onChange={(e) => setSliderVolume(parseFloat(e.target.value))}
          className="w-16 md:w-20 h-1.5 rounded-full bg-white/10 appearance-none cursor-pointer accent-red-600"
        />
      </div>
      
      {/* Fichier audio/vidéo (.mp4) à placer dans le dossier public */}
      <audio ref={audioRef} src="/music.mp4" loop />
    </div>
  );
}

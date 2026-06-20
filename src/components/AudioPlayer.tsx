import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

export function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.2); // Volume léger par défaut (20%)
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Autoplay blocked:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-[100] bg-black/60 backdrop-blur-xl rounded-full px-4 py-2.5 flex items-center gap-3 border border-white/10 shadow-[0_0_20px_rgba(220,38,38,0.2)]">
      <button 
        onClick={togglePlay} 
        className="w-8 h-8 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center transition-colors shrink-0 shadow-lg shadow-red-600/30"
      >
        {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-1" />}
      </button>
      
      <div className="flex flex-col">
        <div className="text-[10px] font-bold text-red-500 uppercase tracking-wider mb-0.5">En cours</div>
        <div className="text-xs font-medium text-white/90 truncate w-32 md:w-40 scroll-text">
          Barbie ft. RK - Le Crime
        </div>
      </div>
      
      <div className="h-6 w-px bg-white/10 mx-1"></div>
      
      <div className="flex items-center gap-2">
        <button onClick={() => setVolume(volume === 0 ? 0.2 : 0)} className="text-white/60 hover:text-white transition-colors">
          {volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
        <input 
          type="range" 
          min="0" max="1" step="0.01" 
          value={volume} 
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-16 md:w-20 h-1.5 rounded-full bg-white/10 appearance-none cursor-pointer accent-red-600"
        />
      </div>
      
      {/* Fichier audio à placer dans le dossier public */}
      <audio ref={audioRef} src="/music.mp3" loop />
    </div>
  );
}

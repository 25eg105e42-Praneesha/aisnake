import React, { useState, useRef, useEffect } from 'react';
import { TRACKS } from '../constants/tracks';
import { Play, Pause, SkipForward, SkipBack, Volume2, Disc } from 'lucide-react';
import { motion } from 'motion/react';

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback error:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
  };

  const skipBack = () => {
    setCurrentTrackIndex((prev) => (prev === 0 ? TRACKS.length - 1 : prev - 1));
    setProgress(0);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleTrackEnd = () => {
    skipForward();
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = (value / 100) * audioRef.current.duration;
      setProgress(value);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-800/60 shadow-[0_8px_30px_rgb(0,0,0,0.5)] p-6 relative overflow-hidden z-10 before:absolute before:inset-0 before:bg-gradient-to-br before:from-cyan-500/5 before:to-pink-500/5 before:pointer-events-none">
      
      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
      />

      <div className="flex items-center gap-5 relative z-10">
        {/* Album Art Cover */}
        <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 ring-1 ring-white/10 group">
          <img 
            src={currentTrack.cover} 
            alt={currentTrack.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
          
          {/* Rotating Disc Indicator */}
          {isPlaying && (
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
              className="absolute inset-0 flex items-center justify-center opacity-30 mix-blend-screen text-cyan-400"
            >
              <Disc size={48} strokeWidth={1} />
            </motion.div>
          )}
        </div>

        <div className="flex flex-col flex-grow min-w-0">
          {/* Now Playing text */}
          <div className="flex items-center gap-2 mb-1">
             <Volume2 size={12} className={isPlaying ? 'text-cyan-400 animate-pulse' : 'text-slate-600'} />
             <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">Now Playing</span>
          </div>
          
          {/* Track Info */}
          <h3 className="font-sans font-semibold text-slate-200 truncate text-sm">
            {currentTrack.title}
          </h3>
          <p className="font-sans text-xs text-slate-400 truncate mt-0.5">
            {currentTrack.artist}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-6 mb-4 relative group z-10">
        <input 
          type="range" 
          min="0" 
          max="100" 
          step="0.1"
          value={progress} 
          onChange={handleSeek}
          className="w-full h-1 bg-slate-800 rounded-full appearance-none outline-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-cyan-400 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(6,182,212,0.8)] opacity-70 hover:opacity-100 transition-opacity"
          style={{
            background: `linear-gradient(to right, #22d3ee ${progress}%, #1e293b ${progress}%)`
          }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6 relative z-10">
        <button 
          onClick={skipBack}
          className="text-slate-400 hover:text-white transition-colors hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] focus:outline-none"
        >
          <SkipBack size={24} className="fill-current/20" />
        </button>
        
        <button 
          onClick={togglePlay}
          className="w-14 h-14 rounded-full bg-slate-800/80 border border-slate-700/50 flex items-center justify-center text-white hover:border-cyan-500 hover:text-cyan-400 hover:bg-slate-800 transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] focus:outline-none"
        >
          {isPlaying ? (
            <Pause size={28} className="fill-current -ml-0.5" />
          ) : (
            <Play size={28} className="fill-current ml-1" />
          )}
        </button>

        <button 
          onClick={skipForward}
          className="text-slate-400 hover:text-white transition-colors hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] focus:outline-none"
        >
          <SkipForward size={24} className="fill-current/20" />
        </button>
      </div>

    </div>
  );
};

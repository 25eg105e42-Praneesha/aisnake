import React from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden font-sans selection:bg-cyan-500/30">
      
      {/* Background ambient light effects */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-pink-600/10 blur-[120px] pointer-events-none" />
      
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_20%,transparent_100%)] pointer-events-none" />

      <div className="container max-w-6xl mx-auto px-4 py-8 relative z-10 flex flex-col lg:flex-row items-center lg:items-start justify-center gap-12 lg:gap-24">
        
        {/* Left Column: Title and Music Player */}
        <div className="flex flex-col items-center lg:items-end w-full lg:w-1/3 gap-8 lg:pt-12">
          
          <div className="text-center lg:text-right">
             <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-500 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                NEON<br/><span className="text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">SYNTH</span><br/><span className="text-pink-500 drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]">SNAKE</span>
             </h1>
             <p className="mt-4 text-slate-400 font-mono text-xs uppercase tracking-widest leading-relaxed max-w-xs mx-auto lg:mx-0 lg:ml-auto">
               Vibe to AI generated tracks while navigating the terminal grid.
             </p>
          </div>

          <MusicPlayer />
          
        </div>

        {/* Right Column: Game */}
        <div className="w-full lg:w-auto flex justify-center lg:justify-start">
          <SnakeGame />
        </div>

      </div>

    </div>
  );
}

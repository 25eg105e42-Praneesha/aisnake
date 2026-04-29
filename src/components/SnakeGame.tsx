import React from 'react';
import { useSnake } from '../hooks/useSnake';
import { motion } from 'motion/react';
import { Play } from 'lucide-react';

export const SnakeGame: React.FC = () => {
  const { snake, food, isGameOver, score, highScore, startGame, isPaused, GRID_SIZE } = useSnake();

  return (
    <div className="flex flex-col items-center justify-center space-y-6 w-full max-w-md mx-auto relative z-10">
      
      {/* Score Header */}
      <div className="flex justify-between w-full px-4 items-end">
        <div className="flex flex-col">
          <span className="text-pink-500 font-mono text-sm tracking-widest uppercase">Score</span>
          <span className="text-3xl font-bold font-mono text-white tracking-widest drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]">
            {score.toString().padStart(4, '0')}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-cyan-500 font-mono text-sm tracking-widest uppercase">High Score</span>
          <span className="text-xl font-bold font-mono text-white tracking-widest drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">
            {highScore.toString().padStart(4, '0')}
          </span>
        </div>
      </div>

      {/* Game Board Container */}
      <div className="relative p-1 rounded-sm bg-slate-900 border border-slate-800 shadow-[0_0_30px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/20">
        
        {/* Game Grid */}
        <div 
          className="grid bg-[#0a0a10] w-[300px] h-[300px] sm:w-[400px] sm:h-[400px]"
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)` 
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const isSnake = snake.some(s => s.x === x && s.y === y);
            const isHead = snake[0].x === x && snake[0].y === y;
            const isFood = food.x === x && food.y === y;

            return (
              <div 
                key={i} 
                className={`w-full h-full ${
                  isHead ? 'bg-lime-400 shadow-[0_0_10px_rgba(163,230,53,0.8)] rounded-sm' :
                  isSnake ? 'bg-lime-500/80 shadow-[0_0_5px_rgba(132,204,22,0.5)] border border-lime-400/20' :
                  isFood ? 'bg-pink-500 shadow-[0_0_12px_rgba(236,72,153,0.9)] rounded-full animate-pulse' :
                  'border border-slate-800/30'
                }`}
              />
            );
          })}
        </div>

        {/* Overlays */}
        {isGameOver && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center border border-pink-500/30">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              className="flex flex-col items-center"
            >
              <h2 className="text-3xl font-mono text-pink-500 font-bold tracking-widest drop-shadow-[0_0_15px_rgba(236,72,153,1)] mb-6">
                TERMINAL
              </h2>
              <button 
                onClick={startGame}
                className="group relative px-6 py-2 bg-transparent text-cyan-400 font-mono tracking-widest uppercase overflow-hidden border border-cyan-500/50 hover:border-cyan-400 transition-colors"
              >
                <div className="absolute inset-0 bg-cyan-500/10 group-hover:bg-cyan-400/20 transition-colors" />
                <div className="relative flex items-center justify-center gap-2">
                  <Play size={16} />
                  <span>{score === 0 ? 'Initialize' : 'Reboot'}</span>
                </div>
              </button>
            </motion.div>
          </div>
        )}

        {!isGameOver && isPaused && (
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center">
             <h2 className="text-2xl font-mono text-cyan-500 animate-pulse tracking-widest drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">
                PAUSED
              </h2>
          </div>
        )}
      </div>

      <div className="text-slate-500 font-mono text-xs uppercase tracking-widest flex items-center gap-4">
        <span>WASD / Arrows to Move</span>
        <span className="w-1 h-1 rounded-full bg-slate-700"></span>
        <span>Space to Pause</span>
      </div>
    </div>
  );
};

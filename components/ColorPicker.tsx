
import React, { useState, useEffect } from 'react';
import { GameColor, COLOR_CONFIG } from '../types';

interface ColorPickerProps {
  onPick: (color: GameColor) => void;
  isSpinning: boolean;
  setIsSpinning: (val: boolean) => void;
  disabled: boolean;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ onPick, isSpinning, setIsSpinning, disabled }) => {
  const [displayColor, setDisplayColor] = useState<GameColor>(GameColor.BLUE);
  const colors = Object.values(GameColor);

  useEffect(() => {
    let interval: number;
    if (isSpinning) {
      let count = 0;
      const totalSteps = 15;
      interval = window.setInterval(() => {
        setDisplayColor(colors[count % colors.length]);
        count++;
        if (count >= totalSteps) {
          const finalColor = colors[Math.floor(Math.random() * colors.length)];
          setDisplayColor(finalColor);
          clearInterval(interval);
          setTimeout(() => {
            setIsSpinning(false);
            onPick(finalColor);
          }, 300);
        }
      }, 80);
    }
    return () => clearInterval(interval);
  }, [isSpinning, onPick, setIsSpinning]);

  const config = COLOR_CONFIG[displayColor];

  return (
    <div className="flex flex-col items-center gap-2 w-full max-w-sm">
      <button
        onClick={() => setIsSpinning(true)}
        disabled={disabled || isSpinning}
        className={`
          w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 
          disabled:cursor-not-allowed text-white font-black text-base rounded-xl 
          shadow-[0_4px_0_rgb(49,46,129)] active:shadow-none active:translate-y-1 
          transition-all uppercase tracking-tight shrink-0
        `}
      >
        {isSpinning ? 'Spinning...' : 'Spin for Question'}
      </button>

      <div className={`
        w-full h-20 md:h-24 rounded-xl border-2 border-slate-700/50 flex items-center justify-center
        transition-colors duration-200 shadow-md relative overflow-hidden shrink-0
        ${config.bg}
      `}>
        <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent"></div>
        {isSpinning ? (
          <div className="text-3xl animate-bounce">🎲</div>
        ) : (
          <div className={`text-center p-1 z-10 ${config.text}`}>
             <p className="text-[8px] font-black uppercase tracking-widest opacity-60">Challenge</p>
             <p className="text-sm md:text-xl font-black leading-tight drop-shadow-md px-2">
               {config.prompt}
             </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorPicker;


import React from 'react';
import { Cell, COLOR_CONFIG, GameColor } from '../types';

interface BingoBoardProps {
  board: Cell[][];
  onCellClick: (row: number, col: number) => void;
  canSelectAny: boolean;
  targetColor: GameColor | null;
  awaitingSelection: boolean;
}

const BingoBoard: React.FC<BingoBoardProps> = ({ 
  board, 
  onCellClick, 
  canSelectAny, 
  targetColor,
  awaitingSelection 
}) => {
  return (
    <div className="grid grid-cols-5 gap-1.5 sm:gap-3 md:gap-4 w-full max-w-4xl mx-auto p-2 sm:p-4 bg-slate-800/40 rounded-2xl border border-slate-700/50 shadow-2xl backdrop-blur-sm">
      {board.map((row, rIdx) => 
        row.map((cell, cIdx) => {
          const config = COLOR_CONFIG[cell.color];
          const isTarget = cell.color === targetColor;
          const isSelectable = awaitingSelection && !cell.isLit && (isTarget || canSelectAny);
          
          return (
            <button
              key={cell.id}
              disabled={!isSelectable}
              onClick={() => onCellClick(rIdx, cIdx)}
              className={`
                aspect-square rounded-lg md:rounded-xl flex items-center justify-center 
                transition-all duration-300 transform
                ${cell.isLit ? 'ring-2 md:ring-6 ring-white shadow-[0_0_15px_rgba(255,255,255,0.4)] z-10 scale-105' : 'hover:scale-105'}
                ${config.bg} 
                ${cell.isLit ? 'opacity-100' : 'opacity-70 grayscale-[30%]'}
                ${isSelectable ? 'animate-pulse ring-3 md:ring-6 ring-yellow-400 opacity-100 grayscale-0 z-20 scale-110' : ''}
                disabled:cursor-default
              `}
            >
              {cell.isLit ? (
                <div className="text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 sm:w-10 sm:h-10 md:w-16 md:h-16 drop-shadow-xl">
                    <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 0 1 1.04-.208Z" clipRule="evenodd" />
                  </svg>
                </div>
              ) : (
                <span className="opacity-10 text-white font-black text-xl md:text-3xl">?</span>
              )}
            </button>
          );
        })
      )}
    </div>
  );
};

export default BingoBoard;

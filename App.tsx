
import React, { useState, useEffect } from 'react';
import { GameState, GameColor, Cell } from './types';
import { generateValidBoard } from './utils/boardGenerator';
import BingoBoard from './components/BingoBoard';
import ColorPicker from './components/ColorPicker';

const STORAGE_KEY = 'music_bingo_quiz_state';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to load saved state", e);
      }
    }
    return {
      board: generateValidBoard(),
      currentColor: null,
      questionCount: 0,
      isGameOver: false,
      status: 'idle'
    };
  });

  const [canSelectAny, setCanSelectAny] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  }, [gameState]);

  const startNewGame = () => {
    // Removed confirm() as it is often blocked in iframe/sandbox environments
    setGameState({
      board: generateValidBoard(),
      currentColor: null,
      questionCount: 0,
      isGameOver: false,
      status: 'idle'
    });
    setCanSelectAny(false);
  };

  const handleColorPick = (color: GameColor) => {
    setGameState(prev => ({
      ...prev,
      currentColor: color,
      status: 'awaiting_answer',
      questionCount: prev.questionCount + 1
    }));
  };

  const checkWin = (board: Cell[][]): boolean => {
    for (let r = 0; r < 5; r++) if (board[r].every(c => c.isLit)) return true;
    for (let c = 0; c < 5; c++) if (board.every(row => row[c].isLit)) return true;
    if (board.every((row, i) => row[i].isLit)) return true;
    if (board.every((row, i) => row[4 - i].isLit)) return true;
    return false;
  };

  const handleAnswer = (correct: boolean) => {
    if (!correct) {
      setGameState(prev => ({ ...prev, status: 'idle', currentColor: null }));
      return;
    }
    const allOfColorLit = gameState.board.flat()
      .filter(c => c.color === gameState.currentColor)
      .every(c => c.isLit);

    setCanSelectAny(allOfColorLit);
    setGameState(prev => ({ ...prev, status: 'awaiting_selection' }));
  };

  const handleCellClick = (row: number, col: number) => {
    const newBoard = gameState.board.map((r, ri) => 
      r.map((c, ci) => (ri === row && ci === col ? { ...c, isLit: true } : c))
    );
    const isWin = checkWin(newBoard);
    setGameState(prev => ({
      ...prev,
      board: newBoard,
      status: 'idle',
      currentColor: null,
      isGameOver: isWin
    }));
    if (isWin) {
      // Fix: Access confetti from window object to resolve "Cannot find name 'confetti'" error
      const winConfetti = (window as any).confetti;
      if (typeof winConfetti === 'function') {
        winConfetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      }
    }
  };

  const isSpinning = gameState.status === 'spinning';
  const setIsSpinning = (val: boolean) => {
    setGameState(prev => ({ ...prev, status: val ? 'spinning' : prev.status }));
  };

  return (
    <div className="h-screen w-screen bg-slate-950 flex flex-col text-white overflow-hidden">
      {/* ultra-compact header */}
      <header className="px-4 py-2 flex justify-between items-center bg-slate-900/95 backdrop-blur-md z-50 border-b border-slate-800 shrink-0">
        <div>
          <h1 className="text-xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">
            MUSIC BINGO
          </h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Total Qs: <span className="text-white">{gameState.questionCount}</span>
          </p>
        </div>
        <button 
          onClick={startNewGame}
          className="px-3 py-1 bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-900/30 rounded-lg font-bold text-[10px] uppercase transition-colors"
        >
          Reset Game
        </button>
      </header>

      <main className="flex-grow flex flex-col items-center justify-between p-2 sm:p-4 max-w-5xl mx-auto w-full overflow-hidden">
        
        {/* Bingo Board Section - Allowed to shrink but prioritized */}
        <section className="w-full flex justify-center items-center flex-grow overflow-hidden px-2">
          <div className="w-full max-w-md md:max-w-xl">
            <BingoBoard 
              board={gameState.board} 
              onCellClick={handleCellClick}
              canSelectAny={canSelectAny}
              targetColor={gameState.currentColor}
              awaitingSelection={gameState.status === 'awaiting_selection'}
            />
          </div>
        </section>

        {/* Interaction Section - Fixed height at bottom to ensure it fits */}
        <section className="w-full shrink-0 flex flex-col items-center gap-2 bg-slate-900/60 p-3 rounded-t-3xl border-t border-x border-slate-800/50">
          
          <ColorPicker 
            onPick={handleColorPick} 
            isSpinning={isSpinning} 
            setIsSpinning={setIsSpinning}
            disabled={gameState.status !== 'idle' || gameState.isGameOver}
          />

          <div className="w-full max-w-sm h-16 flex items-center justify-center">
            {gameState.status === 'awaiting_answer' && (
              <div className="grid grid-cols-2 gap-3 w-full animate-in fade-in slide-in-from-bottom-2 duration-200">
                <button 
                  onClick={() => handleAnswer(false)}
                  className="py-3 bg-slate-800 border border-slate-700 rounded-xl font-black text-red-400 text-sm active:scale-95"
                >
                  WRONG
                </button>
                <button 
                  onClick={() => handleAnswer(true)}
                  className="py-3 bg-emerald-600 rounded-xl font-black text-white text-sm active:scale-95 shadow-lg"
                >
                  RIGHT!
                </button>
              </div>
            )}

            {gameState.status === 'awaiting_selection' && (
              <div className="bg-amber-400 w-full py-2 px-4 rounded-xl shadow-lg animate-pulse flex items-center justify-center">
                <p className="text-center text-xs font-black uppercase text-amber-950">
                  {canSelectAny ? '✨ PICK ANY SQUARE! ✨' : `👈 PICK A ${gameState.currentColor?.toUpperCase()} SQUARE`}
                </p>
              </div>
            )}

            {gameState.status === 'idle' && !gameState.isGameOver && (
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-center">
                Spin to start the round
              </p>
            )}
          </div>
        </section>
      </main>

      {/* Win Modal */}
      {gameState.isGameOver && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
          <div className="max-w-xs w-full bg-slate-900 border-4 border-indigo-500 rounded-[2rem] p-6 text-center shadow-2xl">
            <h2 className="text-5xl font-black mb-2 tracking-tighter text-indigo-400 animate-bounce">BINGO!</h2>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">
              WON IN {gameState.questionCount} Qs
            </p>
            <button 
              onClick={startNewGame}
              className="w-full py-3 bg-indigo-600 text-white font-black text-xl rounded-xl shadow-[0_4px_0_rgb(49,46,129)] active:translate-y-1 active:shadow-none transition-all uppercase"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

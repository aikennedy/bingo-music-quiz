
export enum GameColor {
  BLUE = 'blue',
  RED = 'red',
  GREEN = 'green',
  PURPLE = 'purple',
  YELLOW = 'yellow'
}

export interface Cell {
  id: string;
  color: GameColor;
  isLit: boolean;
}

export interface GameState {
  board: Cell[][];
  currentColor: GameColor | null;
  questionCount: number;
  isGameOver: boolean;
  status: 'idle' | 'spinning' | 'awaiting_answer' | 'awaiting_selection';
}

export const COLOR_CONFIG: Record<GameColor, { 
  bg: string, 
  text: string, 
  label: string, 
  prompt: string,
  hover: string
}> = {
  [GameColor.BLUE]: { 
    bg: 'bg-blue-600', 
    text: 'text-blue-100', 
    label: 'Blue', 
    prompt: 'Name the Artist',
    hover: 'hover:bg-blue-500'
  },
  [GameColor.RED]: { 
    bg: 'bg-red-600', 
    text: 'text-red-100', 
    label: 'Red', 
    prompt: 'Name the Song',
    hover: 'hover:bg-red-500'
  },
  [GameColor.GREEN]: { 
    bg: 'bg-emerald-600', 
    text: 'text-emerald-100', 
    label: 'Green', 
    prompt: 'Guess the Decade',
    hover: 'hover:bg-emerald-500'
  },
  [GameColor.PURPLE]: { 
    bg: 'bg-purple-600', 
    text: 'text-purple-100', 
    label: 'Purple', 
    prompt: 'Guess the Year (+/- 3 years)',
    hover: 'hover:bg-purple-500'
  },
  [GameColor.YELLOW]: { 
    bg: 'bg-amber-400', 
    text: 'text-amber-900', 
    label: 'Yellow', 
    prompt: 'Wild - Name Song, Artist, or Exact Year',
    hover: 'hover:bg-amber-300'
  },
};

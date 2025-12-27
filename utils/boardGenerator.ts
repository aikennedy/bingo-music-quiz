
import { GameColor, Cell } from '../types';

const COLORS = [GameColor.BLUE, GameColor.RED, GameColor.GREEN, GameColor.PURPLE, GameColor.YELLOW];

/**
 * Generates a 5x5 board based on the specific constraints:
 * - Each color appears 4-6 times.
 * - At least three colors appear exactly 5 times.
 * - Each row, column, and major diagonal has at most two of each color.
 */
export function generateValidBoard(): Cell[][] {
  let attempts = 0;
  const maxAttempts = 1000;

  while (attempts < maxAttempts) {
    attempts++;
    const distribution = getDistribution();
    const flatColors = [];
    for (let i = 0; i < COLORS.length; i++) {
      for (let j = 0; j < distribution[i]; j++) {
        flatColors.push(COLORS[i]);
      }
    }
    
    // Shuffle the flat array
    for (let i = flatColors.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [flatColors[i], flatColors[j]] = [flatColors[j], flatColors[i]];
    }

    const grid: GameColor[][] = [];
    for (let r = 0; r < 5; r++) {
      grid.push(flatColors.slice(r * 5, (r + 1) * 5));
    }

    if (isValid(grid)) {
      return grid.map((row, r) => 
        row.map((color, c) => ({
          id: `${r}-${c}`,
          color,
          isLit: false
        }))
      );
    }
  }

  // Fallback to a simple latin square-like pattern if randomization fails repeatedly
  // though with 5x5 and "at most 2" constraint, the above should find it instantly.
  return generateDeterministicBoard();
}

function getDistribution(): number[] {
  // We need 5 numbers that sum to 25.
  // At least three must be 5.
  // The other two must be (5,5), (4,6), or (6,4).
  const type = Math.floor(Math.random() * 3);
  let dist = [5, 5, 5, 5, 5];
  if (type === 1) dist = [5, 5, 5, 4, 6];
  if (type === 2) dist = [5, 5, 5, 6, 4];

  // Shuffle the distribution so different colors get the 4/6 variations
  for (let i = dist.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [dist[i], dist[j]] = [dist[j], dist[i]];
  }
  return dist;
}

function isValid(grid: GameColor[][]): boolean {
  // Check rows and columns
  for (let i = 0; i < 5; i++) {
    const rowCounts: Record<string, number> = {};
    const colCounts: Record<string, number> = {};
    for (let j = 0; j < 5; j++) {
      rowCounts[grid[i][j]] = (rowCounts[grid[i][j]] || 0) + 1;
      colCounts[grid[j][i]] = (colCounts[grid[j][i]] || 0) + 1;
    }
    if (Object.values(rowCounts).some(v => v > 2)) return false;
    if (Object.values(colCounts).some(v => v > 2)) return false;
  }

  // Check diagonals
  const diag1Counts: Record<string, number> = {};
  const diag2Counts: Record<string, number> = {};
  for (let i = 0; i < 5; i++) {
    diag1Counts[grid[i][i]] = (diag1Counts[grid[i][i]] || 0) + 1;
    diag2Counts[grid[i][4 - i]] = (diag2Counts[grid[i][4 - i]] || 0) + 1;
  }
  if (Object.values(diag1Counts).some(v => v > 2)) return false;
  if (Object.values(diag2Counts).some(v => v > 2)) return false;

  return true;
}

function generateDeterministicBoard(): Cell[][] {
  const base = [GameColor.BLUE, GameColor.RED, GameColor.GREEN, GameColor.PURPLE, GameColor.YELLOW];
  return Array(5).fill(0).map((_, r) => 
    Array(5).fill(0).map((_, c) => ({
      id: `${r}-${c}`,
      color: base[(r + c) % 5],
      isLit: false
    }))
  );
}

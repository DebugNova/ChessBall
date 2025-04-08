// Game constants and utility functions

// Game constants
export const GRID_SIZE = 10;
export const TEAM1 = "Barcelona";
export const TEAM2 = "Real Madrid";
export const TEAM1_COLOR = "#A50044"; // Barcelona colors
export const TEAM2_COLOR = "#FFFFFF"; // Real Madrid colors
export const TEAM1_SECONDARY = "#004D98";
export const TEAM2_SECONDARY = "#00529F";

// Define types for better type safety
export interface Player {
  team: string;
  type: string;
  position: [number, number];
  isGoalkeeper: boolean;
}

export interface GameState {
  grid: (Player | null)[][];
  ballPosition: [number, number];
}

export interface SelectedPlayer {
  row: number;
  col: number;
}

// Initial player positions to reset after goals
export const initialPositions = {
  team1: [
    {
      type: "goalkeeper",
      position: [0, 4] as [number, number],
      isGoalkeeper: true,
    },
    {
      type: "player",
      position: [2, 2] as [number, number],
      isGoalkeeper: false,
    },
    {
      type: "player",
      position: [2, 5] as [number, number],
      isGoalkeeper: false,
    },
    {
      type: "player",
      position: [3, 3] as [number, number],
      isGoalkeeper: false,
    },
    {
      type: "player",
      position: [3, 6] as [number, number],
      isGoalkeeper: false,
    },
    {
      type: "player",
      position: [4, 4] as [number, number],
      isGoalkeeper: false,
    },
  ],
  team2: [
    {
      type: "goalkeeper",
      position: [9, 4] as [number, number],
      isGoalkeeper: true,
    },
    {
      type: "player",
      position: [7, 2] as [number, number],
      isGoalkeeper: false,
    },
    {
      type: "player",
      position: [7, 5] as [number, number],
      isGoalkeeper: false,
    },
    {
      type: "player",
      position: [6, 3] as [number, number],
      isGoalkeeper: false,
    },
    {
      type: "player",
      position: [6, 6] as [number, number],
      isGoalkeeper: false,
    },
    {
      type: "player",
      position: [5, 4] as [number, number],
      isGoalkeeper: false,
    },
  ],
};

// Helper functions
export const isDefenseBox = (row: number, col: number) => {
  // Team 1 defense box: rows 1-2 (indexes 1-2, all columns)
  // Team 2 defense box: rows 8-9 (indexes 7-8, all columns)
  return (row >= 1 && row <= 2) || (row >= 7 && row <= 8);
};

export const isGoalArea = (row: number, col: number) => {
  // Team 1 goal area: row 1, columns 4-7 (indexed as row 0, columns 3-6)
  // Team 2 goal area: row 10, columns 4-7 (indexed as row 9, columns 3-6)
  return (
    (row === 0 && col >= 3 && col <= 6) || (row === 9 && col >= 3 && col <= 6)
  );
};

export const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

// Determine cell color based on position
export const getCellColor = (row: number, col: number) => {
  // All cells now use grass texture with our custom class
  return "grass-cell";
};

// Initialize the game state
export const initializeGame = (): GameState => {
  // Create empty grid
  const newGrid = Array(GRID_SIZE)
    .fill(null)
    .map(() => Array(GRID_SIZE).fill(null));

  // Set up Team 1 (Barcelona)
  initialPositions.team1.forEach((player) => {
    const [row, col] = player.position;
    newGrid[row][col] = {
      team: TEAM1,
      type: player.type,
      position: player.position,
      isGoalkeeper: player.isGoalkeeper,
    };
  });

  // Set up Team 2 (Real Madrid)
  initialPositions.team2.forEach((player) => {
    const [row, col] = player.position;
    newGrid[row][col] = {
      team: TEAM2,
      type: player.type,
      position: player.position,
      isGoalkeeper: player.isGoalkeeper,
    };
  });

  // Place the ball in the center at (5,5) (indexed as [4,4])
  const ballPosition: [number, number] = [4, 4];

  return { grid: newGrid, ballPosition };
};

// Game logic implementation for Chessball game

import { GameState, Player, TEAM1, TEAM2, isDefenseBox } from "./gameUtils";

// Calculate valid moves for a selected player
export const calculateValidMoves = (
  gameState: GameState,
  row: number,
  col: number,
  actionMode: string,
  skippedPlayer: number[] | null,
  currentTeam: string
): number[][] => {
  const player = gameState.grid[row][col];
  if (!player) return [];

  // Skip player's turn if they were tackled in the previous turn
  if (
    skippedPlayer &&
    skippedPlayer[0] === row &&
    skippedPlayer[1] === col &&
    player.team === (currentTeam === TEAM1 ? TEAM2 : TEAM1) // Only skip if it's opponent's turn
  ) {
    return [];
  }

  if (actionMode === "move") {
    // Calculate valid movement squares (1 square in any direction)
    return calculateMoveSquares(gameState, row, col, player);
  } else if (actionMode === "throw" && hasBall(gameState, row, col)) {
    // Calculate valid throw squares (2 squares in any direction)
    return calculateThrowSquares(gameState, row, col, player);
  }

  return [];
};

// Helper to check if a player has the ball
export const hasBall = (
  gameState: GameState,
  row: number,
  col: number
): boolean => {
  return gameState.ballPosition[0] === row && gameState.ballPosition[1] === col;
};

// Calculate valid movement squares
const calculateMoveSquares = (
  gameState: GameState,
  row: number,
  col: number,
  player: Player
): number[][] => {
  const GRID_SIZE = 10;
  const moves: number[][] = [];

  for (
    let r = Math.max(0, row - 1);
    r <= Math.min(GRID_SIZE - 1, row + 1);
    r++
  ) {
    for (
      let c = Math.max(0, col - 1);
      c <= Math.min(GRID_SIZE - 1, col + 1);
      c++
    ) {
      // Skip the current position
      if (r === row && c === col) continue;

      // Skip occupied squares
      if (gameState.grid[r][c]) continue;

      // Check if this is a goalkeeper trying to leave goal area
      if (player.isGoalkeeper) {
        // Team 1 goal area is row 0, columns 3-6 (index as row 0, cols 3-6)
        const isTeam1GoalArea = r === 0 && c >= 3 && c <= 6;
        // Team 2 goal area is row 9, columns 3-6 (indexed as row 9, cols 3-6)
        const isTeam2GoalArea = r === 9 && c >= 3 && c <= 6;

        // Goalkeeper must stay in goal area
        if (player.team === TEAM1 && !isTeam1GoalArea) {
          continue;
        }

        if (player.team === TEAM2 && !isTeam2GoalArea) {
          continue;
        }
      }

      // Check defense box restrictions (max 2 players from defending team in their own defense box)
      if (isDefenseBox(r, c)) {
        const defenseTeam = r <= 2 ? TEAM1 : r >= 7 ? TEAM2 : null;

        // If player is from defending team, check count
        if (player.team === defenseTeam) {
          // Count current defenders
          let defenderCount = 0;
          for (
            let dr = defenseTeam === TEAM1 ? 1 : 7;
            dr <= (defenseTeam === TEAM1 ? 2 : 8);
            dr++
          ) {
            for (let dc = 0; dc < GRID_SIZE; dc++) {
              if (
                gameState.grid[dr][dc] &&
                gameState.grid[dr][dc]?.team === defenseTeam &&
                // Don't count the player we're moving
                !(dr === row && dc === col)
              ) {
                defenderCount++;
              }
            }
          }

          // Skip if already 2 defenders (excluding current player)
          if (defenderCount >= 2) continue;
        }
      }

      moves.push([r, c]);
    }
  }

  // Add tackle moves if player is adjacent to opponent with ball
  const [ballRow, ballCol] = gameState.ballPosition;
  const ballOwner = gameState.grid[ballRow][ballCol];

  if (ballOwner && ballOwner.team !== player.team) {
    // Check if we can tackle diagonally
    const rowDiff = ballRow - row;
    const colDiff = ballCol - col;

    // Diagonal tackle (like chess pawn capture)
    if (Math.abs(rowDiff) === 1 && Math.abs(colDiff) === 1) {
      moves.push([ballRow, ballCol]);
    }
  }

  return moves;
};

// Calculate valid throw squares
const calculateThrowSquares = (
  gameState: GameState,
  row: number,
  col: number,
  player: Player
): number[][] => {
  const GRID_SIZE = 10;
  const moves: number[][] = [];

  for (
    let r = Math.max(0, row - 2);
    r <= Math.min(GRID_SIZE - 1, row + 2);
    r++
  ) {
    for (
      let c = Math.max(0, col - 2);
      c <= Math.min(GRID_SIZE - 1, col + 2);
      c++
    ) {
      // Skip positions that aren't exactly 2 squares away (Manhattan or diagonal)
      const rowDiff = Math.abs(r - row);
      const colDiff = Math.abs(c - col);

      // Only allow throws that are exactly 2 squares away (including diagonals)
      if (
        // Horizontal, vertical, or diagonal 2 square moves
        (rowDiff === 2 && colDiff === 0) || // Vertical 2 squares
        (rowDiff === 0 && colDiff === 2) || // Horizontal 2 squares
        (rowDiff === 2 && colDiff === 2) || // Diagonal 2 squares
        (rowDiff === 2 && colDiff === 1) || // Knight-like moves
        (rowDiff === 1 && colDiff === 2) // Knight-like moves
      ) {
        // Check if target is empty or has a teammate
        const targetCell = gameState.grid[r][c];
        if (!targetCell || targetCell.team === player.team) {
          moves.push([r, c]);
        }
      }
    }
  }

  return moves;
};

// Check for goal and return updated scores
export const checkForGoal = (
  row: number,
  col: number,
  currentTeam: string,
  team1Score: number,
  team2Score: number,
  gameState: GameState
): {
  team1NewScore: number;
  team2NewScore: number;
  goalScored: boolean;
  isBlocked: boolean;
} => {
  let team1NewScore = team1Score;
  let team2NewScore = team2Score;
  let goalScored = false;
  let isBlocked = false;

  // Check for goalkeeper block (50% chance)
  if (
    (row === 0 && col >= 3 && col <= 6 && currentTeam === TEAM2) ||
    (row === 9 && col >= 3 && col <= 6 && currentTeam === TEAM1)
  ) {
    // Check if a goalkeeper is in the target square
    const targetCell = gameState.grid[row][col];
    if (targetCell && targetCell.isGoalkeeper) {
      // 50% chance to block
      isBlocked = Math.random() < 0.5;
    }
  }

  // Team 1 scores if ball reaches Team 2's goal area and not blocked
  if (
    row === 9 &&
    col >= 3 &&
    col <= 6 &&
    currentTeam === TEAM1 &&
    !isBlocked
  ) {
    team1NewScore++;
    goalScored = true;
  }
  // Team 2 scores if ball reaches Team 1's goal area and not blocked
  else if (
    row === 0 &&
    col >= 3 &&
    col <= 6 &&
    currentTeam === TEAM2 &&
    !isBlocked
  ) {
    team2NewScore++;
    goalScored = true;
  }

  return {
    team1NewScore,
    team2NewScore,
    goalScored,
    isBlocked,
  };
};

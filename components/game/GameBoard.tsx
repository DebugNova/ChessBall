"use client";

import {
  GameState,
  SelectedPlayer,
  getCellColor,
  isGoalArea,
  isDefenseBox,
} from "@/app/utils/gameUtils";
import { CSSProperties } from "react";

interface GameBoardProps {
  gameState: GameState;
  selectedPlayer: SelectedPlayer | null;
  validMoves: number[][];
  skippedPlayer: number[] | null;
  handleCellClick: (row: number, col: number) => void;
}

export default function GameBoard({
  gameState,
  selectedPlayer,
  validMoves,
  skippedPlayer,
  handleCellClick,
}: GameBoardProps) {
  const hasBall = (row: number, col: number) => {
    return (
      gameState.ballPosition[0] === row && gameState.ballPosition[1] === col
    );
  };

  const isValidMove = (row: number, col: number) => {
    return validMoves.some(([r, c]) => r === row && c === col);
  };

  // Function to get varied grass pattern for different cells
  const getGrassStyle = (row: number, col: number): CSSProperties => {
    // Create different patterns based on position
    const isEvenRow = row % 2 === 0;
    const isEvenCol = col % 2 === 0;
    const isGoal = isGoalArea(row, col);
    const isDefense = isDefenseBox(row, col);

    // Base style for all cells
    const baseStyle: CSSProperties = {
      width: "60px",
      height: "60px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      cursor: "pointer",
      overflow: "hidden",
      border: "1px solid black",
      backgroundSize: "30px 30px",
    };

    // Special style for goal areas
    if (isGoal) {
      return {
        ...baseStyle,
        background:
          "linear-gradient(0deg, #689f38 10%, #8bc34a 10%, #8bc34a 20%, #689f38 20%, #689f38 30%, #8bc34a 30%)",
        boxShadow: "inset 0 0 8px rgba(0, 0, 0, 0.3)",
        borderWidth: "2px",
        borderStyle: "dashed",
      };
    }

    // Special style for defense boxes
    if (isDefense) {
      // Top defense box (Barcelona)
      if (row >= 1 && row <= 2) {
        return {
          ...baseStyle,
          background: `linear-gradient(90deg, 
            #80c342 10%, #8bc34a 10%, #8bc34a 20%, 
            #80c342 20%, #80c342 30%, #8bc34a 30%, 
            #8bc34a 40%, #80c342 40%, #80c342 50%, 
            #8bc34a 50%, #8bc34a 60%, #80c342 60%)`,
          boxShadow: "inset 0 0 6px rgba(0, 0, 0, 0.25)",
          borderColor: "#444",
        };
      }
      // Bottom defense box (Real Madrid)
      else {
        return {
          ...baseStyle,
          background: `linear-gradient(270deg, 
            #80c342 10%, #8bc34a 10%, #8bc34a 20%, 
            #80c342 20%, #80c342 30%, #8bc34a 30%, 
            #8bc34a 40%, #80c342 40%, #80c342 50%, 
            #8bc34a 50%, #8bc34a 60%, #80c342 60%)`,
          boxShadow: "inset 0 0 6px rgba(0, 0, 0, 0.25)",
          borderColor: "#444",
        };
      }
    }

    // Apply different patterns based on position
    if (isEvenRow && isEvenCol) {
      return {
        ...baseStyle,
        background:
          "linear-gradient(45deg, #80c342 25%, #8bc34a 25%, #8bc34a 50%, #80c342 50%, #80c342 75%, #8bc34a 75%, #8bc34a 100%)",
        boxShadow: "inset 0 0 5px rgba(0, 0, 0, 0.2)",
      };
    } else if (isEvenRow && !isEvenCol) {
      return {
        ...baseStyle,
        background:
          "linear-gradient(-45deg, #7cb342 30%, #8bc34a 30%, #8bc34a 60%, #7cb342 60%, #7cb342 90%, #8bc34a 90%)",
        boxShadow: "inset 0 0 4px rgba(0, 0, 0, 0.15)",
      };
    } else if (!isEvenRow && isEvenCol) {
      return {
        ...baseStyle,
        background:
          "linear-gradient(135deg, #7cb342 20%, #8bc34a 20%, #8bc34a 40%, #7cb342 40%, #7cb342 60%, #8bc34a 60%)",
        boxShadow: "inset 0 0 6px rgba(0, 0, 0, 0.25)",
      };
    } else {
      return {
        ...baseStyle,
        background:
          "linear-gradient(180deg, #80c342 15%, #8bc34a 15%, #8bc34a 30%, #80c342 30%, #80c342 45%, #8bc34a 45%)",
        boxShadow: "inset 0 0 4px rgba(0, 0, 0, 0.2)",
      };
    }
  };

  return (
    <div className="grid grid-cols-10 gap-0 p-0.5 bg-black overflow-hidden rounded">
      {Array(10)
        .fill(null)
        .map((_, row) =>
          Array(10)
            .fill(null)
            .map((_, col) => {
              const cell = gameState.grid[row][col];
              const hasBallHere = hasBall(row, col);
              const isSelected =
                selectedPlayer &&
                selectedPlayer.row === row &&
                selectedPlayer.col === col;
              const isValidMoveSquare = isValidMove(row, col);

              return (
                <div
                  key={`${row}-${col}`}
                  style={getGrassStyle(row, col)}
                  className={`
                    ${isSelected ? "ring-2 ring-yellow-400" : ""}
                    ${isValidMoveSquare ? "relative" : ""}
                  `}
                  onClick={() => handleCellClick(row, col)}
                >
                  {isValidMoveSquare && (
                    <div className="absolute inset-0 bg-yellow-400 bg-opacity-25 z-5 pointer-events-none"></div>
                  )}
                  {cell && (
                    <div
                      className={`rounded-full w-12 h-12 flex items-center justify-center text-white text-sm font-bold z-10`}
                      style={{
                        backgroundColor:
                          cell.team === "Barcelona"
                            ? cell.isGoalkeeper
                              ? "transparent"
                              : "transparent"
                            : cell.isGoalkeeper
                            ? "#FFEB3B"
                            : "#FFFFFF",
                        color:
                          cell.team === "Barcelona"
                            ? "white"
                            : cell.isGoalkeeper
                            ? "black"
                            : "black",
                        background:
                          cell.team === "Barcelona"
                            ? cell.isGoalkeeper
                              ? "linear-gradient(90deg, #2E7D32 25%, #1B5E20 25%, #1B5E20 50%, #2E7D32 50%, #2E7D32 75%, #1B5E20 75%, #1B5E20 100%)"
                              : "linear-gradient(90deg, #A50044 25%, #004D98 25%, #004D98 50%, #A50044 50%, #A50044 75%, #004D98 75%, #004D98 100%)"
                            : cell.isGoalkeeper
                            ? "#FFEB3B"
                            : "#FFFFFF",
                        backgroundSize:
                          cell.team === "Barcelona" ? "8px 100%" : "auto",
                        border: "1px solid black",
                      }}
                    >
                      {cell.isGoalkeeper ? "GK" : "P"}
                    </div>
                  )}
                  {hasBallHere && (
                    <div className="absolute top-0 right-0 w-4 h-4 bg-yellow-400 rounded-full border border-black z-10"></div>
                  )}
                  {skippedPlayer &&
                    skippedPlayer[0] === row &&
                    skippedPlayer[1] === col && (
                      <div className="absolute bottom-0 right-0 w-4 h-4 bg-red-500 rounded-full z-10"></div>
                    )}
                </div>
              );
            })
        )}
    </div>
  );
}

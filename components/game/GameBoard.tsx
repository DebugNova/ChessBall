"use client";

import {
  GameState,
  SelectedPlayer,
  getCellColor,
  isGoalArea,
  isDefenseBox,
} from "@/app/utils/gameUtils";
import { CSSProperties } from "react";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
import React from "react";

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
  const ballControls = useAnimationControls();
  const prevBallPos = React.useRef(gameState.ballPosition);
  const [ballOffset, setBallOffset] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    const [prevRow, prevCol] = prevBallPos.current;
    const [newRow, newCol] = gameState.ballPosition;

    // Only animate if the ball position has changed
    if (prevRow !== newRow || prevCol !== newCol) {
      // Calculate the distance and direction
      const deltaX = (newCol - prevCol) * 55; // multiply by cell width
      const deltaY = (newRow - prevRow) * 55; // multiply by cell height
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // Animate the ball
      const sequence = async () => {
        // Reset position
        await ballControls.start({
          x: 0,
          y: 0,
          scale: 1,
          transition: { duration: 0 },
        });

        // Animate to new position with arc
        await ballControls.start({
          x: deltaX,
          y: [0, -40, deltaY], // Add vertical arc movement
          scale: [1, 1.2, 1],
          transition: {
            duration: Math.min(1.8 + distance * 0.004, 3), // Much slower animation
            times: [0, 0.5, 1], // Control timing of the arc
            type: "keyframes",
            ease: "easeInOut", // Smoother easing
          },
        });
      };

      sequence();

      // Update the previous position after animation
      prevBallPos.current = gameState.ballPosition;
    }
  }, [gameState.ballPosition, ballControls]);

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
      width: "55px",
      height: "55px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      cursor: "pointer",
      overflow: "hidden",
      border: "1px solid black",
      backgroundSize: "27.5px 27.5px",
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
                  <AnimatePresence>
                    {isValidMoveSquare && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-yellow-400 bg-opacity-25 z-5 pointer-events-none"
                      />
                    )}
                    {cell && (
                      <motion.div
                        className={`rounded-full w-12 h-12 flex items-center justify-center text-white text-sm font-bold z-10`}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        }}
                        layout
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
                      </motion.div>
                    )}
                    {hasBallHere && (
                      <motion.div
                        className="absolute w-5 h-5 rounded-full z-20 shadow-md"
                        animate={ballControls}
                        initial={false}
                        style={{
                          position: "absolute",
                          top: "0px",
                          right: "0px",
                          background: `radial-gradient(circle at 30% 30%, white 0%, white 50%, #333 51%, #333 60%, white 61%, white 100%)`,
                          border: "1px solid #666",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                        }}
                      />
                    )}
                    {skippedPlayer &&
                      skippedPlayer[0] === row &&
                      skippedPlayer[1] === col && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="absolute bottom-0 right-0 w-4 h-4 bg-red-500 rounded-full z-10"
                        />
                      )}
                  </AnimatePresence>
                </div>
              );
            })
        )}
    </div>
  );
}

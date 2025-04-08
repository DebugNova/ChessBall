"use client";

import {
  GameState,
  SelectedPlayer,
  getCellColor,
  isGoalArea,
  isDefenseBox,
} from "@/app/utils/gameUtils";
import { CSSProperties, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [prevBallPos, setPrevBallPos] = useState(gameState.ballPosition);
  const [isThrowingBall, setIsThrowingBall] = useState(false);

  useEffect(() => {
    if (
      prevBallPos[0] !== gameState.ballPosition[0] ||
      prevBallPos[1] !== gameState.ballPosition[1]
    ) {
      setIsThrowingBall(true);
      const timer = setTimeout(() => {
        setIsThrowingBall(false);
        setPrevBallPos(gameState.ballPosition);
      }, 350); // Match the animation duration
      return () => clearTimeout(timer);
    }
  }, [gameState.ballPosition, prevBallPos]);

  const getBallPosition = (row: number, col: number) => {
    const cellSize = 55; // This should match your cell size
    return {
      x: col * cellSize,
      y: row * cellSize,
    };
  };

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
    <div className="grid grid-cols-10 gap-0 p-0.5 bg-black overflow-hidden rounded relative">
      {/* Add the flying ball animation */}
      <AnimatePresence>
        {isThrowingBall && (
          <motion.div
            className="absolute w-5 h-5 rounded-full z-20 shadow-md"
            initial={{
              ...getBallPosition(prevBallPos[0], prevBallPos[1]),
              scale: 1,
            }}
            animate={{
              ...getBallPosition(
                gameState.ballPosition[0],
                gameState.ballPosition[1]
              ),
              scale: 1,
              transition: {
                duration: 0.35, // Faster duration
                ease: [0.25, 0.5, 0.35, 1], // Smoother easing curve
                y: {
                  type: "spring",
                  stiffness: 150,
                  damping: 12,
                  velocity: -200,
                },
              },
            }}
            style={{
              background: `radial-gradient(circle at 30% 30%, white 0%, white 50%, #333 51%, #333 60%, white 61%, white 100%)`,
              border: "1px solid #666",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            }}
          />
        )}
      </AnimatePresence>

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
                    {hasBallHere && !isThrowingBall && (
                      <motion.div
                        className="absolute top-0 right-0 w-5 h-5 rounded-full z-10 shadow-md"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 25,
                        }}
                        layout
                        style={{
                          background: `radial-gradient(circle at 30% 30%, white 0%, white 50%, #333 51%, #333 60%, white 61%, white 100%)`,
                          border: "1px solid #666",
                          transform: "translate(-2px, 2px)",
                          boxShadow: "0 1px 2px rgba(0,0,0,0.3)",
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

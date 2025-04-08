"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import GameSettings from "@/components/game/GameSettings";
import GameInfo from "@/components/game/GameInfo";
import GameBoard from "@/components/game/GameBoard";
import ActionControls from "@/components/game/ActionControls";
import GameOverScreen from "@/components/game/GameOverScreen";
import Instructions from "@/components/game/Instructions";
import {
  TEAM1,
  TEAM2,
  TEAM1_COLOR,
  TEAM2_COLOR,
  TEAM1_SECONDARY,
  TEAM2_SECONDARY,
  initializeGame,
  GameState,
  SelectedPlayer,
  Player,
} from "@/app/utils/gameUtils";
import {
  calculateValidMoves,
  hasBall,
  checkForGoal,
} from "@/app/utils/gameLogic";

export default function ChessballGame() {
  // Game state
  const [gameStarted, setGameStarted] = useState(false);
  const [gameDuration, setGameDuration] = useState(5); // minutes
  const [goalTarget, setGoalTarget] = useState(3);
  const [currentTeam, setCurrentTeam] = useState(TEAM1);
  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);
  const [selectedPlayer, setSelectedPlayer] = useState<SelectedPlayer | null>(
    null
  );
  const [timeRemaining, setTimeRemaining] = useState(5 * 60); // seconds
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [actionMode, setActionMode] = useState("move"); // 'move' or 'throw'
  const [validMoves, setValidMoves] = useState<number[][]>([]);
  const [skippedPlayer, setSkippedPlayer] = useState<number[] | null>(null);
  const [gameState, setGameState] = useState<GameState>(() => initializeGame());

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (gameStarted && !gameOver && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [gameStarted, gameOver, timeRemaining]);

  // Check for win conditions
  useEffect(() => {
    if (team1Score >= goalTarget) {
      setWinner(TEAM1);
      setGameOver(true);
    } else if (team2Score >= goalTarget) {
      setWinner(TEAM2);
      setGameOver(true);
    }
  }, [team1Score, team2Score, goalTarget]);

  // Calculate valid moves when a player is selected
  useEffect(() => {
    if (selectedPlayer) {
      const { row, col } = selectedPlayer;
      const moves = calculateValidMoves(
        gameState,
        row,
        col,
        actionMode,
        skippedPlayer,
        currentTeam
      );
      setValidMoves(moves);
    } else {
      setValidMoves([]);
    }
  }, [selectedPlayer, gameState, actionMode, skippedPlayer, currentTeam]);

  const startGame = () => {
    setGameState(initializeGame());
    setGameStarted(true);
    setGameOver(false);
    setTeam1Score(0);
    setTeam2Score(0);
    setCurrentTeam(TEAM1);
    setTimeRemaining(gameDuration * 60);
    setWinner(null);
    setActionMode("move");
    setSkippedPlayer(null);
  };

  const endGame = () => {
    setGameOver(true);
    if (team1Score > team2Score) {
      setWinner(TEAM1);
    } else if (team2Score > team1Score) {
      setWinner(TEAM2);
    } else {
      setWinner("Draw");
    }
  };

  const resetPositionsAfterGoal = () => {
    const newGameState = initializeGame();
    setGameState(newGameState);
    setSkippedPlayer(null);
  };

  const handleCellClick = (row: number, col: number) => {
    if (!gameStarted || gameOver) return;

    const cell = gameState.grid[row][col];

    // If no player is selected and the cell contains a player of the current team
    if (!selectedPlayer && cell && cell.team === currentTeam) {
      // Skip player's turn if they were tackled in the previous turn
      if (
        skippedPlayer &&
        skippedPlayer[0] === row &&
        skippedPlayer[1] === col
      ) {
        alert("This player was tackled and must skip a turn!");
        return;
      }

      setSelectedPlayer({ row, col });
      return;
    }

    // If a player is selected, try to move to the clicked cell
    if (selectedPlayer) {
      // Check if the move is valid based on calculated valid moves
      const isValidMove = validMoves.some(([r, c]) => r === row && c === col);
      if (!isValidMove) {
        return;
      }

      const srcRow = selectedPlayer.row;
      const srcCol = selectedPlayer.col;
      const player = gameState.grid[srcRow][srcCol];

      if (!player) return;

      if (actionMode === "move") {
        // Create a new grid with the player moved
        const newGrid = [...gameState.grid.map((row) => [...row])];

        // Check if this is a tackle move
        const isTackle = cell && cell.team !== currentTeam;

        // Remove player from original position
        newGrid[srcRow][srcCol] = null;

        // Normal move - just place our player
        newGrid[row][col] = {
          ...player,
          position: [row, col] as [number, number],
        };

        // Update ball position if the player had the ball or if this is a tackle
        let newBallPosition = [...gameState.ballPosition] as [number, number];
        if (hasBall(gameState, srcRow, srcCol)) {
          newBallPosition = [row, col] as [number, number];
        } else if (isTackle && hasBall(gameState, row, col)) {
          // In a tackle, if opponent had the ball, we take it
          newBallPosition = [row, col] as [number, number];

          // Mark the tackled player so they skip their next turn
          setSkippedPlayer([row, col]);
        }

        // Check for goal
        const { team1NewScore, team2NewScore, goalScored } = checkForGoal(
          row,
          col,
          currentTeam,
          team1Score,
          team2Score,
          gameState
        );

        // Update game state
        setGameState({
          grid: newGrid,
          ballPosition: newBallPosition,
        });

        // Update scores if needed
        setTeam1Score(team1NewScore);
        setTeam2Score(team2NewScore);

        // Reset positions after goal
        if (goalScored) {
          setTimeout(() => {
            resetPositionsAfterGoal();
          }, 1000);
        }

        // If this was a tackle, give player an extra move
        if (isTackle && hasBall(gameState, row, col)) {
          // Set the tackling player as selected for the next move
          setSelectedPlayer({ row, col });
          setActionMode("move");
          return; // Don't switch teams yet, player gets another turn
        }

        // Switch teams
        setCurrentTeam(currentTeam === TEAM1 ? TEAM2 : TEAM1);

        // Check if the skipped player belongs to the team that just finished their turn
        // If so, clear the skipped status as they've now served their penalty
        if (
          skippedPlayer &&
          gameState.grid[skippedPlayer[0]][skippedPlayer[1]] &&
          gameState.grid[skippedPlayer[0]][skippedPlayer[1]]?.team ===
            currentTeam
        ) {
          setSkippedPlayer(null);
        }

        // Reset selected player and action mode
        setSelectedPlayer(null);
        setActionMode("move");
      } else if (actionMode === "throw" && hasBall(gameState, srcRow, srcCol)) {
        // Create a new grid (no player movement for throw)
        const newGrid = [...gameState.grid.map((row) => [...row])];

        // Move the ball to the target square
        const newBallPosition: [number, number] = [row, col];

        // Check for goal
        const { team1NewScore, team2NewScore, goalScored } = checkForGoal(
          row,
          col,
          currentTeam,
          team1Score,
          team2Score,
          gameState
        );

        // Update game state
        setGameState({
          grid: newGrid,
          ballPosition: newBallPosition,
        });

        // Update scores if needed
        setTeam1Score(team1NewScore);
        setTeam2Score(team2NewScore);

        // Reset positions after goal
        if (goalScored) {
          setTimeout(() => {
            resetPositionsAfterGoal();
          }, 1000);
        }

        // Switch teams
        setCurrentTeam(currentTeam === TEAM1 ? TEAM2 : TEAM1);

        // Check if the skipped player belongs to the team that just finished their turn
        // If so, clear the skipped status as they've now served their penalty
        if (
          skippedPlayer &&
          gameState.grid[skippedPlayer[0]][skippedPlayer[1]] &&
          gameState.grid[skippedPlayer[0]][skippedPlayer[1]]?.team ===
            currentTeam
        ) {
          setSkippedPlayer(null);
        }

        // Reset selected player and action mode
        setSelectedPlayer(null);
        setActionMode("move");
      }
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-3xl font-bold text-center mb-4">Chessball</h1>

      {!gameStarted ? (
        <GameSettings
          gameDuration={gameDuration}
          setGameDuration={setGameDuration}
          goalTarget={goalTarget}
          setGoalTarget={setGoalTarget}
          startGame={startGame}
        />
      ) : (
        <div>
          <GameInfo
            team1={TEAM1}
            team2={TEAM2}
            team1Score={team1Score}
            team2Score={team2Score}
            team1Color={TEAM1_COLOR}
            team2Color={TEAM2_COLOR}
            team2Secondary={TEAM2_SECONDARY}
            currentTeam={currentTeam}
            timeRemaining={timeRemaining}
          />

          <div className="flex flex-row items-start justify-center gap-8 relative">
            <div className="w-[550px] flex justify-center">
              <GameBoard
                gameState={gameState}
                selectedPlayer={selectedPlayer}
                validMoves={validMoves}
                skippedPlayer={skippedPlayer}
                handleCellClick={handleCellClick}
              />
            </div>

            <div className="w-[220px]">
              <ActionControls
                selectedPlayer={selectedPlayer}
                gameStarted={gameStarted}
                gameOver={gameOver}
                gameState={gameState}
                actionMode={actionMode}
                setActionMode={setActionMode}
                setSelectedPlayer={setSelectedPlayer}
              />

              {!gameOver && (
                <Button
                  onClick={endGame}
                  variant="outline"
                  className="w-full mt-4"
                >
                  End Game
                </Button>
              )}
            </div>
          </div>

          <GameOverScreen
            gameOver={gameOver}
            winner={winner}
            startGame={startGame}
          />
        </div>
      )}

      <Instructions />
    </div>
  );
}

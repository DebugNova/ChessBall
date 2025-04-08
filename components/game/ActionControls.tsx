"use client";

import { Button } from "@/components/ui/button";
import { GameState, SelectedPlayer } from "@/app/utils/gameUtils";

interface ActionControlsProps {
  selectedPlayer: SelectedPlayer | null;
  gameStarted: boolean;
  gameOver: boolean;
  gameState: GameState;
  actionMode: string;
  setActionMode: (mode: string) => void;
  setSelectedPlayer: (player: SelectedPlayer | null) => void;
}

export default function ActionControls({
  selectedPlayer,
  gameStarted,
  gameOver,
  gameState,
  actionMode,
  setActionMode,
  setSelectedPlayer,
}: ActionControlsProps) {
  if (!selectedPlayer || !gameStarted || gameOver) return null;

  const hasBall = (row: number, col: number) => {
    return (
      gameState.ballPosition[0] === row && gameState.ballPosition[1] === col
    );
  };

  const srcRow = selectedPlayer.row;
  const srcCol = selectedPlayer.col;
  const hasBallSelected = hasBall(srcRow, srcCol);

  const handleActionChange = (mode: string) => {
    setActionMode(mode);
  };

  const canAct = selectedPlayer && gameStarted && !gameOver;
  const canThrow =
    selectedPlayer && gameStarted && !gameOver && hasBallSelected;

  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-lg shadow-md min-w-[200px]">
      <h3 className="text-lg font-semibold mb-2">Action:</h3>
      <div className="flex flex-col gap-2">
        <Button
          variant={actionMode === "move" ? "default" : "outline"}
          onClick={() => handleActionChange("move")}
          className="w-full"
          disabled={!canAct}
        >
          Move Player
        </Button>
        <Button
          variant={actionMode === "throw" ? "default" : "outline"}
          onClick={() => handleActionChange("throw")}
          className="w-full"
          disabled={!canThrow}
        >
          Throw Ball
        </Button>
      </div>
    </div>
  );
}

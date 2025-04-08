"use client";

import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";

interface GameOverScreenProps {
  gameOver: boolean;
  winner: string | null;
  startGame: () => void;
}

export default function GameOverScreen({
  gameOver,
  winner,
  startGame,
}: GameOverScreenProps) {
  if (!gameOver) return null;

  return (
    <div className="mt-6 p-4 bg-yellow-100 rounded-lg text-center">
      <h2 className="text-xl font-bold mb-2 flex items-center justify-center">
        <Trophy className="mr-2" /> Game Over
      </h2>
      {winner === "Draw" ? (
        <p>The game ended in a draw!</p>
      ) : (
        <p>
          <span className="font-bold">{winner}</span> wins!
        </p>
      )}
      <Button onClick={startGame} className="mt-4">
        Play Again
      </Button>
    </div>
  );
}

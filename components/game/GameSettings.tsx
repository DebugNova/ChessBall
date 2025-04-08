"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface GameSettingsProps {
  gameDuration: number;
  setGameDuration: (duration: number) => void;
  goalTarget: number;
  setGoalTarget: (goals: number) => void;
  startGame: () => void;
}

export default function GameSettings({
  gameDuration,
  setGameDuration,
  goalTarget,
  setGoalTarget,
  startGame,
}: GameSettingsProps) {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Game Settings</h2>

      <div className="mb-4">
        <label className="block mb-2">Game Duration:</label>
        <div className="flex gap-2">
          {[5, 10, 15, 30].map((duration) => (
            <Button
              key={duration}
              variant={gameDuration === duration ? "default" : "outline"}
              onClick={() => setGameDuration(duration)}
            >
              {duration} min
            </Button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="block mb-2">Goal Target:</label>
        <div className="flex gap-2">
          {[3, 5, 10].map((goals) => (
            <Button
              key={goals}
              variant={goalTarget === goals ? "default" : "outline"}
              onClick={() => setGoalTarget(goals)}
            >
              {goals} goals
            </Button>
          ))}
        </div>
      </div>

      <Button onClick={startGame} className="w-full">
        Start Game
      </Button>
    </Card>
  );
}

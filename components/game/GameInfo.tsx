"use client";

import { Timer } from "lucide-react";
import { formatTime } from "@/app/utils/gameUtils";

interface GameInfoProps {
  team1: string;
  team2: string;
  team1Score: number;
  team2Score: number;
  team1Color: string;
  team2Color: string;
  team2Secondary: string;
  currentTeam: string;
  timeRemaining: number;
}

export default function GameInfo({
  team1,
  team2,
  team1Score,
  team2Score,
  team1Color,
  team2Color,
  team2Secondary,
  currentTeam,
  timeRemaining,
}: GameInfoProps) {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: team1Color }}
          ></div>
          <span className="font-bold">
            {team1}: {team1Score}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Timer size={16} className="mr-1" />
          <span>{formatTime(timeRemaining)}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-bold">
            {team2}: {team2Score}
          </span>
          <div
            className="w-4 h-4 rounded-full"
            style={{
              backgroundColor: team2Color,
              border: "1px solid black",
            }}
          ></div>
        </div>
      </div>

      <div className="mb-4 text-center">
        <span className="font-bold">Current Turn: </span>
        <span
          style={{
            color: currentTeam === team1 ? team1Color : team2Secondary,
          }}
        >
          {currentTeam}
        </span>
      </div>
    </>
  );
}

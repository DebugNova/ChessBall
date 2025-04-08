"use client";

export default function Instructions() {
  return (
    <div className="mt-8 bg-gray-50 p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-2">How to Play</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>The grid is 10×10 with coordinates (1,1) to (10,10)</li>
        <li>Each team has 4 field players and 1 goalkeeper</li>
        <li>Click on your team's player to select them</li>
        <li>
          Choose an action: Move Player (1 square) or Pass/Shoot Ball (2
          squares)
        </li>
        <li>Green highlighted squares show valid moves</li>
        <li>
          To tackle and get the ball, move diagonally to an opponent with the
          ball
        </li>
        <li>
          After a tackle, you get an extra move and the tackled player skips a
          turn
        </li>
        <li>Goal areas are the red squares - score by moving the ball there</li>
        <li>Goalkeepers have a 50% chance to block shots into their square</li>
        <li>
          Defense boxes (blue/yellow areas) allow max 2 players from the
          defending team
        </li>
        <li>After a goal, players reset to their starting positions</li>
      </ul>
    </div>
  );
}

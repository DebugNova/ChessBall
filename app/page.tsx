"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Timer, Trophy } from "lucide-react"

export default function ChessballGame() {
  // Game constants
  const GRID_SIZE = 10
  const TEAM1 = "Barcelona"
  const TEAM2 = "Real Madrid"
  const TEAM1_COLOR = "#A50044" // Barcelona colors
  const TEAM2_COLOR = "#FFFFFF" // Real Madrid colors
  const TEAM1_SECONDARY = "#004D98"
  const TEAM2_SECONDARY = "#00529F"

  // Game state
  const [gameStarted, setGameStarted] = useState(false)
  const [gameDuration, setGameDuration] = useState(5) // minutes
  const [goalTarget, setGoalTarget] = useState(3)
  const [currentTeam, setCurrentTeam] = useState(TEAM1)
  const [team1Score, setTeam1Score] = useState(0)
  const [team2Score, setTeam2Score] = useState(0)
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const [timeRemaining, setTimeRemaining] = useState(5 * 60) // seconds
  const [gameOver, setGameOver] = useState(false)
  const [winner, setWinner] = useState(null)
  const [actionMode, setActionMode] = useState("move") // 'move' or 'throw'
  const [validMoves, setValidMoves] = useState([])

  // Initial player positions to reset after goals
  const initialPositions = {
    team1: [
      { type: "goalkeeper", position: [0, 4] },
      { type: "goalkeeper", position: [0, 5] },
      { type: "goalkeeper", position: [1, 4] },
      { type: "goalkeeper", position: [1, 5] },
      { type: "player", position: [2, 2] },
      { type: "player", position: [2, 7] },
      { type: "player", position: [3, 4] },
      { type: "player", position: [3, 5] },
      { type: "player", position: [4, 3] },
      { type: "player", position: [4, 6] },
    ],
    team2: [
      { type: "goalkeeper", position: [8, 4] },
      { type: "goalkeeper", position: [8, 5] },
      { type: "goalkeeper", position: [9, 4] },
      { type: "goalkeeper", position: [9, 5] },
      { type: "player", position: [7, 2] },
      { type: "player", position: [7, 7] },
      { type: "player", position: [6, 4] },
      { type: "player", position: [6, 5] },
      { type: "player", position: [5, 3] },
      { type: "player", position: [5, 6] },
    ],
  }

  // Initialize the grid and players
  const initializeGame = () => {
    // Create empty grid
    const newGrid = Array(GRID_SIZE)
      .fill()
      .map(() => Array(GRID_SIZE).fill(null))

    // Set up Team 1 (Barcelona)
    initialPositions.team1.forEach((player) => {
      const [row, col] = player.position
      newGrid[row][col] = { team: TEAM1, type: player.type, position: [row, col] }
    })

    // Set up Team 2 (Real Madrid)
    initialPositions.team2.forEach((player) => {
      const [row, col] = player.position
      newGrid[row][col] = { team: TEAM2, type: player.type, position: [row, col] }
    })

    // Place the ball in the center
    const ballPosition = [4, 4]

    return { grid: newGrid, ballPosition }
  }

  const [gameState, setGameState] = useState(() => initializeGame())

  // Timer effect
  useEffect(() => {
    let timer
    if (gameStarted && !gameOver && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            endGame()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => clearInterval(timer)
  }, [gameStarted, gameOver, timeRemaining])

  // Check for win conditions
  useEffect(() => {
    if (team1Score >= goalTarget) {
      setWinner(TEAM1)
      setGameOver(true)
    } else if (team2Score >= goalTarget) {
      setWinner(TEAM2)
      setGameOver(true)
    }
  }, [team1Score, team2Score, goalTarget])

  // Calculate valid moves when a player is selected
  useEffect(() => {
    if (selectedPlayer) {
      const { row, col } = selectedPlayer
      const player = gameState.grid[row][col]

      if (actionMode === "move") {
        // Calculate valid movement squares (1 square in any direction)
        const moves = []
        for (let r = Math.max(0, row - 1); r <= Math.min(GRID_SIZE - 1, row + 1); r++) {
          for (let c = Math.max(0, col - 1); c <= Math.min(GRID_SIZE - 1, col + 1); c++) {
            // Skip the current position
            if (r === row && c === col) continue

            // Skip occupied squares
            if (gameState.grid[r][c]) continue

            // Check if this is a goalkeeper trying to leave goal area
            if (player.type === "goalkeeper") {
              const isTeam1Goal = r <= 1 && (c === 4 || c === 5)
              const isTeam2Goal = r >= 8 && (c === 4 || c === 5)

              if ((player.team === TEAM1 && !isTeam1Goal) || (player.team === TEAM2 && !isTeam2Goal)) {
                continue
              }
            }

            // Check defense box restrictions (max 2 players per team)
            if (isDefenseBox(r, c)) {
              const defenseTeam = r <= 2 ? TEAM1 : TEAM2

              // Only allow if it's the team's own defense box
              if (player.team !== defenseTeam) continue

              // Count current defenders
              let defenderCount = 0
              for (let dr = r <= 2 ? 0 : 7; dr <= (r <= 2 ? 2 : 9); dr++) {
                for (let dc = 0; dc < GRID_SIZE; dc++) {
                  if (
                    gameState.grid[dr][dc] &&
                    gameState.grid[dr][dc].team === defenseTeam &&
                    gameState.grid[dr][dc].position[0] !== row &&
                    gameState.grid[dr][dc].position[1] !== col
                  ) {
                    defenderCount++
                  }
                }
              }

              // Skip if already 2 defenders
              if (defenderCount >= 2) continue
            }

            moves.push([r, c])
          }
        }

        // Add tackle moves if player is adjacent to opponent with ball
        const [ballRow, ballCol] = gameState.ballPosition
        const ballOwner = gameState.grid[ballRow][ballCol]

        if (ballOwner && ballOwner.team !== player.team) {
          // Check if we can tackle diagonally
          const rowDiff = ballRow - row
          const colDiff = ballCol - col

          // Diagonal tackle (like chess)
          if (Math.abs(rowDiff) === 1 && Math.abs(colDiff) === 1) {
            moves.push([ballRow, ballCol])
          }
        }

        setValidMoves(moves)
      } else if (actionMode === "throw" && hasBall(row, col)) {
        // Calculate valid throw squares (2 squares in any direction)
        const moves = []
        for (let r = Math.max(0, row - 2); r <= Math.min(GRID_SIZE - 1, row + 2); r++) {
          for (let c = Math.max(0, col - 2); c <= Math.min(GRID_SIZE - 1, col + 2); c++) {
            // Skip positions that aren't exactly 2 squares away (Manhattan or diagonal)
            const rowDiff = Math.abs(r - row)
            const colDiff = Math.abs(c - col)

            // Only allow throws that are exactly 2 squares away (including diagonals)
            if ((rowDiff === 2 && colDiff <= 2) || (colDiff === 2 && rowDiff <= 2)) {
              moves.push([r, c])
            }
          }
        }
        setValidMoves(moves)
      }
    } else {
      setValidMoves([])
    }
  }, [selectedPlayer, gameState, actionMode])

  const startGame = () => {
    setGameState(initializeGame())
    setGameStarted(true)
    setGameOver(false)
    setTeam1Score(0)
    setTeam2Score(0)
    setCurrentTeam(TEAM1)
    setTimeRemaining(gameDuration * 60)
    setWinner(null)
    setActionMode("move")
  }

  const endGame = () => {
    setGameOver(true)
    if (team1Score > team2Score) {
      setWinner(TEAM1)
    } else if (team2Score > team1Score) {
      setWinner(TEAM2)
    } else {
      setWinner("Draw")
    }
  }

  const isDefenseBox = (row, col) => {
    return (row <= 2 && row >= 0) || (row >= 7 && row <= 9)
  }

  const isGoalArea = (row, col) => {
    return (row <= 1 && (col === 4 || col === 5)) || (row >= 8 && (col === 4 || col === 5))
  }

  const hasBall = (row, col) => {
    return gameState.ballPosition[0] === row && gameState.ballPosition[1] === col
  }

  const isValidMove = (row, col) => {
    return validMoves.some(([r, c]) => r === row && c === col)
  }

  const resetPositionsAfterGoal = () => {
    const newGrid = Array(GRID_SIZE)
      .fill()
      .map(() => Array(GRID_SIZE).fill(null))

    // Reset Team 1 (Barcelona)
    initialPositions.team1.forEach((player) => {
      const [row, col] = player.position
      newGrid[row][col] = { team: TEAM1, type: player.type, position: [row, col] }
    })

    // Reset Team 2 (Real Madrid)
    initialPositions.team2.forEach((player) => {
      const [row, col] = player.position
      newGrid[row][col] = { team: TEAM2, type: player.type, position: [row, col] }
    })

    // Place the ball in the center
    const ballPosition = [4, 4]

    setGameState({
      grid: newGrid,
      ballPosition,
    })
  }

  const handleCellClick = (row, col) => {
    if (!gameStarted || gameOver) return

    const cell = gameState.grid[row][col]

    // If no player is selected and the cell contains a player of the current team
    if (!selectedPlayer && cell && cell.team === currentTeam) {
      setSelectedPlayer({ row, col })
      return
    }

    // If a player is selected, try to move to the clicked cell
    if (selectedPlayer) {
      // Check if the move is valid based on calculated valid moves
      if (!isValidMove(row, col)) {
        return
      }

      const srcRow = selectedPlayer.row
      const srcCol = selectedPlayer.col
      const player = gameState.grid[srcRow][srcCol]

      if (actionMode === "move") {
        // Create a new grid with the player moved
        const newGrid = [...gameState.grid.map((row) => [...row])]

        // Check if this is a tackle move
        const isTackle = cell && cell.team !== currentTeam

        // Remove player from original position
        newGrid[srcRow][srcCol] = null

        // Place player in new position (replacing opponent in case of tackle)
        newGrid[row][col] = player
        player.position = [row, col]

        // Update ball position if the player had the ball or if this is a tackle
        let newBallPosition = [...gameState.ballPosition]
        if (hasBall(srcRow, srcCol)) {
          newBallPosition = [row, col]
        } else if (isTackle && hasBall(row, col)) {
          newBallPosition = [row, col]
        }

        // Check for goal
        let team1NewScore = team1Score
        let team2NewScore = team2Score
        let goalScored = false

        // Team 1 scores if ball reaches Team 2's goal area
        if (row >= 8 && (col === 4 || col === 5) && currentTeam === TEAM1) {
          team1NewScore++
          goalScored = true
        }
        // Team 2 scores if ball reaches Team 1's goal area
        else if (row <= 1 && (col === 4 || col === 5) && currentTeam === TEAM2) {
          team2NewScore++
          goalScored = true
        }

        // Update game state
        setGameState({
          grid: newGrid,
          ballPosition: newBallPosition,
        })

        // Update scores if needed
        setTeam1Score(team1NewScore)
        setTeam2Score(team2NewScore)

        // Reset positions after goal
        if (goalScored) {
          setTimeout(() => {
            resetPositionsAfterGoal()
          }, 1000)
        }

        // Switch teams
        setCurrentTeam(currentTeam === TEAM1 ? TEAM2 : TEAM1)

        // Reset selected player and action mode
        setSelectedPlayer(null)
        setActionMode("move")
      } else if (actionMode === "throw" && hasBall(srcRow, srcCol)) {
        // Create a new grid (no player movement for throw)
        const newGrid = [...gameState.grid.map((row) => [...row])]

        // Move the ball to the target square
        const newBallPosition = [row, col]

        // Check for goal
        let team1NewScore = team1Score
        let team2NewScore = team2Score
        let goalScored = false

        // Team 1 scores if ball reaches Team 2's goal area
        if (row >= 8 && (col === 4 || col === 5) && currentTeam === TEAM1) {
          team1NewScore++
          goalScored = true
        }
        // Team 2 scores if ball reaches Team 1's goal area
        else if (row <= 1 && (col === 4 || col === 5) && currentTeam === TEAM2) {
          team2NewScore++
          goalScored = true
        }

        // Update game state
        setGameState({
          grid: newGrid,
          ballPosition: newBallPosition,
        })

        // Update scores if needed
        setTeam1Score(team1NewScore)
        setTeam2Score(team2NewScore)

        // Reset positions after goal
        if (goalScored) {
          setTimeout(() => {
            resetPositionsAfterGoal()
          }, 1000)
        }

        // Switch teams
        setCurrentTeam(currentTeam === TEAM1 ? TEAM2 : TEAM1)

        // Reset selected player and action mode
        setSelectedPlayer(null)
        setActionMode("move")
      }
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  // Determine cell color based on position
  const getCellColor = (row, col) => {
    // Goal areas
    if (row <= 1 && (col === 4 || col === 5)) return "bg-red-200"
    if (row >= 8 && (col === 4 || col === 5)) return "bg-red-200"

    // Defense boxes
    if (row <= 2) return "bg-blue-100"
    if (row >= 7) return "bg-yellow-100"

    // Default
    return "bg-green-50"
  }

  // Render the game board
  const renderBoard = () => {
    return (
      <div className="grid grid-cols-10 gap-0.5 border border-gray-300">
        {Array(GRID_SIZE)
          .fill()
          .map((_, row) =>
            Array(GRID_SIZE)
              .fill()
              .map((_, col) => {
                const cell = gameState.grid[row][col]
                const hasBallHere = gameState.ballPosition[0] === row && gameState.ballPosition[1] === col
                const isSelected = selectedPlayer && selectedPlayer.row === row && selectedPlayer.col === col
                const isValidMoveSquare = selectedPlayer && isValidMove(row, col)

                return (
                  <div
                    key={`${row}-${col}`}
                    className={`${getCellColor(row, col)} w-10 h-10 flex items-center justify-center relative cursor-pointer border 
                  ${isSelected ? "border-yellow-400 border-2" : "border-gray-200"}
                  ${isValidMoveSquare ? "border-green-500 border-2" : ""}
                `}
                    onClick={() => handleCellClick(row, col)}
                  >
                    {cell && (
                      <div
                        className={`rounded-full w-8 h-8 flex items-center justify-center text-white text-xs font-bold`}
                        style={{
                          backgroundColor: cell.team === TEAM1 ? TEAM1_COLOR : TEAM2_COLOR,
                          color: cell.team === TEAM1 ? "white" : "black",
                        }}
                      >
                        {cell.type === "goalkeeper" ? "GK" : "P"}
                      </div>
                    )}
                    {hasBallHere && (
                      <div className="absolute top-0 right-0 w-3 h-3 bg-yellow-400 rounded-full border border-black"></div>
                    )}
                  </div>
                )
              }),
          )}
      </div>
    )
  }

  // Game controls for action selection
  const renderActionControls = () => {
    if (!selectedPlayer || !gameStarted || gameOver) return null

    const srcRow = selectedPlayer.row
    const srcCol = selectedPlayer.col
    const hasBallSelected = hasBall(srcRow, srcCol)

    return (
      <div className="mt-4 flex flex-col items-center">
        <div className="mb-2">
          <span className="font-bold">Action:</span>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={actionMode === "move" ? "default" : "outline"}
            onClick={() => setActionMode("move")}
          >
            Move Player
          </Button>
          <Button
            size="sm"
            variant={actionMode === "throw" ? "default" : "outline"}
            onClick={() => setActionMode("throw")}
            disabled={!hasBallSelected}
          >
            Throw Ball
          </Button>
          <Button size="sm" variant="outline" onClick={() => setSelectedPlayer(null)}>
            Cancel
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-4">Chessball</h1>

      {!gameStarted ? (
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
      ) : (
        <div>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: TEAM1_COLOR }}></div>
              <span className="font-bold">
                {TEAM1}: {team1Score}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Timer size={16} className="mr-1" />
              <span>{formatTime(timeRemaining)}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-bold">
                {TEAM2}: {team2Score}
              </span>
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: TEAM2_COLOR, border: "1px solid black" }}
              ></div>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="mb-4 text-center">
              <span className="font-bold">Current Turn: </span>
              <span style={{ color: currentTeam === TEAM1 ? TEAM1_COLOR : TEAM2_SECONDARY }}>{currentTeam}</span>
            </div>

            {renderBoard()}
            {renderActionControls()}

            {gameOver && (
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
            )}

            {!gameOver && (
              <Button onClick={endGame} variant="outline" className="mt-4">
                End Game
              </Button>
            )}
          </div>
        </div>
      )}

      <div className="mt-8 bg-gray-50 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">How to Play</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Click on your team's player to select them</li>
          <li>Choose an action: Move Player (1 square) or Throw Ball (2 squares)</li>
          <li>Green highlighted squares show valid moves</li>
          <li>Players cannot move to squares occupied by other players</li>
          <li>To tackle and get the ball, move diagonally to an opponent with the ball</li>
          <li>Score by moving the ball to the opponent's goal area (red squares)</li>
          <li>Only 2 defenders are allowed in each defense box (blue/yellow areas)</li>
          <li>After a goal, players reset to their starting positions</li>
        </ul>
      </div>
    </div>
  )
}


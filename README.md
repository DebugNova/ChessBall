# ChessBall

ChessBall is an innovative turn-based strategy game that combines elements of chess and football (soccer). Players take alternating turns controlling their team (Barcelona or Real Madrid) to outmaneuver opponents and score goals.

![ChessBall Game](https://example.com/chessball-screenshot.png)

## Features

- **Turn-based Strategy**: Alternate turns between Barcelona and Real Madrid
- **Chess-like Movement**: Players move one square in any direction (similar to chess kings)
- **Football Elements**: Score goals by moving the ball into your opponent's goal area
- **Dual Victory Conditions**: Win by reaching the goal target or having the most goals when time expires
- **Tactical Depth**:
  - Tackle opponents by moving diagonally to their position
  - Throw the ball up to 2 squares away
  - Manage your defense with goalkeeper positioning
  - Navigate defense box restrictions (maximum 2 players per team)

## Game Rules

### Basic Gameplay

1. Players take turns moving their team members (alternating between Barcelona and Real Madrid)
2. On your turn, select a player and choose an action (Move or Throw Ball)
3. Move players one square in any direction (including diagonally)
4. The ball moves with the player carrying it
5. Score by moving the ball into the opponent's goal area (red squares)

### Special Rules

- **Goalkeepers**: Can only move within the goal area
- **Defense Boxes**: Maximum of 2 defenders allowed in each defense box
- **Tackling**: Move diagonally to an opponent's position to take the ball
- **Throwing**: Throw the ball exactly 2 squares in any direction
- **After Goals**: Players reset to their starting positions

## Game Settings

- **Duration**: Customize game length (5, 10, 15, or 30 minutes)
- **Goal Target**: Set the number of goals needed to win (3, 5, or 10 goals)

## Technologies Used

- **Next.js**: React framework for the frontend
- **React 19**: For building the user interface
- **Radix UI**: Component library for accessible UI elements
- **Tailwind CSS**: For styling the application
- **TypeScript**: For type safety

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or pnpm

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/chessball.git
   cd chessball
   ```

2. Install dependencies:

   ```
   npm install --legacy-peer-deps
   ```

   or

   ```
   pnpm install --no-strict-peer-dependencies
   ```

3. Start the development server:

   ```
   npm run dev
   ```

   or

   ```
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to play the game.

## How to Play

1. **Start a Game**:

   - Configure game duration and goal target
   - Click "Start Game"

2. **During Your Turn**:

   - Click on one of your team's players to select them
   - Choose an action: Move Player or Throw Ball
   - Click on a highlighted square to make your move
   - After your move, the turn passes to your opponent

3. **Win Conditions**:
   - First team to reach the goal target wins
   - If time expires, the team with more goals wins
   - If tied when time expires, the game ends in a draw

## Project Structure

- `app/`: Next.js application files
  - `page.tsx`: Main game component
  - `layout.tsx`: Root layout component
  - `globals.css`: Global styles
- `components/`: Reusable UI components
  - `ui/`: Shadcn UI components
- `public/`: Static assets
- `styles/`: Additional styling files

## License

[MIT](LICENSE)

## Acknowledgements

- Inspired by chess and football
- Built with Next.js and React
- UI components from Radix UI

# ChessBall Setup and Running Guide

This guide provides detailed instructions for setting up and running the ChessBall web application on your local machine.

## System Requirements

- **Node.js**: Version 18.0.0 or later
- **npm** or **pnpm**: Latest stable version recommended
- **Web Browser**: Chrome, Firefox, Safari, or Edge (latest versions)
- **Operating System**: Windows, macOS, or Linux

## Installation Steps

### 1. Clone the Repository

First, clone the repository to your local machine:

```bash
git clone https://github.com/yourusername/chessball.git
cd chessball
```

### 2. Install Dependencies

Due to some dependency version conflicts, you'll need to use the legacy peer dependencies flag:

#### Using npm:

```bash
npm install --legacy-peer-deps
```

#### Using pnpm:

```bash
pnpm install --no-strict-peer-dependencies
```

This step will install all required libraries including:

- Next.js
- React and React DOM
- Radix UI components
- Tailwind CSS
- TypeScript and type definitions

### 3. Set Up Environment (Optional)

If you need to customize environment variables:

1. Create a `.env.local` file in the project root:

```bash
touch .env.local
```

2. Add any required environment variables (usually not needed for local development)

## Running the Application

### Development Mode

To run the application in development mode with hot-reloading:

```bash
npm run dev
```

or

```bash
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Production Build

To create an optimized production build:

1. Build the application:

```bash
npm run build
```

or

```bash
pnpm build
```

2. Start the production server:

```bash
npm run start
```

or

```bash
pnpm start
```

The production build will be available at [http://localhost:3000](http://localhost:3000).

## Troubleshooting Common Issues

### Dependency Conflicts

If you encounter dependency conflicts during installation:

```
npm error ERESOLVE unable to resolve dependency tree
```

Make sure to use the `--legacy-peer-deps` flag with npm or `--no-strict-peer-dependencies` with pnpm as mentioned in the installation steps.

### Port Already in Use

If port 3000 is already in use, you can:

1. Kill the process using port 3000:

   - Windows: `netstat -ano | findstr :3000` then `taskkill /PID <PID> /F`
   - macOS/Linux: `lsof -i :3000` then `kill -9 <PID>`

2. Or change the port by creating a `.env.local` file with:
   ```
   PORT=3001
   ```

### Next.js Build Errors

If you encounter errors during the build process:

1. Delete the `.next` folder:

```bash
rm -rf .next
```

2. Clear npm cache:

```bash
npm cache clean --force
```

3. Reinstall dependencies and rebuild:

```bash
npm install --legacy-peer-deps
npm run build
```

## Deployment Options

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Vercel will automatically detect Next.js and deploy it

### Netlify

1. Add a `netlify.toml` file:

```toml
[build]
  command = "npm run build"
  publish = ".next"
```

2. Connect your repository to Netlify

### Manual Server Deployment

1. Build the application: `npm run build`
2. Transfer the following to your server:
   - `.next` folder
   - `node_modules` folder
   - `package.json`
   - `next.config.mjs`
3. Run `npm run start` on your server

## Game Access

Once running, open your web browser and navigate to:

- Development: [http://localhost:3000](http://localhost:3000)
- Production: Your deployed URL or [http://localhost:3000](http://localhost:3000) if running locally

## Updating the Application

To update the application with the latest changes:

1. Pull the latest code:

```bash
git pull origin main
```

2. Reinstall dependencies:

```bash
npm install --legacy-peer-deps
```

3. Restart the development server:

```bash
npm run dev
```

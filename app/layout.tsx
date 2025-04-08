import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ChessBall Game", // Changed from 'v0 App'
  description: "A fun and strategic ChessBall game created with Next.js", // Updated description for clarity
  generator: "v0.dev", // Optional: Keep or remove based on preference
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

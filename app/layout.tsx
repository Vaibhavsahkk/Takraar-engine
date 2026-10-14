import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TAKRAAR // The Real-Time Cross-Lingual Heated Dispute Engine",
  description:
    "Two people who don't share a single language have a real argument: interrupting each other, getting heated, and changing their minds. Built for ZERO.",
  keywords: [
    "cross-lingual argument",
    "real-time translation",
    "speech barge-in",
    "bilingual dispute",
    "zero4genz",
    "takraar",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full dark`}>
      <body className="min-h-full flex flex-col bg-[#08090a] text-[#f4f4f0] antialiased">
        {children}
      </body>
    </html>
  );
}

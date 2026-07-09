import type { Metadata } from "next";
import "./globals.css";
import ToastProvider from "@/components/UI/ToastProvider";

export const metadata: Metadata = {
  title: "ReadMeStudio | Craft Your GitHub Developer Identity",
  description: "Visual GitHub README generator with drag-and-drop mechanics, streak counters, and premium theme styles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col bg-[#15121b] text-[#e8dfee]">
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}

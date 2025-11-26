import type { Metadata } from "next";
import { Gloria_Hallelujah, Patrick_Hand } from "next/font/google";
import "./globals.css";

const gloria = Gloria_Hallelujah({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-doodle",
});

const patrick = Patrick_Hand({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-hand",
});

export const metadata: Metadata = {
  title: "Doodle Museum",
  description: "The most prestigious gallery of scribbles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${gloria.variable} ${patrick.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
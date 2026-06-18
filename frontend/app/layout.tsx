import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kakao Assignment 3 Todo",
  description: "Next.js App Router and FastAPI Todo app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}

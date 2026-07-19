import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Serif_JP } from "next/font/google";
import Sidebar from "@/components/layout/Sidebar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSerifJP = Noto_Serif_JP({
  weight: ["500", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "でん同士美術館マップ",
  description: "儒烏風亭らでんさんがコラボ・紹介した美術館・博物館を掲載するアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-dvh flex">
        <Sidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <header className="flex items-center h-16 px-4 shrink-0">
            <h1 className={`${notoSerifJP.className} text-3xl font-bold text-neutral-100 tracking-wide`}>
              でん同士美術館マップ🐚
            </h1>
          </header>
          <main className="flex-1 min-h-0">{children}</main>
        </div>
      </body>
    </html>
  );
}

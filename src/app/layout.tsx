import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeRegistry from './theme/ThemeRegistry';
import MainBottomNav from './components/MainBottomNav'; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Daily Alley",
  description: "우리 동네를 살리는 AI 브랜딩 솔루션",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <ThemeRegistry>
          {/* 메인 콘텐츠 영역 */}
          {children}

          {/* 하단 네비게이션 바 */}
          <MainBottomNav />
        </ThemeRegistry>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI TOKEN - AI模型价格对比 | 找最划算的AI模型",
  description: "对比GPT-5、Claude 3.7、Gemini、DeepSeek、Llama等18+主流AI模型的价格、速度、上下文。支持中英文、成本计算器、价格趋势分析。帮你找到最适合的AI模型。",
  keywords: "AI, 模型, 价格对比, GPT-5, Claude, Gemini, DeepSeek, Llama, 成本计算, AI比价",
  authors: [{ name: "AI TOKEN" }],
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="dark">
      <body
        className={`${dmSans.variable} ${spaceGrotesk.variable} min-h-screen antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

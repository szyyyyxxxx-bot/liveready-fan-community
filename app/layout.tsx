import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "热爱有迹 LoveTrace｜QQ音乐全场景粉丝同行社区",
  description: "从音乐出发，让每一次热爱都有迹可循。连接艺人社区、地点收藏、智能路线、同场交流、现场打卡与个人足迹。",
  icons: {
    icon: "/lovetrace-icon-v2.svg",
    shortcut: "/lovetrace-icon-v2.svg",
    apple: "/lovetrace-icon-v2.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}

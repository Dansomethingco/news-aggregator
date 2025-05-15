import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from 'next/font/local';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const rockwell = localFont({
  src: [
    {
      path: './fonts/rockwell-regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/rockwell-bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-rockwell',
});

export const metadata: Metadata = {
  title: "Today",
  description: "Your personalized news feed",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${rockwell.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

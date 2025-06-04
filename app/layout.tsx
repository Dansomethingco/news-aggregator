import type { Metadata } from "next";
import localFont from 'next/font/local';
import "./globals.css";
import { PreferencesProvider } from './contexts/PreferencesContext';

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
    <html lang="en" className={rockwell.variable}>
      <body className="__variable_cd3a0a __variable_5cfdac __variable_9a8899 antialiased">
        <div className="flex flex-col items-center justify-center min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}

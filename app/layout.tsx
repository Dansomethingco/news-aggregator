import type { Metadata } from "next";
import "./globals.css";
import { PreferencesProvider } from './contexts/PreferencesContext';
import Header from './components/header';

const metadata: Metadata = {
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
      <body className="font-rockwell antialiased">
        <PreferencesProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
          </div>
        </PreferencesProvider>
      </body>
    </html>
  );
}

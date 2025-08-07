import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Provider } from 'jotai';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zirk.it - Your business. Connected.",
  description: "AI-powered website generator for small businesses",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Provider>
        <body className={inter.className}>{children}</body>
      </Provider>
    </html>
  );
}
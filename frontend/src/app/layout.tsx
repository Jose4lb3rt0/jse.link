import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "@/providers/react-query-provider";
import Navbar from "./components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Acortador de URL | JSE.Link",
  description: "Demo de mi acortador de URLs.",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode; }>) {

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ReactQueryProvider>
          <main className="min-h-screen bg-[#0b1326] text-white font-sans antialiased">
            <Navbar />
            {children}
          </main>
        </ReactQueryProvider>
      </body>
    </html>
  );
}

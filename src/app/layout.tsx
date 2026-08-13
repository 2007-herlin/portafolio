import type { Metadata } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "DanyCode | Desarrollador Full Stack",
  description: "Portafolio profesional de DanyCode — desarrollador con experiencia en React, Next.js, TypeScript, Node.js y más.",
  keywords: ["portafolio", "desarrollador", "full stack", "react", "nextjs"],
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${jakarta.variable} antialiased`}
    >
      <body className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-white flex flex-col relative">
        <div className="bg-bubbles"></div>
        {children}
      </body>
    </html>
  );
}

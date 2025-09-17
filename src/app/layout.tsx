import type { Metadata } from "next";
import { Geist, Geist_Mono, Orbitron } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Capponuts – Dashboard Gaming",
  description: "Dashboard néon gaming de Capponuts: stats TFT/LoL, profil joueur, intégrations.",
  metadataBase: new URL("https://capponuts.vercel.app"),
  openGraph: {
    title: "Capponuts – Dashboard Gaming",
    description: "Stats TFT/LoL, profil joueur, style néon.",
    url: "https://capponuts.vercel.app",
    siteName: "Capponuts",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Capponuts – Dashboard Gaming",
    description: "Stats TFT/LoL, profil joueur, style néon.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable}`}>
        {children}
      </body>
    </html>
  );
}

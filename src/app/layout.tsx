import type { Metadata, Viewport } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "CAPPONUTS - 3D Space Experience",
  description: "CAPPONUTS - Une expérience 3D spatiale immersive avec des lettres flottantes, des étoiles et des éclairs dans l'espace. Style inspiré de The Mask avec des effets de fumée verte.",
  keywords: "CAPPONUTS, 3D, Three.js, espace, étoiles, éclairs, The Mask, expérience immersive",
  authors: [{ name: "CAPPONUTS Team" }],
  metadataBase: new URL("https://www.capponuts.fr"),
  robots: "index, follow",
  openGraph: {
    title: "CAPPONUTS - 3D Space Experience",
    description: "Une expérience 3D spatiale immersive avec des lettres flottantes et des effets spéciaux",
    type: "website",
    url: "https://capponuts.vercel.app",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "CAPPONUTS 3D Space Experience",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CAPPONUTS - 3D Space Experience",
    description: "Une expérience 3D spatiale immersive avec des lettres flottantes",
    images: ["/og-image.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#000000" />
        <meta name="color-scheme" content="dark" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        {/* Preconnect pour accélérer le chargement des polices et de YouTube */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.youtube.com" />
        <link rel="preconnect" href="https://i.ytimg.com" />
      </head>
      <body className="antialiased">
        <nav style={{ position: 'fixed', top: 8, right: 8, zIndex: 50, display: 'flex', gap: 8 }}>
          <Link href="/" style={{ padding: '6px 10px', border: '1px solid #234', borderRadius: 8, color: '#b3e5fc', background: '#0b0b12' }}>Accueil</Link>
          <Link href="/dashboard" style={{ padding: '6px 10px', border: '1px solid #234', borderRadius: 8, color: '#b3e5fc', background: '#0b0b12' }}>Dashboard</Link>
          <Link href="/integrations" style={{ padding: '6px 10px', border: '1px solid #234', borderRadius: 8, color: '#b3e5fc', background: '#0b0b12' }}>Intégrations</Link>
        </nav>
        {children}
      </body>
    </html>
  );
}

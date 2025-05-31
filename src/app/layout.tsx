import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "La Boutique de Capponuts - Trésors et objets uniques",
  description: "Découvrez des objets vintage et uniques dans la boutique de Capponuts. Vases, livres anciens, lampes rétro et bien plus encore !",
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.png', sizes: '16x16', type: 'image/png' }
    ],
    apple: [
      { url: '/favicon.png', sizes: '180x180', type: 'image/png' }
    ]
  },
  openGraph: {
    title: "La Boutique de Capponuts",
    description: "Produits Amazon sélectionnés avec soin - Prix imbattables !",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "La Boutique de Capponuts",
    description: "Produits Amazon sélectionnés avec soin - Prix imbattables !"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}

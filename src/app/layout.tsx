import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "700"],
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
    type: "website",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'La Boutique de Capponuts - Open Graph Image'
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "La Boutique de Capponuts",
    description: "Produits Amazon sélectionnés avec soin - Prix imbattables !",
    images: ['/og-image.png']
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${montserrat.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}

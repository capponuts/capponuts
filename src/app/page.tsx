"use client";

import { 
  Star, 
  StarHalf, 
  Menu, 
  Truck, 
  ExternalLink
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

// Données des produits (vous pourrez les modifier facilement)
const products = [
  {
    id: 1,
    name: "Bateaux Telecommander, Jouet Mosasaure Télécommandé 2.4G avec USB et Lumière",
    description: "Jouet aquatique télécommandé en forme de mosasaure, 2.4GHz, avec éclairage LED et rechargeable USB",
    price: 15,
    originalPrice: 29.99,
    rating: 4.3,
    reviews: 12,
    category: "Jeux et Jouets",
    image: "https://m.media-amazon.com/images/W/MEDIAX_1215821-T1/images/I/91mKK7NFi3L._AC_SX679_.jpg",
    amazonLink: "https://www.amazon.fr/dp/B0DSHZ2RP5"
  },
  {
    id: 2,
    name: "Seche Cheveux Ionique 1600W Diffuseur de Cheveux Professionnel 150 000 t/m 4 Températures 3 Vitesses Bouton Chaud/Froid Hair Dryer Concentrateur/Diffuseur Magnétique Faible Bruit Voyage Maison",
    description: "Sèche-cheveux professionnel ionique 1600W avec diffuseur, 4 températures, 3 vitesses, fonction chaud/froid, concentrateur magnétique",
    price: 15,
    originalPrice: 29.99,
    rating: 4.5,
    reviews: 28,
    category: "Beauté et Soins",
    image: "https://m.media-amazon.com/images/W/MEDIAX_1215821-T1/images/I/61aH3xKghuL._AC_SX679_.jpg",
    amazonLink: "https://www.amazon.fr/dp/B0DSL9VW8D?th=1"
  },
  {
    id: 3,
    name: "4 Pièces Étagère de Douche sans Percage - Noir Porte Savon Douche Sans PerçAge Avec Crochets- Avec 1 Support De Dentifrice Et 1 Porte-Savon - Organiseur De Salle De Bain Et Cuisine",
    description: "Set de 4 étagères de douche noires sans perçage avec crochets, support dentifrice et porte-savon, organiseur salle de bain et cuisine",
    price: 12,
    originalPrice: 25,
    rating: 4.2,
    reviews: 15,
    category: "Cuisine et Maison",
    image: "https://m.media-amazon.com/images/W/MEDIAX_1215821-T1/images/I/71pcYaYe3jL._AC_SX679_.jpg",
    amazonLink: "https://www.amazon.fr/dp/B0DSTNYLRV"
  },
  {
    id: 4,
    name: "Rasoir intime 5 en 1 pour femme, rasoir électrique, pour la zone intime IPX7, étanche avec station de charge USB, tondeuse pour le visage, les sourcils, le corps, le bikini",
    description: "Rasoir électrique 5 en 1 étanche IPX7 avec station de charge USB, tondeuse multifonction pour visage, sourcils, corps et zone bikini",
    price: 13,
    originalPrice: 26.99,
    rating: 4.4,
    reviews: 22,
    category: "Beauté et Soins",
    image: "https://m.media-amazon.com/images/W/MEDIAX_1215821-T1/images/I/61QvIGuSFaL.__AC_SX300_SY300_QL70_ML2_.jpg",
    amazonLink: "https://www.amazon.fr/dp/B0DLNYRJW5"
  },
  {
    id: 5,
    name: "Tondeuse Corporelle pour Hommes Sans fil étanchéité IPX7",
    description: "Tondeuse corporelle sans fil étanche IPX7 pour hommes, rechargeable, lames en acier inoxydable pour un rasage précis et confortable",
    price: 25,
    originalPrice: 50,
    rating: 4.3,
    reviews: 18,
    category: "Beauté et Soins",
    image: "https://m.media-amazon.com/images/W/MEDIAX_1215821-T1/images/I/71gcIR7IBmL._AC_SX679_.jpg",
    amazonLink: "https://www.amazon.fr/dp/B0DZCSNCZ9"
  },
  {
    id: 6,
    name: "Testeur pH et Sel Piscine, Le Testeur Salinité PPT et pH Metre pour Piscine au Sel, Le Testeur TDS EC de Salinité pH 5 en 1 pour Aquarium, Eau Potable, Hydroponie, Eau Salée, SPA, Brassage",
    description: "Testeur 5 en 1 pH et salinité pour piscine, aquarium, hydroponie et SPA. Mesure pH, TDS, EC, salinité PPT et température",
    price: 15,
    originalPrice: 39.99,
    rating: 4.1,
    reviews: 24,
    category: "Jardin",
    image: "https://m.media-amazon.com/images/W/MEDIAX_1215821-T1/images/I/71-Xk00pIJL._SX522_.jpg",
    amazonLink: "https://www.amazon.fr/dp/B0DJ57SPLX"
  },
  {
    id: 7,
    name: "Air Styler 5 en 1 Air Brush Brosse Chauffante Brushing Sèche-Cheveux Ionique Brosse Soufflante Airstyler Boucleur a Cheveux à Air Brosse à Lissante Ensemble Airbrush Coiffure Femme",
    description: "Kit coiffure 5 en 1 avec brosse chauffante, brushing, sèche-cheveux ionique, brosse soufflante et boucleur à air pour un style parfait",
    price: 30,
    originalPrice: 61.99,
    rating: 4.5,
    reviews: 32,
    category: "Beauté et Soins",
    image: "https://m.media-amazon.com/images/W/MEDIAX_1215821-T1/images/I/81yHHEvYP2L._AC_SX679_.jpg",
    amazonLink: "https://www.amazon.fr/dp/B0F9KS6B6D?th=1"
  },
  {
    id: 8,
    name: "Lisseur Boucleur Cheveux 2-en-1: Fer a Lisser Twisté Idéal pour Lissage Boucles & Ondulations - Des Cheveux Plus Lisses et Plus Brillants",
    description: "Lisseur et boucleur 2-en-1 avec technologie twistée pour des cheveux lisses, brillants et des boucles parfaites",
    price: 17,
    originalPrice: 39.99,
    rating: 4.4,
    reviews: 28,
    category: "Beauté et Soins",
    image: "https://m.media-amazon.com/images/W/MEDIAX_1215821-T1/images/I/71o4ssW8JsL._AC_SX679_.jpg",
    amazonLink: "https://www.amazon.fr/dp/B0D25VKZXZ"
  },
  {
    id: 9,
    name: "Brosse Lissante Pour Cheveux Ionique Lisseur Cheveux, Peigne Chauffant Professionnel Peigne de fer à lisser avec 9 Réglages de Température et Écran LCD, 20S Brosse Chauffante Rapide",
    description: "Brosse lissante ionique professionnelle avec 9 réglages de température, écran LCD et chauffage rapide en 20 secondes",
    price: 20,
    originalPrice: 49.99,
    rating: 4.6,
    reviews: 35,
    category: "Beauté et Soins",
    image: "https://m.media-amazon.com/images/W/MEDIAX_1215821-T1/images/I/815rHOHG+RL._AC_SX679_.jpg",
    amazonLink: "https://www.amazon.fr/dp/B0DDTH52Z9"
  },
  {
    id: 10,
    name: "Bubble Tape, Kit de Bricolage pour Enfants avec Boîte de Stockage, 6 Nano Ruban Double Face, Perles et des Paillettes Scintillantes",
    description: "Kit créatif complet avec boîte de rangement, 6 rubans adhésifs nano, perles et paillettes pour des créations scintillantes",
    price: 20,
    originalPrice: 38.99,
    rating: 4.5,
    reviews: 42,
    category: "Jeux et Jouets",
    image: "https://m.media-amazon.com/images/W/MEDIAX_1215821-T1/images/I/811LWFX4JgL._AC_SX425_.jpg",
    amazonLink: "https://www.amazon.fr/dp/B0DRJK34FK?th=1"
  },
  {
    id: 11,
    name: "Montre Connectée Femme avec Appel, 1.27\" HD Smartwatch IP68 avec Fonction Féminine/120+ Modes Sport/Fréquence/Cardiaque/SpO2/Calories/Podomètre/Sommeil, Montre de Fitness Android iOS, Rosa",
    description: "Smartwatch féminine avec écran HD 1.27\", étanche IP68, 120+ modes sport, suivi santé complet (fréquence cardiaque, SpO2, calories, sommeil), compatible Android et iOS",
    price: 20,
    originalPrice: 39.99,
    rating: 4.4,
    reviews: 38,
    category: "High-Tech",
    image: "https://m.media-amazon.com/images/W/MEDIAX_1215821-T1/images/I/712vVca5uML._AC_SX425_.jpg",
    amazonLink: "https://www.amazon.fr/dp/B0F2H2CPR4?th=1"
  },
  {
    id: 13,
    name: "Routeur Wi-FI 6 VPN - Alimentation USB-C Compact, Ports Gigabit LAN/WAN, OpenVPN/WireGuard/ZeroTier - Hôtels,Camping-Car",
    description: "Routeur Wi-Fi 6 compact avec alimentation USB-C, ports Gigabit, support VPN (OpenVPN/WireGuard/ZeroTier), idéal pour hôtels et camping-cars",
    price: 30,
    originalPrice: 69.99,
    rating: 4.5,
    reviews: 52,
    category: "High-Tech",
    image: "https://m.media-amazon.com/images/W/MEDIAX_1215821-T1/images/I/518ZPXN-zwL._AC_SX679_.jpg",
    amazonLink: "https://www.amazon.fr/dp/B0F43HSKD5"
  },
  {
    id: 14,
    name: "Jeu musical de saut à anneau et lanceur de fusée à pied 3 en 1",
    description: "Jeu d'extérieur 3 en 1 avec anneau musical pour sauter, lanceur de fusée à pied et fonction musicale pour des heures de jeu actif",
    price: 15,
    originalPrice: 37.99,
    rating: 4.4,
    reviews: 28,
    category: "Jeux et Jouets",
    image: "https://m.media-amazon.com/images/W/MEDIAX_1215821-T1/images/I/71lKQMSKbuL._AC_SX679_.jpg",
    amazonLink: "https://www.amazon.fr/dp/B0F1TRF9LR"
  },
  {
    id: 15,
    name: "Sac de frappe mural réglable en hauteur et pliable, sac de frappe à suspendre pour enfants, adolescents et adultes, pour l'entraînement",
    description: "Sac de frappe mural polyvalent avec hauteur réglable, pliable pour un rangement facile, adapté aux enfants, adolescents et adultes",
    price: 20,
    originalPrice: 39.99,
    rating: 4.3,
    reviews: 35,
    category: "Sports et Loisirs",
    image: "https://m.media-amazon.com/images/W/MEDIAX_1215821-T1/images/I/61rY4dKV++L._AC_SX679_.jpg",
    amazonLink: "https://www.amazon.fr/dp/B0DRBDSZ6F"
  },
  {
    id: 17,
    name: "Diffuseur d'huiles essentielles sans Eau, pour la Maison, Grande Chambre, Chambre à Coucher, Voiture, Bureau, Bureau. A Batterie, Petit diffuseur avec Parfum Pur, capacité 100 ML",
    description: "Diffuseur d'huiles essentielles portable sans eau, fonctionne sur batterie, capacité de 100ml, idéal pour toutes les pièces",
    price: 25,
    originalPrice: 49.99,
    rating: 4.5,
    reviews: 28,
    category: "Cuisine et Maison",
    image: "https://m.media-amazon.com/images/W/MEDIAX_1215821-T1/images/I/61gbRhTYGGL._AC_SX679_.jpg",
    amazonLink: "https://www.amazon.fr/dp/B0DYNK433T?th=1"
  },
  {
    id: 18,
    name: "Bateau télécommandé Enfants, Kayak araignée télécommandé avec éclairage LED lac et étang, 2,4 GHz, Activation par l'eau",
    description: "Bateau télécommandé en forme de kayak araignée avec éclairage LED, fréquence 2.4GHz, s'active au contact de l'eau",
    price: 12,
    originalPrice: 29.99,
    rating: 4.3,
    reviews: 25,
    category: "Jeux et Jouets",
    image: "https://m.media-amazon.com/images/W/MEDIAX_1215821-T1/images/I/61xM2Q23jIL._AC_SX679_.jpg",
    amazonLink: "https://www.amazon.fr/dp/B0DR7SCPKF"
  },
  {
    id: 19,
    name: "Parc enfant 120×120cm, Parc de Jeu pour Bébé, Barrière de Sécurité pour Enfants, Parc d'Activités pour Bébé avec Filet de Protection",
    description: "Parc de jeu sécurisé pour bébé de 120x120cm avec filet de protection, barrière de sécurité et espace d'activités",
    price: 30,
    originalPrice: 69.99,
    rating: 4.5,
    reviews: 42,
    category: "Jeux et Jouets",
    image: "https://m.media-amazon.com/images/W/MEDIAX_1215821-T1/images/I/81kAK5Di29L._AC_SX679_.jpg",
    amazonLink: "https://www.amazon.fr/dp/B0F7LVQ4JP"
  },
  {
    id: 20,
    name: "Tapis de Danse pour Enfants 3 à 12 Ans, Tapis de Jeu Musical avec 8 Modes de Jeu, Tapis de Danse Électronique avec Musique et Lumières",
    description: "Tapis de danse interactif pour enfants avec 8 modes de jeu, effets lumineux et musique, adapté aux 3-12 ans",
    price: 20,
    originalPrice: 39.99,
    rating: 4.4,
    reviews: 35,
    category: "Jeux et Jouets",
    image: "https://m.media-amazon.com/images/W/MEDIAX_1215821-T1/images/I/71vWnd1R0SL._AC_SX679_.jpg",
    amazonLink: "https://www.amazon.fr/dp/B0F18YF2Q6?th=1"
  },
  {
    id: 21,
    name: "Montre Connectée, Écran AMOLED Ultra-Clair, Étanche 3ATM Natation, Appels Bluetooth, Suivi Cardio/Sommeil/100 Sports, Compatible Téléphones Android et iOS",
    description: "Smartwatch avec écran AMOLED, étanche 3ATM, appels Bluetooth, suivi santé complet et 100 modes sport, compatible Android et iOS",
    price: 20,
    originalPrice: 39.99,
    rating: 4.5,
    reviews: 48,
    category: "High-Tech",
    image: "https://m.media-amazon.com/images/W/MEDIAX_1215821-T1/images/I/61x9CrdmhvL._AC_SX679_.jpg",
    amazonLink: "https://www.amazon.fr/dp/B0F3HX1NQ3"
  },
  {
    id: 22,
    name: "Jolicare Sèche Cheveux Professionnel, 2400W Hair Dryer Seche Cheveux Ionique avec Diffuseur Boucle Accessoires",
    description: "Sèche-cheveux professionnel 2400W avec technologie ionique, diffuseur et accessoires pour boucles, puissant et polyvalent",
    price: 20,
    originalPrice: 39.99,
    rating: 4.4,
    reviews: 42,
    category: "Beauté et Soins",
    image: "https://m.media-amazon.com/images/W/MEDIAX_1215821-T1/images/I/6107jSxaF3L._AC_SX679_.jpg",
    amazonLink: "https://www.amazon.fr/dp/B0F1MFPZZS"
  },
  {
    id: 23,
    name: "Jouets pour Tout-Petits 1 2 Ans Garçons Filles, Toboggan éléphant avec 4 Voitures d'animaux",
    description: "Toboggan éléphant interactif avec 4 voitures d'animaux, jouet éducatif pour les enfants de 1 à 2 ans",
    price: 15,
    originalPrice: 27.99,
    rating: 4.5,
    reviews: 38,
    category: "Jeux et Jouets",
    image: "https://m.media-amazon.com/images/W/MEDIAX_1215821-T1/images/I/81pLWZ+39iL._AC_SX679_.jpg",
    amazonLink: "https://www.amazon.fr/dp/B0DXV1TGXW"
  },
  {
    id: 24,
    name: "LIGE Montre Connectée Homme Militaire avec 1000mAh Batterie, 2.13\" AMOLED Appel Bluetooth IP68 Smartwatch Homme pour Android iOS, 100+ Modes Sportifs, Fréquence Cardiaque Sommeil",
    description: "Smartwatch militaire avec écran AMOLED 2.13\", batterie 1000mAh, étanche IP68, appels Bluetooth, 100+ modes sport et suivi santé",
    price: 20,
    originalPrice: 39.99,
    rating: 4.6,
    reviews: 45,
    category: "High-Tech",
    image: "https://m.media-amazon.com/images/W/MEDIAX_1215821-T1/images/I/81rTL0ebWbL._AC_SX679_.jpg",
    amazonLink: "https://www.amazon.fr/dp/B0F6LV4H3M"
  },
  {
    id: 25,
    name: "LIGE Montre Connectée Hommes avec Boussole, Baromètre, Pression et Altimètre, 2,13\" Grand Écran AMOLED Smartwatch Compatible Android iOS, Batterie 1000 mAh, 100+ Modes Sportifs, GrisBleu",
    description: "Smartwatch avec écran AMOLED 2.13\", boussole, baromètre, altimètre, batterie 1000mAh, 100+ modes sport, compatible Android et iOS",
    price: 20,
    originalPrice: 39.99,
    rating: 4.5,
    reviews: 42,
    category: "High-Tech",
    image: "https://m.media-amazon.com/images/W/MEDIAX_1215821-T1/images/I/81jM5HBKXML._AC_SX679_.jpg",
    amazonLink: "https://www.amazon.fr/dp/B0F6LNPSVR"
  },
  {
    id: 26,
    name: "Montre Connectée Homme, Smartwatch avec GPS intégré Appels Bluetooth et Écran HD 1.39\", 3ATM Étanche et Batterie 530mAh, Montre Sport Homme avec 110Modes Sportifs/SpO2 pour Android iOS",
    description: "Smartwatch avec GPS intégré, écran HD 1.39\", étanche 3ATM, batterie 530mAh, 110 modes sport, SpO2, appels Bluetooth, compatible Android et iOS",
    price: 30,
    originalPrice: 59.99,
    rating: 4.5,
    reviews: 38,
    category: "High-Tech",
    image: "https://m.media-amazon.com/images/W/MEDIAX_1215821-T1/images/I/71PYK0WEeUL._AC_SX679_.jpg",
    amazonLink: "https://www.amazon.fr/dp/B0F5WDMS4V"
  }
];

const categories = [
  "Toutes catégories",
  "High-Tech",
  "Cuisine et Maison",
  "Auto et Moto",
  "Informatique",
  "Bricolage",
  "Mode",
  "Sports et Loisirs",
  "Hygiène et Santé",
  "Jardin",
  "Jeux et Jouets"
];

// Composant pour afficher les étoiles avec Lucide
const StarRating = ({ rating, reviews }: { rating: number; reviews: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  
  return (
    <div className="flex items-center gap-1 text-sm">
      <div className="flex text-yellow-400">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="w-4 h-4">
            {i < fullStars ? (
              <Star className="w-4 h-4 fill-current" />
            ) : i === fullStars && hasHalfStar ? (
              <StarHalf className="w-4 h-4 fill-current" />
            ) : (
              <Star className="w-4 h-4 text-gray-300" />
            )}
          </span>
        ))}
      </div>
      <span className="text-blue-400 hover:text-orange-400 cursor-pointer ml-1">
        ({reviews})
      </span>
    </div>
  );
};

const PRODUCTS_PER_PAGE = 12;

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("Toutes catégories");
  const [showIntro, setShowIntro] = useState(true);
  const [typedText, setTypedText] = useState("");
  const welcomeText = "Bienvenue sur la boutique de Capponuts";
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = products.slice((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE);

  useEffect(() => {
    if (!showIntro) return;
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(welcomeText.slice(0, i + 1));
      i++;
      if (i === welcomeText.length) {
        clearInterval(interval);
        setTimeout(() => setShowIntro(false), 1500); // Affiche le logo 1.5s puis transition
      }
    }, 70);
    return () => clearInterval(interval);
  }, [showIntro]);

  // Affichage de l'intro
  if (showIntro) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col min-h-screen justify-center items-center bg-gradient-to-br from-orange-100 to-amber-200 text-center">
        <div className="text-2xl sm:text-3xl font-bold text-amber-900 mb-8 min-h-[2.5em] tracking-wide animate-fade-in">
          {typedText}
          <span className="animate-pulse">|</span>
        </div>
        {typedText.length === welcomeText.length && (
          <div className="flex flex-col items-center animate-fade-in-up">
            <Image src="/logo.png" alt="Logo Capponuts'Shop" width={150} height={150} className="mb-2 mt-4 animate-bounce-in shadow-2xl" style={{filter:'drop-shadow(0 8px 32px #fbbf24)'}} priority />
          </div>
        )}
      </div>
    );
  }

  // Filtrage des produits par catégorie (à adapter si tu ajoutes la catégorie dans chaque produit)
  const filteredProducts = selectedCategory === "Toutes catégories"
    ? products
    : products.filter((p) => (p.category === selectedCategory));

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header Amazon-style - Optimisé mobile */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-3">
          <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-4 w-full">
            <span className="flex items-center select-none">
              <Image src="/logo.png" alt="Logo Capponuts'Shop" width={36} height={36} className="mr-2 w-9 h-9 object-contain" priority />
              <span className="text-xl sm:text-2xl font-extrabold text-white tracking-tight" style={{fontFamily: 'var(--font-montserrat)'}}>
                Capponuts&rsquo;Shop
              </span>
              <span className="ml-3 inline-block bg-red-600 text-white text-xs sm:text-sm font-bold px-2 py-1 rounded shadow-sm align-middle animate-pulse" style={{letterSpacing: '0.05em'}}>
                -50%
              </span>
            </span>
          </div>
        </div>
      </header>

      {/* Message d'accueil personnalisé */}
      <div className="max-w-2xl mx-auto mt-4 mb-6 p-4 bg-orange-100 text-orange-900 rounded-xl shadow text-center font-semibold text-lg">
        🎉 Bienvenue sur la boutique privée de Capponuts !
      </div>

      {/* Menu déroulant catégories - visible uniquement sur mobile */}
      <div className="block sm:hidden w-full sticky top-[64px] z-20 bg-white px-2 pt-3 shadow-md border-b border-gray-200">
        <select
          className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 text-base"
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Barre horizontale catégories - masquée sur mobile */}
      <nav className="bg-gray-700 text-white text-xs sm:text-sm overflow-x-auto hidden sm:block">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2">
          <div className="flex items-center gap-3 sm:gap-6 whitespace-nowrap">
            <span className="hover:text-orange-400 cursor-pointer flex items-center">
              <Menu className="w-4 h-4 mr-1" />
              Toutes les catégories
            </span>
            <span className="hover:text-orange-400 cursor-pointer">📱 High-Tech</span>
            <span className="hover:text-orange-400 cursor-pointer">🏠 Cuisine et Maison</span>
            <span className="hover:text-orange-400 cursor-pointer">🚗 Auto et Moto</span>
            <span className="hover:text-orange-400 cursor-pointer">💻 Informatique</span>
            <span className="hover:text-orange-400 cursor-pointer">🔧 Bricolage</span>
            <span className="hover:text-orange-400 cursor-pointer">👕 Mode</span>
            <span className="hover:text-orange-400 cursor-pointer">⚽ Sports et Loisirs</span>
            <span className="hover:text-orange-400 cursor-pointer">💡 Luminaires</span>
            <span className="hover:text-orange-400 cursor-pointer">🌱 Jardin</span>
          </div>
        </div>
      </nav>

      {/* Grille des produits - responsive amélioré */}
      <main className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <div className="mb-4 sm:mb-6 bg-gray-800 p-3 sm:p-4 rounded-lg">
          <h2 className="text-white text-lg sm:text-xl font-bold mb-2">
            Catalogue des articles disponibles
            {selectedCategory !== "Toutes catégories" && (
              <span className="ml-2 text-orange-400">- {selectedCategory}</span>
            )}
          </h2>
          <p className="text-gray-300 text-sm">
            💬 Pour commander un article, contactez-moi par message • 📱 Paiement et livraison à convenir
          </p>
        </div>
        
        <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {paginatedProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow transition-transform duration-200 hover:scale-105 hover:shadow-2xl overflow-hidden group cursor-pointer product-card"
            >
              {/* Image du produit */}
              <div className="relative h-32 sm:h-48 bg-gray-100 p-2 sm:p-4">
                {product.image && product.image.startsWith('http') ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain p-2 sm:p-4"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-2xl sm:text-4xl">
                    📷
                  </div>
                )}
              </div>

              {/* Informations du produit */}
              <div className="p-2 sm:p-3">
                <h3 className="text-xs sm:text-sm font-medium text-gray-800 mb-1 sm:mb-2 line-clamp-2 group-hover:text-orange-600">
                  {product.name}
                </h3>
                
                {/* Rating - Caché sur très petit écran */}
                <div className="hidden sm:block">
                  <StarRating rating={product.rating} reviews={product.reviews} />
                </div>
                
                {/* Prix */}
                <div className="mt-1 sm:mt-2">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <span className="text-xl sm:text-2xl font-black text-red-600 bg-yellow-300 px-2 py-1 rounded-lg shadow-md border-2 border-red-500">
                      {product.price}€
                    </span>
                    <span className="text-xs text-gray-500 line-through font-bold">
                      {product.originalPrice}€
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 mt-1 flex items-center">
                    <Truck className="w-3 h-3 mr-1" />
                    Livraison possible
                  </div>
                </div>

                {/* Description - Cachée sur mobile */}
                <p className="hidden sm:block text-xs text-gray-600 mt-2 line-clamp-2">
                  {product.description}
                </p>

                {/* Bouton d'action */}
                <a 
                  href={product.amazonLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full mt-2 sm:mt-3 bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold py-1.5 sm:py-2 px-2 sm:px-4 rounded text-xs sm:text-sm transition-colors amazon-button flex items-center justify-center"
                >
                  <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  Article Sur Amazon
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-gray-200 text-gray-700 font-bold disabled:opacity-50"
          >
            Précédent
          </button>
          <span className="font-semibold text-gray-700">Page {currentPage} / {totalPages}</span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-gray-200 text-gray-700 font-bold disabled:opacity-50"
          >
            Suivant
          </button>
        </div>

        {/* Message si aucun produit dans la catégorie */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-4xl mb-4">📦</div>
            <h3 className="text-white text-lg font-medium mb-2">Aucun produit dans cette catégorie</h3>
            <p className="text-gray-400">D&apos;autres articles seront bientôt ajoutés !</p>
          </div>
        )}
      </main>

      {/* Footer simple en bas de page */}
      <footer className="w-full flex items-center justify-center py-2 bg-gray-900 border-t border-gray-800">
        <Image src="/logo.png" alt="Logo Capponuts'Shop" width={28} height={28} className="mr-2 w-7 h-7 object-contain" />
        <span className="text-gray-400 text-sm font-semibold">Capponuts&rsquo;Shop &copy; {new Date().getFullYear()}</span>
      </footer>

      {/* Image capponuts.png avant le footer */}
      <div className="flex justify-center mb-2 mt-8">
        <Image src="/capponuts.png" alt="Capponuts" width={180} height={180} className="object-contain rounded-full shadow" />
      </div>

      <a
        href="https://wa.me/33658657987"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-0 right-0 z-50 flex items-center group w-16 h-16 p-3 whatsapp-float"
        aria-label="Contact WhatsApp"
        style={{ textDecoration: 'none', borderRadius: '50%' }}
      >
        <span className="bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg p-3 flex items-center justify-center transition-colors duration-200" style={{ boxShadow: '0 4px 16px 0 rgba(0,0,0,0.15)' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 32 32" fill="currentColor">
            <path d="M16 3C9.373 3 4 8.373 4 15c0 2.637.86 5.08 2.36 7.13L4 29l7.13-2.36A11.93 11.93 0 0 0 16 27c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 22c-1.98 0-3.89-.58-5.5-1.67l-.39-.25-4.23 1.4 1.4-4.23-.25-.39A9.94 9.94 0 0 1 6 15c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10zm5.07-7.75c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.32.42-.48.14-.16.18-.28.28-.46.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47-.16-.01-.34-.01-.52-.01-.18 0-.48.07-.73.34-.25.27-.97.95-.97 2.3 0 1.35.99 2.65 1.13 2.83.14.18 1.95 2.98 4.73 4.06.66.28 1.18.45 1.58.58.66.21 1.26.18 1.73.11.53-.08 1.65-.67 1.88-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.18-.53-.32z"/>
          </svg>
        </span>
        <span className="ml-2 text-green-600 font-bold text-base rounded px-2 py-1 bg-white shadow group-hover:opacity-100 opacity-0 transition-opacity duration-200 sm:opacity-0 sm:group-hover:opacity-100 block sm:block">
          WhatsApp
        </span>
      </a>
    </div>
  );
}

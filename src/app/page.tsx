"use client";

import { 
  Star, 
  StarHalf, 
  Menu, 
  Truck, 
  ExternalLink
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

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
    id: 12,
    name: "Écouteurs Bluetooth sans Fil Sport, Casque à Clip Ouverts,3D HiFi Stéréo, Bluetooth 5.4,IP5,EQ Dynamique, Écouteurs Ouverts sans Fil,Léger et Stable Seulement 4.8 g pour Running",
    description: "Écouteurs sport ultra-légers (4.8g) avec clip ouvert, son stéréo 3D HiFi, Bluetooth 5.4, protection IP5, égaliseur dynamique, parfaits pour le running",
    price: 20,
    originalPrice: 39.99,
    rating: 4.3,
    reviews: 45,
    category: "High-Tech",
    image: "https://m.media-amazon.com/images/W/MEDIAX_1215821-T1/images/I/61k15mvx7wL._AC_SX679_.jpg",
    amazonLink: "https://www.amazon.fr/dp/B0F62S2YHT?th=1"
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
    id: 16,
    name: "Drift Voiture avec Lumière LED, Voiture télécommandée pour Enfants de Plus de 8+ Ans",
    description: "Voiture télécommandée avec effets lumineux LED, parfaite pour les enfants de 8 ans et plus, maniable et amusante",
    price: 15,
    originalPrice: 36.99,
    rating: 4.4,
    reviews: 32,
    category: "Jeux et Jouets",
    image: "https://m.media-amazon.com/images/W/MEDIAX_1215821-T1/images/I/71rYzQFN9vL._AC_SX679_.jpg",
    amazonLink: "https://www.amazon.fr/dp/B0F2FLC1FL?th=1"
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

const LogoCapponuts = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
    <rect x="4" y="10" width="24" height="16" rx="4" fill="#2563eb"/>
    <rect x="4" y="18" width="24" height="8" rx="4" fill="#fbbf24"/>
    <rect x="10" y="6" width="12" height="8" rx="6" fill="#60a5fa"/>
    <rect x="13" y="2" width="6" height="8" rx="3" fill="#fbbf24"/>
  </svg>
);

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Toutes catégories");

  // Filtrer les produits selon la catégorie sélectionnée
  const filteredProducts = selectedCategory === "Toutes catégories" 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header Amazon-style - Optimisé mobile */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-3">
          <div className="flex items-center justify-between gap-2">
            {/* Logo et nom boutique */}
            <div className="flex items-center gap-2 sm:gap-4">
              <button className="md:hidden text-white p-2">
                <Menu className="w-5 h-5" />
              </button>
              <span className="flex items-center select-none">
                <LogoCapponuts />
                <span className="text-xl sm:text-2xl font-extrabold text-white tracking-tight" style={{fontFamily: 'var(--font-montserrat)'}}>
                  Capponuts&rsquo;Shop
                </span>
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation secondaire - Responsive */}
      <nav className="bg-gray-700 text-white text-xs sm:text-sm overflow-x-auto hidden sm:block">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2">
          <div className="flex items-center gap-3 sm:gap-6 whitespace-nowrap">
            <button 
              onClick={() => setSelectedCategory("Toutes catégories")}
              className={`hover:text-orange-400 cursor-pointer flex items-center ${selectedCategory === "Toutes catégories" ? "text-orange-400" : ""}`}
            >
              <Menu className="w-4 h-4 mr-1" />
              Toutes les catégories
            </button>
            <button 
              onClick={() => setSelectedCategory("High-Tech")}
              className={`hover:text-orange-400 cursor-pointer ${selectedCategory === "High-Tech" ? "text-orange-400" : ""}`}
            >
              📱 High-Tech
            </button>
            <button 
              onClick={() => setSelectedCategory("Cuisine et Maison")}
              className={`hover:text-orange-400 cursor-pointer ${selectedCategory === "Cuisine et Maison" ? "text-orange-400" : ""}`}
            >
              🏠 Cuisine et Maison
            </button>
            <button 
              onClick={() => setSelectedCategory("Auto et Moto")}
              className={`hover:text-orange-400 cursor-pointer ${selectedCategory === "Auto et Moto" ? "text-orange-400" : ""}`}
            >
              🚗 Auto et Moto
            </button>
            <button 
              onClick={() => setSelectedCategory("Informatique")}
              className={`hover:text-orange-400 cursor-pointer ${selectedCategory === "Informatique" ? "text-orange-400" : ""}`}
            >
              💻 Informatique
            </button>
            <button 
              onClick={() => setSelectedCategory("Bricolage")}
              className={`hover:text-orange-400 cursor-pointer ${selectedCategory === "Bricolage" ? "text-orange-400" : ""}`}
            >
              🔧 Bricolage
            </button>
            <button 
              onClick={() => setSelectedCategory("Mode")}
              className={`hover:text-orange-400 cursor-pointer ${selectedCategory === "Mode" ? "text-orange-400" : ""}`}
            >
              👕 Mode
            </button>
            <button 
              onClick={() => setSelectedCategory("Sports et Loisirs")}
              className={`hover:text-orange-400 cursor-pointer ${selectedCategory === "Sports et Loisirs" ? "text-orange-400" : ""}`}
            >
              ⚽ Sports et Loisirs
            </button>
            <button 
              onClick={() => setSelectedCategory("Beauté et Soins")}
              className={`hover:text-orange-400 cursor-pointer ${selectedCategory === "Beauté et Soins" ? "text-orange-400" : ""}`}
            >
              💄 Beauté et Soins
            </button>
            <button 
              onClick={() => setSelectedCategory("Luminaires")}
              className={`hover:text-orange-400 cursor-pointer ${selectedCategory === "Luminaires" ? "text-orange-400" : ""}`}
            >
              💡 Luminaires
            </button>
            <button 
              onClick={() => setSelectedCategory("Jeux et Jouets")}
              className={`hover:text-orange-400 cursor-pointer ${selectedCategory === "Jeux et Jouets" ? "text-orange-400" : ""}`}
            >
              🧸 Jeux et Jouets
            </button>
          </div>
        </div>
      </nav>

      {/* Grille des produits - Responsive optimisé */}
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
        
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg hover:shadow-lg transition-all duration-200 overflow-hidden group cursor-pointer product-card"
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
                {/* Badge en stock */}
                <div className="absolute top-1 sm:top-2 left-1 sm:left-2 bg-green-600 text-white text-xs px-1 sm:px-2 py-0.5 sm:py-1 rounded z-10">
                  EN STOCK
                </div>
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
                    <span className="text-xs text-gray-400 line-through ml-2">
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

        {/* Message si aucun produit dans la catégorie */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-4xl mb-4">📦</div>
            <h3 className="text-white text-lg font-medium mb-2">Aucun produit dans cette catégorie</h3>
            <p className="text-gray-400">D&apos;autres articles seront bientôt ajoutés !</p>
          </div>
        )}
      </main>
    </div>
  );
}

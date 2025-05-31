"use client";

import { 
  Search, 
  Star, 
  StarHalf, 
  Menu, 
  MapPin, 
  Truck, 
  CreditCard, 
  Mail, 
  Phone,
  ExternalLink,
  MessageCircle
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
            {/* Logo et menu mobile */}
            <div className="flex items-center gap-2 sm:gap-4">
              <button className="md:hidden text-white p-2">
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-lg sm:text-2xl font-bold text-white">
                🛍️ Capponuts
              </h1>
              <div className="hidden lg:block text-gray-300 text-sm">
                <MapPin className="w-4 h-4 inline mr-1" />
                Catalogue en ligne
              </div>
            </div>
            
            {/* Barre de recherche - Responsive */}
            <div className="flex-1 max-w-2xl mx-2 sm:mx-4 lg:mx-8">
              <div className="flex w-full">
                <select 
                  className="hidden sm:block bg-gray-200 text-gray-800 px-2 lg:px-3 py-2 rounded-l-md border-r border-gray-300 text-xs lg:text-sm"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option>Toutes catégories</option>
                  <option>High-Tech</option>
                  <option>Cuisine et Maison</option>
                  <option>Auto et Moto</option>
                  <option>Informatique</option>
                  <option>Bricolage</option>
                  <option>Mode</option>
                  <option>Sports et Loisirs</option>
                  <option>Hygiène et Santé</option>
                  <option>Beauté et Soins</option>
                  <option>Jardin</option>
                  <option>Jeux et Jouets</option>
                </select>
                <input 
                  type="text" 
                  placeholder="Rechercher..."
                  className="flex-1 px-2 sm:px-4 py-2 text-gray-800 focus:outline-none text-sm search-input sm:rounded-l-md"
                />
                <button className="bg-orange-400 hover:bg-orange-500 px-3 sm:px-4 py-2 rounded-r-md transition-colors">
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-800" />
                </button>
              </div>
            </div>

            {/* Actions utilisateur - Mobile optimisé */}
            <div className="flex items-center gap-2 sm:gap-4 text-white text-xs sm:text-sm">
              <div className="relative">
                <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />
                <span className="absolute -top-1 -right-1 bg-orange-400 text-gray-800 text-xs rounded-full w-3 h-3 sm:w-4 sm:h-4 flex items-center justify-center font-bold">
                  !
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation secondaire - Responsive */}
      <nav className="bg-gray-700 text-white text-xs sm:text-sm overflow-x-auto">
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

        {/* Footer Amazon-style - Responsive */}
        <footer className="mt-8 sm:mt-16 bg-gray-800 text-white p-4 sm:p-8 rounded-lg">
          <div className="text-center">
            <h3 className="text-lg font-bold mb-4">La Boutique de Capponuts</h3>
            <div className="mb-6 p-4 bg-orange-500 text-gray-900 rounded-lg">
              <h4 className="font-bold mb-2">💬 Comment commander ?</h4>
              <p className="text-sm">
                Contactez-moi par message pour réserver un article • Prix négociables • Paiement à la livraison ou remise en main propre
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-sm">
              <div>
                <h4 className="font-bold mb-2 text-orange-400 flex items-center justify-center sm:justify-start">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Paiement
                </h4>
                <p className="flex items-center justify-center sm:justify-start">
                  <CreditCard className="w-3 h-3 mr-1" />
                  Espèces ou virement
                </p>
                <p>💰 Prix négociables</p>
              </div>
              <div>
                <h4 className="font-bold mb-2 text-orange-400 flex items-center justify-center sm:justify-start">
                  <Truck className="w-4 h-4 mr-2" />
                  Livraison
                </h4>
                <p className="flex items-center justify-center sm:justify-start">
                  <Truck className="w-3 h-3 mr-1" />
                  Livraison possible
                </p>
                <p>🤝 Remise en main propre</p>
              </div>
              <div>
                <h4 className="font-bold mb-2 text-orange-400 flex items-center justify-center sm:justify-start">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact
                </h4>
                <p className="flex items-center justify-center sm:justify-start">
                  <Mail className="w-3 h-3 mr-1" />
                  kevin@capponi.fr
                </p>
                <p className="flex items-center justify-center sm:justify-start">
                  <Phone className="w-3 h-3 mr-1" />
                  06 58 65 79 87
                </p>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

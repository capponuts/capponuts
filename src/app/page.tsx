import { 
  Search, 
  Star, 
  StarHalf, 
  Menu, 
  User, 
  MapPin, 
  Truck, 
  CreditCard, 
  Mail, 
  Phone,
  ExternalLink,
  MessageCircle
} from "lucide-react";

// Données des produits (vous pourrez les modifier facilement)
const products = [
  {
    id: 1,
    name: "Vase vintage en céramique",
    description: "Magnifique vase en céramique des années 70, parfait état",
    price: 25,
    originalPrice: 35,
    rating: 4.5,
    reviews: 12,
    image: "/products/vase.jpg",
    amazonLink: "https://amazon.fr/dp/exemple1"
  },
  {
    id: 2,
    name: "Livre ancien de cuisine",
    description: "Livre de recettes traditionelles, édition 1960",
    price: 15,
    originalPrice: 22,
    rating: 4.8,
    reviews: 8,
    image: "/products/livre.jpg",
    amazonLink: "https://amazon.fr/dp/exemple2"
  },
  {
    id: 3,
    name: "Lampe de bureau rétro",
    description: "Lampe de bureau style industriel, fonctionne parfaitement",
    price: 45,
    originalPrice: 65,
    rating: 4.3,
    reviews: 15,
    image: "/products/lampe.jpg",
    amazonLink: "https://amazon.fr/dp/exemple3"
  },
  {
    id: 4,
    name: "Service à thé porcelaine",
    description: "Service à thé complet pour 6 personnes, motifs floraux",
    price: 35,
    originalPrice: 50,
    rating: 4.7,
    reviews: 6,
    image: "/products/service-the.jpg",
    amazonLink: "https://amazon.fr/dp/exemple4"
  },
  {
    id: 5,
    name: "Cadre photo vintage",
    description: "Cadre en bois doré, style baroque, 20x30cm",
    price: 18,
    originalPrice: 25,
    rating: 4.2,
    reviews: 9,
    image: "/products/cadre.jpg",
    amazonLink: "https://amazon.fr/dp/exemple5"
  },
  {
    id: 6,
    name: "Boîte à bijoux ancienne",
    description: "Boîte à bijoux en velours rouge, compartiments multiples",
    price: 22,
    originalPrice: 30,
    rating: 4.6,
    reviews: 11,
    image: "/products/boite-bijoux.jpg",
    amazonLink: "https://amazon.fr/dp/exemple6"
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
                <select className="hidden sm:block bg-gray-200 text-gray-800 px-2 lg:px-3 py-2 rounded-l-md border-r border-gray-300 text-xs lg:text-sm">
                  <option>Toutes catégories</option>
                  <option>High-Tech</option>
                  <option>Cuisine et Maison</option>
                  <option>Auto et Moto</option>
                  <option>Informatique</option>
                  <option>Bricolage</option>
                  <option>Mode</option>
                  <option>Sports et Loisirs</option>
                  <option>Hygiène et Santé</option>
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

      {/* Grille des produits - Responsive optimisé */}
      <main className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <div className="mb-4 sm:mb-6 bg-gray-800 p-3 sm:p-4 rounded-lg">
          <h2 className="text-white text-lg sm:text-xl font-bold mb-2">
            Catalogue des articles disponibles
          </h2>
          <p className="text-gray-300 text-sm">
            💬 Pour commander un article, contactez-moi par message • 📱 Paiement et livraison à convenir
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg hover:shadow-lg transition-all duration-200 overflow-hidden group cursor-pointer product-card"
            >
              {/* Image du produit */}
              <div className="relative h-32 sm:h-48 bg-gray-100 p-2 sm:p-4">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-2xl sm:text-4xl">
                  📷
                </div>
                {/* Badge en stock */}
                <div className="absolute top-1 sm:top-2 left-1 sm:left-2 bg-green-600 text-white text-xs px-1 sm:px-2 py-0.5 sm:py-1 rounded">
                  EN STOCK
                </div>
                {/* Quand vous aurez vos vraies images, décommentez ceci :
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain p-2 sm:p-4"
                />
                */}
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
                    <span className="text-sm sm:text-lg font-bold text-green-600">
                      {product.price}€
                    </span>
                    <span className="text-xs text-gray-500 line-through">
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

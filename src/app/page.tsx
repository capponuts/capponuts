import Image from "next/image";

// Données des produits (vous pourrez les modifier facilement)
const products = [
  {
    id: 1,
    name: "Vase vintage en céramique",
    description: "Magnifique vase en céramique des années 70, parfait état",
    price: 25,
    image: "/products/vase.jpg" // Vous ajouterez vos vraies images plus tard
  },
  {
    id: 2,
    name: "Livre ancien de cuisine",
    description: "Livre de recettes traditionelles, édition 1960",
    price: 15,
    image: "/products/livre.jpg"
  },
  {
    id: 3,
    name: "Lampe de bureau rétro",
    description: "Lampe de bureau style industriel, fonctionne parfaitement",
    price: 45,
    image: "/products/lampe.jpg"
  },
  {
    id: 4,
    name: "Service à thé porcelaine",
    description: "Service à thé complet pour 6 personnes, motifs floraux",
    price: 35,
    image: "/products/service-the.jpg"
  },
  {
    id: 5,
    name: "Cadre photo vintage",
    description: "Cadre en bois doré, style baroque, 20x30cm",
    price: 18,
    image: "/products/cadre.jpg"
  },
  {
    id: 6,
    name: "Boîte à bijoux ancienne",
    description: "Boîte à bijoux en velours rouge, compartiments multiples",
    price: 22,
    image: "/products/boite-bijoux.jpg"
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-amber-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-amber-800 text-center">
            🛍️ La Boutique de Capponuts
          </h1>
          <p className="text-center text-amber-600 mt-2 text-lg">
            Trésors et objets uniques trouvés avec amour
          </p>
        </div>
      </header>

      {/* Grille des produits */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-amber-200"
            >
              {/* Image du produit */}
              <div className="relative h-64 bg-gray-200">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  📷 Image à venir
                </div>
                {/* Quand vous aurez vos vraies images, décommentez ceci :
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                */}
              </div>

              {/* Informations du produit */}
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {product.description}
                </p>
                
                {/* Prix et bouton */}
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-amber-600">
                    {product.price}€
                  </span>
                  <button className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium">
                    Contacter
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer simple */}
        <footer className="mt-16 text-center text-amber-700">
          <p className="text-lg font-medium">
            💌 Pour acheter un article, contactez-moi !
          </p>
          <p className="text-sm mt-2 text-amber-600">
            Paiement sécurisé • Livraison possible • Remise en main propre
          </p>
        </footer>
      </main>
    </div>
  );
}

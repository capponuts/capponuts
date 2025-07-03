"use client";

import { Calendar, MapPin, Ship, Clock, ExternalLink } from "lucide-react";

export default function CroisierePage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Vidéo YouTube en arrière-plan full screen */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
        <iframe
          className="absolute top-0 left-0 w-full h-full border-0"
          src="https://www.youtube.com/embed/HKMlDj_Wruo?autoplay=1&mute=1&loop=1&playlist=HKMlDj_Wruo&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&disablekb=1&fs=0&start=15&enablejsapi=1&origin=*"
          title="MSC Croisières - Vidéo de fond"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          style={{
            width: '300%',
            height: '300%',
            marginLeft: '-100%',
            marginTop: '-100%',
            objectFit: 'cover'
          }}
        />
      </div>

      {/* Fallback avec fond vidéo alternatif si YouTube ne marche pas */}
      <div className="fixed inset-0 w-full h-full z-0" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #06b6d4 100%)' }}>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      </div>

      {/* Overlay sombre pour améliorer la lisibilité */}
      <div className="fixed inset-0 bg-black bg-opacity-40 z-10"></div>

      {/* Contenu superposé */}
      <div className="relative z-20 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-6 bg-gradient-to-b from-black/60 to-transparent">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-2xl">
              🚢 Croisière MSC
            </h1>
            <p className="text-xl md:text-2xl text-white/90 drop-shadow-lg">
              Méditerranée Occidentale
            </p>
          </div>
        </header>

        {/* Contenu principal centré */}
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-4xl w-full">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Informations de la croisière */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <Ship className="text-blue-600" />
                  Détails de la Croisière
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Ship className="text-blue-600 w-5 h-5 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-800">Compagnie</p>
                      <p className="text-gray-600">MSC Croisières</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Ship className="text-blue-600 w-5 h-5 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-800">Navire</p>
                      <p className="text-gray-600">MSC Meraviglia</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Clock className="text-blue-600 w-5 h-5 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-800">Durée</p>
                      <p className="text-gray-600">8 Jours</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Calendar className="text-blue-600 w-5 h-5 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-800">Dates</p>
                      <p className="text-gray-600">du 04/05/2026 au 11/05/2026</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <MapPin className="text-blue-600 w-5 h-5 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-800">Ville de départ</p>
                      <p className="text-gray-600">Marseille</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <MapPin className="text-blue-600 w-5 h-5 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-800">Ville de retour</p>
                      <p className="text-gray-600">Marseille</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Itinéraire */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <MapPin className="text-blue-600" />
                  Escales
                </h2>
                
                <div className="space-y-3">
                  {[
                    "Marseille",
                    "Barcelone", 
                    "En mer",
                    "Tunis (La Goulette)",
                    "Sicile (Palerme)",
                    "Naples",
                    "Florence (Livourne)",
                    "Marseille"
                  ].map((escale, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <p className="text-gray-800 font-medium">{escale}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bouton de réservation */}
            <div className="mt-8 text-center">
              <a 
                href="https://croisiere.promovacances.com/fr/sejour-croisiere/mediterranee-occidentale-msc-croisieres-msc-meraviglia/id,3349359/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-8 rounded-full text-lg shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <Ship className="w-6 h-6" />
                Voir et Réserver la Croisière
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="p-6 bg-gradient-to-t from-black/60 to-transparent">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-white/80 drop-shadow-lg">
              MSC Croisières • MSC Meraviglia • 04-11 Mai 2026 • Méditerranée Occidentale
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
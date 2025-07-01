"use client";

import Image from "next/image";
import { Calendar, MapPin, Users, Euro, Ship, Clock } from "lucide-react";

export default function CroisierePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header avec logo */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="Logo Capponuts" width={50} height={50} className="rounded-full" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Capponuts&apos;Shop</h1>
                <p className="text-sm text-gray-600">Présente</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Du 10 au 17 Mai 2026</p>
              <p className="text-lg font-semibold text-blue-600">8 jours • 7 nuits</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <Image
          src="/croisiere/itineraire-carte.jpg"
          alt="Carte itinéraire de la croisière"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">🚢 Croisière de Capponuts !</h1>
            <p className="text-2xl font-light mb-2">France • Espagne • Tunisie • Italie</p>
            <p className="text-xl">Plus on est de fous, plus on rit ! 🎉</p>
          </div>
        </div>
      </section>

      {/* Informations principales */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Détails de la croisière */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <Ship className="text-blue-600" />
              Détails de la Croisière
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="text-blue-600 w-5 h-5" />
                <div>
                  <p className="font-semibold">Dates</p>
                  <p className="text-gray-600">Du 10 Mai au 17 Mai 2026</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock className="text-blue-600 w-5 h-5" />
                <div>
                  <p className="font-semibold">Durée</p>
                  <p className="text-gray-600">8 jours / 7 nuits</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <MapPin className="text-blue-600 w-5 h-5" />
                <div>
                  <p className="font-semibold">Départ</p>
                  <p className="text-gray-600">Marseille, France</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Ship className="text-blue-600 w-5 h-5" />
                <div>
                  <p className="font-semibold">Navire</p>
                  <p className="text-gray-600">Costa Smeralda ⭐⭐⭐⭐⭐</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Euro className="text-green-600 w-5 h-5" />
                <div>
                  <p className="font-semibold">Prix</p>
                  <p className="text-2xl font-bold text-green-600">À partir de 869€</p>
                  <p className="text-sm text-gray-500">par personne (prix actuel)</p>
                </div>
              </div>
            </div>
          </div>

                                {/* Le navire Costa Smeralda */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">🛳️ Costa Smeralda</h2>
              <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                <Image
                  src="/croisiere/costa-smeralda.jpg"
                  alt="Costa Smeralda"
                  fill
                  className="object-cover"
                />
              </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold">Capacité</p>
                <p className="text-gray-600">6 518 passagers</p>
              </div>
              <div>
                <p className="font-semibold">Longueur</p>
                <p className="text-gray-600">337 mètres</p>
              </div>
              <div>
                <p className="font-semibold">Piscines</p>
                <p className="text-gray-600">4 piscines</p>
              </div>
              <div>
                <p className="font-semibold">Ponts</p>
                <p className="text-gray-600">20 ponts</p>
              </div>
            </div>
                         <p className="text-gray-600 mt-4 text-sm">
               Le Costa Smeralda incarne l&apos;hospitalité italienne avec ses espaces inspirés des places emblématiques d&apos;Italie. 
               Navire écologique propulsé au Gaz Naturel Liquéfié.
             </p>
          </div>
        </div>

        {/* Itinéraire */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">🗺️ Notre Itinéraire</h2>
          
          <div className="grid md:grid-cols-4 gap-6">
                                      {/* Barcelone */}
              <div className="text-center">
                <div className="relative h-32 mb-4 rounded-lg overflow-hidden">
                  <Image
                    src="/croisiere/barcelone.jpg"
                    alt="Barcelone"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="font-bold text-lg text-gray-800">🇪🇸 Barcelone</h3>
                <p className="text-sm text-gray-600">Jour 2 • 09h-19h</p>
                <p className="text-xs text-gray-500 mt-2">Sagrada Família, Las Ramblas, Parc Güell</p>
              </div>

              {/* Tunisie */}
              <div className="text-center">
                <div className="relative h-32 mb-4 rounded-lg overflow-hidden">
                  <Image
                    src="/croisiere/tunisie.jpg"
                    alt="La Goulette - Tunisie"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="font-bold text-lg text-gray-800">🇹🇳 Tunis (La Goulette)</h3>
                <p className="text-sm text-gray-600">Jour 4 • 08h-16h</p>
                <p className="text-xs text-gray-500 mt-2">Médina de Tunis, Carthage, Sidi Bou Saïd</p>
              </div>

              {/* Palerme */}
              <div className="text-center">
                <div className="relative h-32 mb-4 rounded-lg overflow-hidden">
                  <Image
                    src="/croisiere/palerme.jpg"
                    alt="Palerme - Sicile"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="font-bold text-lg text-gray-800">🇮🇹 Palerme (Sicile)</h3>
                <p className="text-sm text-gray-600">Jour 5 • 08h-16h30</p>
                <p className="text-xs text-gray-500 mt-2">Cathédrale, Palais des Normands, Marchés</p>
              </div>

                             {/* Rome */}
               <div className="text-center">
                 <div className="relative h-32 mb-4 rounded-lg overflow-hidden">
                   <Image
                     src="/croisiere/rome.jpg"
                     alt="Rome - Civitavecchia"
                     fill
                     className="object-cover"
                   />
                 </div>
                 <h3 className="font-bold text-lg text-gray-800">🇮🇹 Rome (Civitavecchia)</h3>
                 <p className="text-sm text-gray-600">Jour 6 • 08h-16h30</p>
                 <p className="text-xs text-gray-500 mt-2">Colisée, Vatican, Fontaine de Trevi</p>
               </div>
          </div>

                     <div className="mt-8 p-4 bg-blue-50 rounded-lg">
             <h4 className="font-bold text-center mb-2 text-blue-800">📅 Programme Complet</h4>
             <div className="grid md:grid-cols-2 gap-4 text-sm">
               <div>
                 <p className="text-gray-800"><strong className="text-blue-700">Jour 1 (10 Mai) :</strong> Marseille - Embarquement à 18h</p>
                 <p className="text-gray-800"><strong className="text-blue-700">Jour 2 (11 Mai) :</strong> Barcelone 09h-19h</p>
                 <p className="text-gray-800"><strong className="text-blue-700">Jour 3 (12 Mai) :</strong> En mer - Navigation</p>
                 <p className="text-gray-800"><strong className="text-blue-700">Jour 4 (13 Mai) :</strong> Tunis (La Goulette) 08h-16h</p>
               </div>
               <div>
                 <p className="text-gray-800"><strong className="text-blue-700">Jour 5 (14 Mai) :</strong> Palerme (Sicile) 08h-16h30</p>
                 <p className="text-gray-800"><strong className="text-blue-700">Jour 6 (15 Mai) :</strong> Rome (Civitavecchia) 08h-16h30</p>
                 <p className="text-gray-800"><strong className="text-blue-700">Jour 7 (16 Mai) :</strong> Savone (Italie) 08h30-17h30</p>
                 <p className="text-gray-800"><strong className="text-blue-700">Jour 8 (17 Mai) :</strong> Marseille - Débarquement à 09h</p>
               </div>
             </div>
           </div>
        </div>

        {/* Types de cabines */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">🏨 Types de Cabines</h2>
          
                                <div className="grid md:grid-cols-2 gap-8">
              <div className="relative h-48 rounded-lg overflow-hidden">
                <Image
                  src="/croisiere/cabine-balcon.jpg"
                  alt="Cabine avec balcon"
                  fill
                  className="object-cover"
                />
              </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">🏠 Cabines Disponibles</h3>
                             <div className="space-y-3">
                 <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                   <span className="text-gray-800 font-medium">Cabine Intérieure</span>
                   <span className="font-bold text-green-600">À partir de 869€</span>
                 </div>
                 <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                   <span className="text-gray-800 font-medium">Cabine Extérieure</span>
                   <span className="font-bold text-green-600">À partir de 999€</span>
                 </div>
                 <div className="flex justify-between items-center p-3 bg-blue-50 rounded border-2 border-blue-200">
                   <span className="text-blue-800 font-bold">Cabine Balcon ⭐</span>
                   <span className="font-bold text-blue-600">À partir de 1299€</span>
                 </div>
                 <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                   <span className="text-gray-800 font-medium">Suite</span>
                   <span className="font-bold text-purple-600">À partir de 1899€</span>
                 </div>
               </div>
              
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <h4 className="font-bold text-green-800 mb-2">✅ Inclus dans le prix :</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Pension complète (tous les repas)</li>
                  <li>• Activités et animations à bord</li>
                  <li>• Spectacles et soirées</li>
                  <li>• Taxes portuaires</li>
                  <li>• Service en cabine 24h/24</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

                 {/* Appel à l&apos;action */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-8 text-white text-center">
                     <h2 className="text-4xl font-bold mb-4">🎉 Rejoignez l&apos;Aventure Capponuts !</h2>
          <p className="text-xl mb-6">Plus on est de fous, plus on rit ! Venez vivre une semaine inoubliable avec nous.</p>
          
                     <div className="grid md:grid-cols-3 gap-6 mb-8">
             <div className="bg-blue-800 bg-opacity-80 rounded-lg p-4 text-white border border-white border-opacity-30">
               <Users className="mx-auto mb-2 w-8 h-8 text-white" />
               <h3 className="font-bold text-white">Ambiance Conviviale</h3>
               <p className="text-sm text-white opacity-90">Retrouvailles, rires et bonne humeur garantis !</p>
             </div>
             <div className="bg-blue-800 bg-opacity-80 rounded-lg p-4 text-white border border-white border-opacity-30">
               <MapPin className="mx-auto mb-2 w-8 h-8 text-white" />
               <h3 className="font-bold text-white">Destinations de Rêve</h3>
               <p className="text-sm text-white opacity-90">4 pays, 6 escales, des souvenirs pour la vie</p>
             </div>
             <div className="bg-blue-800 bg-opacity-80 rounded-lg p-4 text-white border border-white border-opacity-30">
               <Ship className="mx-auto mb-2 w-8 h-8 text-white" />
               <h3 className="font-bold text-white">Navire 5 Étoiles</h3>
               <p className="text-sm text-white opacity-90">Tout le confort à bord du Costa Smeralda</p>
             </div>
           </div>
          
                     <div className="bg-blue-800 bg-opacity-80 rounded-lg p-6 mb-6 border border-white border-opacity-30">
             <h3 className="text-2xl font-bold mb-4 text-white">💰 Prix de la Croisière</h3>
             <p className="text-3xl font-bold mb-2 text-white">À partir de 869€ par personne</p>
             <p className="text-sm text-white opacity-90">Prix susceptible d&apos;évoluer selon la date de réservation et le type de cabine</p>
           </div>
          
                     <div className="text-center">
             <a 
               href="https://www.abcroisiere.com/croisiere-france-espagne-tunisie-italie-2780582.html"
               target="_blank"
               rel="noopener noreferrer"
               className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-lg inline-flex items-center gap-2 transition-colors"
             >
               <Ship className="w-5 h-5" />
               Voir les détails sur ABC Croisière
             </a>
           </div>
        </div>

        {/* Note importante */}
        <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-2xl">⚠️</span>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-bold text-yellow-800">Important</h3>
              <p className="text-yellow-700">
                Les prix sont donnés à titre indicatif et peuvent évoluer selon la disponibilité et la date de réservation. 
                Pour réserver ou obtenir un devis personnalisé, contactez-moi directement. 
                Réservation groupée possible pour de meilleurs tarifs !
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Image src="/logo.png" alt="Logo Capponuts" width={40} height={40} className="rounded-full" />
                         <span className="text-xl font-bold">Capponuts&apos;Shop</span>
          </div>
                     <p className="text-gray-400">Croisière Capponuts • 10-17 Mai 2026 • Plus on est de fous, plus on rit ! 🎉</p>
          <div className="mt-4">
            <Image src="/capponuts.png" alt="Capponuts" width={60} height={60} className="mx-auto rounded-full" />
          </div>
        </div>
      </footer>
    </div>
  );
}
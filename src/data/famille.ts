export type BoardAnswer = {
  text: string;
  points: number;
};

export type BoardQuestion = {
  id: number;
  question: string;
  answers: BoardAnswer[];
};

// Jeu "Une Famille en Or" – jeu de sondages
// Les points sont indicatifs et peuvent être ajustés
export const FAMILLE_QUESTIONS: BoardQuestion[] = [
  {
    id: 1,
    question: "Une excuse nulle pour être en retard à un date Tinder.",
    answers: [
      { text: "Mon chat m’a jugé", points: 26 },
      { text: "Plus de batterie", points: 18 },
      { text: "GPS m’a perdu", points: 16 },
      { text: "Je gardais mon pain au four", points: 12 },
      { text: "RER capricieux", points: 10 },
      { text: "J’ai confondu droite/gauche", points: 8 },
      { text: "Mon pull faisait grève", points: 6 },
      { text: "Mon chien a mangé mes clés", points: 4 },
    ],
  },
  {
    id: 2,
    question: "Un super‑pouvoir utile seulement dans la vraie vie.",
    answers: [
      { text: "Trouver des places de parking", points: 24 },
      { text: "Ne jamais oublier un prénom", points: 18 },
      { text: "Toujours charger à 100%", points: 16 },
      { text: "Comprendre les médecins", points: 12 },
      { text: "Ranger en un claquement de doigts", points: 10 },
      { text: "Rester calme dans les bouchons", points: 8 },
      { text: "Faire la vaisselle par télépathie", points: 7 },
      { text: "Réchauffer la pizza parfaite", points: 5 },
    ],
  },
  {
    id: 3,
    question: "Quelque chose qu’on fait quand on dit ‘je commence lundi’.",
    answers: [
      { text: "Dernier burger sacré", points: 24 },
      { text: "Acheter un carnet neuf", points: 18 },
      { text: "Regarder des vidéos motivation", points: 16 },
      { text: "Ranger son bureau", points: 12 },
      { text: "Reporter à lundi prochain", points: 12 },
      { text: "Tenue de sport prête", points: 9 },
      { text: "Programmer un réveil ambitieux", points: 6 },
      { text: "Faire une liste de listes", points: 3 },
    ],
  },
  {
    id: 4,
    question: "Un truc qu’on cherche toujours quand on est déjà en retard.",
    answers: [
      { text: "Clés", points: 28 },
      { text: "Téléphone", points: 22 },
      { text: "Portefeuille", points: 16 },
      { text: "Masque / Carte de transport", points: 10 },
      { text: "Écouteurs", points: 8 },
      { text: "Chaussure perdue", points: 6 },
      { text: "Chargeur", points: 5 },
      { text: "Dignité", points: 3 },
    ],
  },
  {
    id: 5,
    question: "Un bruit qui réveille toute la maison.",
    answers: [
      { text: "Verre qui tombe", points: 24 },
      { text: "Notification à fond", points: 18 },
      { text: "Micro‑ondes ‘BIP’", points: 16 },
      { text: "Chasse d’eau Ninja", points: 12 },
      { text: "Rire étouffé raté", points: 10 },
      { text: "Chat à 3h du mat’", points: 8 },
      { text: "Porte qui grince", points: 7 },
      { text: "Nez qui trompette", points: 5 },
    ],
  },
  {
    id: 6,
    question: "Ce que ton pote dit toujours avant une bêtise.",
    answers: [
      { text: "T’inquiète je gère", points: 30 },
      { text: "Ça passe ou ça casse", points: 18 },
      { text: "Filme, filme !", points: 16 },
      { text: "J’ai une idée", points: 12 },
      { text: "Au pire…", points: 8 },
      { text: "On a déjà fait pire", points: 7 },
      { text: "C’est scientifique", points: 5 },
      { text: "J’ai vu sur TikTok", points: 4 },
    ],
  },
  {
    id: 7,
    question: "Une appli sans laquelle tu paniques.",
    answers: [
      { text: "Maps", points: 26 },
      { text: "WhatsApp", points: 20 },
      { text: "Banque", points: 14 },
      { text: "Agenda", points: 12 },
      { text: "Notes", points: 10 },
      { text: "Photos", points: 8 },
      { text: "Transport / SNCF", points: 6 },
      { text: "Météo", points: 4 },
    ],
  },
  {
    id: 8,
    question: "Un aliment qui divise les amis sur une pizza.",
    answers: [
      { text: "Ananas", points: 34 },
      { text: "Olives", points: 16 },
      { text: "Champignons", points: 14 },
      { text: "Chèvre miel", points: 12 },
      { text: "Poivrons", points: 8 },
      { text: "Câpres", points: 6 },
      { text: "Fruits de mer", points: 6 },
      { text: "Maïs", points: 4 },
    ],
  },
  {
    id: 9,
    question: "Un cadeau ‘safe’ quand on n’a pas d’idée.",
    answers: [
      { text: "Carte cadeau", points: 28 },
      { text: "Bougie parfumée", points: 18 },
      { text: "Chocolats", points: 16 },
      { text: "Vin / Bouteille", points: 12 },
      { text: "Plante verte", points: 10 },
      { text: "Mug marrant", points: 8 },
      { text: "Chaussettes stylées", points: 5 },
      { text: "Livre best‑seller", points: 3 },
    ],
  },
  {
    id: 10,
    question: "Un endroit où tu promets de ne plus aller un samedi.",
    answers: [
      { text: "IKEA", points: 28 },
      { text: "Centre commercial", points: 22 },
      { text: "Préfecture", points: 14 },
      { text: "Parc d’attractions", points: 12 },
      { text: "Bord de plage", points: 10 },
      { text: "Supermarché", points: 8 },
      { text: "Quartier touristique", points: 4 },
      { text: "Salle de sport bondée", points: 2 },
    ],
  },
];



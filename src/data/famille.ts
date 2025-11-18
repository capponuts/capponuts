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
    question: "Un métier qu’on rêvait de faire enfant.",
    answers: [
      { text: "Pompier", points: 26 },
      { text: "Vétérinaire", points: 20 },
      { text: "Policier", points: 16 },
      { text: "Professeur", points: 12 },
      { text: "Astronaute", points: 10 },
      { text: "Docteur", points: 8 },
      { text: "Footballeur", points: 5 },
      { text: "Pilote", points: 3 },
    ],
  },
  {
    id: 2,
    question: "Un objet qu’on prête difficilement.",
    answers: [
      { text: "Téléphone", points: 24 },
      { text: "Voiture", points: 20 },
      { text: "Ordinateur", points: 16 },
      { text: "Vêtements", points: 12 },
      { text: "Argent", points: 10 },
      { text: "Casque audio", points: 8 },
      { text: "Livre préféré", points: 6 },
      { text: "Manette", points: 4 },
    ],
  },
  {
    id: 3,
    question: "Une boisson du petit-déjeuner.",
    answers: [
      { text: "Café", points: 30 },
      { text: "Thé", points: 20 },
      { text: "Lait", points: 14 },
      { text: "Jus d’orange", points: 12 },
      { text: "Chocolat chaud", points: 10 },
      { text: "Eau", points: 6 },
      { text: "Smoothie", points: 5 },
      { text: "Cappuccino", points: 3 },
    ],
  },
  {
    id: 4,
    question: "Une appli qu’on ouvre dès le réveil.",
    answers: [
      { text: "Messages", points: 22 },
      { text: "Réseaux sociaux", points: 20 },
      { text: "Météo", points: 16 },
      { text: "Mail", points: 14 },
      { text: "News", points: 10 },
      { text: "Calendrier", points: 8 },
      { text: "Banque", points: 6 },
      { text: "Notes", points: 4 },
    ],
  },
  {
    id: 5,
    question: "Un truc qui disparaît dans la machine à laver.",
    answers: [
      { text: "Chaussettes", points: 34 },
      { text: "Pièces/argent", points: 16 },
      { text: "Mouchoirs", points: 14 },
      { text: "Briquet", points: 10 },
      { text: "Élastiques", points: 8 },
      { text: "T-shirts", points: 6 },
      { text: "Tickets", points: 6 },
      { text: "Clés", points: 2 },
    ],
  },
  {
    id: 6,
    question: "Un bruit de voisinage agaçant.",
    answers: [
      { text: "Perceuse", points: 28 },
      { text: "Fête tard", points: 20 },
      { text: "Chien qui aboie", points: 16 },
      { text: "Talons / Parquet", points: 12 },
      { text: "Bébé qui pleure", points: 10 },
      { text: "Tondeuse", points: 8 },
      { text: "Musique forte", points: 4 },
      { text: "Portes qui claquent", points: 2 },
    ],
  },
  {
    id: 7,
    question: "Un plat qu’on commande en livraison.",
    answers: [
      { text: "Pizza", points: 30 },
      { text: "Burger", points: 22 },
      { text: "Sushi", points: 16 },
      { text: "Tacos", points: 12 },
      { text: "Kebab", points: 8 },
      { text: "Pad thaï", points: 6 },
      { text: "Salade", points: 4 },
      { text: "Poulet frit", points: 2 },
    ],
  },
  {
    id: 8,
    question: "Une activité d’un dimanche pluvieux.",
    answers: [
      { text: "Netflix / Série", points: 26 },
      { text: "Lire", points: 18 },
      { text: "Sieste", points: 16 },
      { text: "Jeux vidéo", points: 14 },
      { text: "Cuisine / Pâtisserie", points: 10 },
      { text: "Ranger", points: 8 },
      { text: "Jeux de société", points: 6 },
      { text: "Bricolage", points: 2 },
    ],
  },
  {
    id: 9,
    question: "Un objet qu’on a toujours dans son sac.",
    answers: [
      { text: "Clés", points: 26 },
      { text: "Portefeuille", points: 22 },
      { text: "Téléphone", points: 20 },
      { text: "Chargeur", points: 10 },
      { text: "Mouchoirs", points: 8 },
      { text: "Gel hydroalcoolique", points: 6 },
      { text: "Bouteille d’eau", points: 4 },
      { text: "Stylo", points: 4 },
    ],
  },
  {
    id: 10,
    question: "Un truc qu’on oublie d’acheter au supermarché.",
    answers: [
      { text: "Papier toilette", points: 24 },
      { text: "Sel", points: 20 },
      { text: "Beurre", points: 16 },
      { text: "Lait", points: 14 },
      { text: "Œufs", points: 10 },
      { text: "Piles", points: 8 },
      { text: "Dentifrice", points: 4 },
      { text: "Levure", points: 4 },
    ],
  },
];



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
    question: "Citez un objet que l’on trouve toujours sur une table de salon.",
    answers: [
      { text: "Télécommande", points: 35 },
      { text: "Magazines / Livres", points: 24 },
      { text: "Boisson / Verre", points: 14 },
      { text: "Fleurs / Plante", points: 10 },
      { text: "Bol à snacks", points: 8 },
      { text: "Sous-verres", points: 5 },
      { text: "Bougie", points: 3 },
      { text: "Clés", points: 1 },
    ],
  },
  {
    id: 2,
    question: "Une raison d’arriver en retard au travail.",
    answers: [
      { text: "Embouteillages", points: 36 },
      { text: "Panne de réveil", points: 22 },
      { text: "Transports en retard", points: 16 },
      { text: "Enfant/malade", points: 10 },
      { text: "Problème de voiture", points: 8 },
      { text: "RDV médical", points: 4 },
      { text: "Météo", points: 3 },
      { text: "Oubli d’affaire", points: 1 },
    ],
  },
  {
    id: 3,
    question: "Un sport qui se joue avec une balle.",
    answers: [
      { text: "Football", points: 40 },
      { text: "Basket", points: 20 },
      { text: "Tennis", points: 15 },
      { text: "Rugby", points: 10 },
      { text: "Volley", points: 6 },
      { text: "Handball", points: 5 },
      { text: "Baseball", points: 3 },
      { text: "Golf", points: 1 },
    ],
  },
  {
    id: 4,
    question: "Quelque chose que l’on fait avant un rendez-vous important.",
    answers: [
      { text: "Se doucher / Se coiffer", points: 30 },
      { text: "S’habiller / Choisir une tenue", points: 22 },
      { text: "Se brosser les dents", points: 14 },
      { text: "Regarder l’itinéraire", points: 10 },
      { text: "Arriver en avance", points: 9 },
      { text: "Préparer des documents", points: 7 },
      { text: "Se parfumer", points: 5 },
      { text: "Envoyer un message", points: 3 },
    ],
  },
  {
    id: 5,
    question: "Un aliment qu’on met sur une crêpe sucrée.",
    answers: [
      { text: "Nutella / Pâte à tartiner", points: 38 },
      { text: "Sucre", points: 20 },
      { text: "Confiture", points: 14 },
      { text: "Caramel beurre salé", points: 10 },
      { text: "Banane", points: 8 },
      { text: "Chantilly", points: 5 },
      { text: "Miel", points: 3 },
      { text: "Citron", points: 2 },
    ],
  },
  {
    id: 6,
    question: "Un endroit où l’on doit faire la queue.",
    answers: [
      { text: "Supermarché / Caisse", points: 34 },
      { text: "Administration / Préfecture", points: 20 },
      { text: "Parc d’attractions", points: 14 },
      { text: "Boulangerie", points: 10 },
      { text: "Concert / Festival", points: 8 },
      { text: "Pharmacie", points: 6 },
      { text: "Banque", points: 5 },
      { text: "Toilettes publiques", points: 3 },
    ],
  },
  {
    id: 7,
    question: "Quelque chose que l’on vérifie avant de partir en vacances.",
    answers: [
      { text: "Papiers / Passeport", points: 28 },
      { text: "Réservations / Billets", points: 22 },
      { text: "Valise / Vêtements", points: 16 },
      { text: "Météo", points: 12 },
      { text: "Argent / Carte", points: 10 },
      { text: "Chargeurs / Électronique", points: 6 },
      { text: "Maison fermée", points: 4 },
      { text: "Itinéraire", points: 2 },
    ],
  },
  {
    id: 8,
    question: "Une chose qu’on fait pour se détendre le soir.",
    answers: [
      { text: "Regarder une série / film", points: 32 },
      { text: "Jeux vidéo", points: 20 },
      { text: "Lire", points: 14 },
      { text: "Cuisine / Manger", points: 10 },
      { text: "Musique / Podcast", points: 9 },
      { text: "Sport léger / Yoga", points: 7 },
      { text: "Bain / Douche", points: 5 },
      { text: "Discuter entre amis", points: 3 },
    ],
  },
  {
    id: 9,
    question: "Un animal que l’on peut voir dans une ferme.",
    answers: [
      { text: "Vache", points: 28 },
      { text: "Poulet", points: 22 },
      { text: "Cochon", points: 16 },
      { text: "Cheval", points: 12 },
      { text: "Mouton", points: 10 },
      { text: "Chèvre", points: 6 },
      { text: "Canard", points: 4 },
      { text: "Lapin", points: 2 },
    ],
  },
  {
    id: 10,
    question: "Quelque chose que l’on associe au samedi soir.",
    answers: [
      { text: "Soirée / Fête", points: 30 },
      { text: "Restaurant", points: 20 },
      { text: "Cinéma", points: 15 },
      { text: "Match / Sport", points: 10 },
      { text: "Jeux entre amis", points: 8 },
      { text: "Livraison / Pizza", points: 5 },
      { text: "Bar", points: 4 },
      { text: "Repos", points: 3 },
    ],
  },
];



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
    question: "Une chose qu’on vérifie avant de sortir de chez soi.",
    answers: [
      { text: "Clés", points: 30 },
      { text: "Téléphone", points: 24 },
      { text: "Portefeuille", points: 18 },
      { text: "Porte fermée", points: 12 },
      { text: "Carte de transport", points: 8 },
      { text: "Lunettes", points: 4 },
      { text: "Chaussures", points: 2 },
      { text: "Gaz/électricité", points: 2 },
    ],
  },
  {
    id: 2,
    question: "Quelque chose qu’on met dans un sandwich.",
    answers: [
      { text: "Jambon", points: 26 },
      { text: "Fromage", points: 22 },
      { text: "Salade", points: 14 },
      { text: "Tomate", points: 12 },
      { text: "Mayonnaise", points: 10 },
      { text: "Thon", points: 8 },
      { text: "Poulet", points: 6 },
      { text: "Cornichons", points: 2 },
    ],
  },
  {
    id: 3,
    question: "Une raison de se lever la nuit.",
    answers: [
      { text: "Aller aux toilettes", points: 32 },
      { text: "Boire de l’eau", points: 20 },
      { text: "Bébé / Enfant", points: 16 },
      { text: "Bruit", points: 12 },
      { text: "Grignoter", points: 8 },
      { text: "Cauchemar", points: 6 },
      { text: "Trop chaud / froid", points: 4 },
      { text: "Téléphone", points: 2 },
    ],
  },
  {
    id: 4,
    question: "Un objet qu’on oublie souvent en partant en vacances.",
    answers: [
      { text: "Chargeur", points: 28 },
      { text: "Brosse à dents", points: 20 },
      { text: "Maillot de bain", points: 14 },
      { text: "Lunettes de soleil", points: 12 },
      { text: "Papiers", points: 10 },
      { text: "Crème solaire", points: 8 },
      { text: "Pyjama", points: 5 },
      { text: "Médicaments", points: 3 },
    ],
  },
  {
    id: 5,
    question: "Un plat facile à cuisiner pour des invités.",
    answers: [
      { text: "Pâtes", points: 30 },
      { text: "Pizza", points: 20 },
      { text: "Raclette", points: 14 },
      { text: "Barbecue", points: 12 },
      { text: "Salade composée", points: 10 },
      { text: "Quiche", points: 8 },
      { text: "Tacos", points: 4 },
      { text: "Crêpes", points: 2 },
    ],
  },
  {
    id: 6,
    question: "Un endroit où l’on perd souvent du temps.",
    answers: [
      { text: "Embouteillages", points: 32 },
      { text: "Caisse du supermarché", points: 20 },
      { text: "Administration", points: 16 },
      { text: "Transports", points: 12 },
      { text: "Médecin", points: 10 },
      { text: "Réseaux sociaux", points: 8 },
      { text: "Guichets / bornes", points: 4 },
      { text: "Ascenseur", points: 2 },
    ],
  },
  {
    id: 7,
    question: "Une appli que tout le monde a sur son téléphone.",
    answers: [
      { text: "WhatsApp", points: 26 },
      { text: "Instagram", points: 20 },
      { text: "Facebook", points: 16 },
      { text: "Maps", points: 12 },
      { text: "TikTok", points: 10 },
      { text: "YouTube", points: 8 },
      { text: "Banque", points: 4 },
      { text: "Météo", points: 4 },
    ],
  },
  {
    id: 8,
    question: "Quelque chose qui fait peur à beaucoup de gens.",
    answers: [
      { text: "Araignées", points: 30 },
      { text: "Serpents", points: 20 },
      { text: "Orage", points: 12 },
      { text: "Hauteur", points: 12 },
      { text: "Obscurité", points: 10 },
      { text: "Avion", points: 8 },
      { text: "Aiguilles", points: 6 },
      { text: "Parler en public", points: 2 },
    ],
  },
  {
    id: 9,
    question: "[NSFW] Un émoji qu’on utilise pour flirter.",
    answers: [
      { text: "Clin d’œil 😉", points: 26 },
      { text: "Cœur ❤️", points: 20 },
      { text: "Feu 🔥", points: 16 },
      { text: "Langue 😛", points: 10 },
      { text: "Diable 😈", points: 8 },
      { text: "Aubergine 🍆", points: 8 },
      { text: "Pêche 🍑", points: 6 },
      { text: "Gouttes 💦", points: 6 },
    ],
  },
  {
    id: 10,
    question: "[NSFW] Un objet qu’on peut trouver sur une table de nuit d’adulte.",
    answers: [
      { text: "Lampe", points: 24 },
      { text: "Réveil", points: 20 },
      { text: "Livre", points: 16 },
      { text: "Bouteille d’eau", points: 12 },
      { text: "Préservatifs", points: 12 },
      { text: "Lunettes", points: 8 },
      { text: "Chargeur", points: 6 },
      { text: "Baume à lèvres", points: 2 },
    ],
  },
];



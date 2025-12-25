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
    question: "Une excuse bidon pour arriver en retard au travail.",
    answers: [
      { text: "Bouchons / Trafic", points: 28 },
      { text: "Réveil pas sonné", points: 22 },
      { text: "Problème de métro", points: 16 },
      { text: "Enfant malade", points: 12 },
      { text: "Panne de voiture", points: 8 },
      { text: "J'ai pas vu l'heure", points: 6 },
      { text: "RDV médecin", points: 5 },
      { text: "Le chat a vomi", points: 3 },
    ],
  },
  {
    id: 2,
    question: "Un truc qu'on fait semblant de comprendre.",
    answers: [
      { text: "Les cryptos / NFT", points: 26 },
      { text: "L'art moderne", points: 22 },
      { text: "La politique", points: 16 },
      { text: "L'informatique", points: 12 },
      { text: "Les impôts", points: 10 },
      { text: "La mécanique auto", points: 6 },
      { text: "Le vin", points: 5 },
      { text: "L'opéra", points: 3 },
    ],
  },
  {
    id: 3,
    question: "Un mensonge que tout le monde dit.",
    answers: [
      { text: "Ça va / Je vais bien", points: 30 },
      { text: "J'arrive dans 5 min", points: 22 },
      { text: "J'ai lu les CGU", points: 14 },
      { text: "C'est mon dernier verre", points: 12 },
      { text: "Je commence lundi", points: 8 },
      { text: "T'as pas changé !", points: 6 },
      { text: "C'était délicieux", points: 5 },
      { text: "J'ai pas de réseau", points: 3 },
    ],
  },
  {
    id: 4,
    question: "Un truc qu'on fait aux toilettes (à part le nécessaire).",
    answers: [
      { text: "Téléphone / Réseaux", points: 34 },
      { text: "Lire", points: 20 },
      { text: "Jouer à des jeux", points: 14 },
      { text: "Réfléchir à la vie", points: 10 },
      { text: "Répondre aux messages", points: 8 },
      { text: "Regarder des vidéos", points: 6 },
      { text: "Se cacher du boulot", points: 5 },
      { text: "Pleurer", points: 3 },
    ],
  },
  {
    id: 5,
    question: "Un truc qu'on a tous googlé en secret.",
    answers: [
      { text: "Son propre nom", points: 26 },
      { text: "Symptômes bizarres", points: 22 },
      { text: "Son ex", points: 18 },
      { text: "C'est quoi [mot compliqué]", points: 12 },
      { text: "Comment faire un truc basique", points: 8 },
      { text: "Salaire de célébrités", points: 6 },
      { text: "Est-ce que je suis normal", points: 5 },
      { text: "Crush / Collègue", points: 3 },
    ],
  },
  {
    id: 6,
    question: "Une raison de stalker quelqu'un sur Instagram.",
    answers: [
      { text: "C'est un(e) ex", points: 28 },
      { text: "Crush / Intérêt amoureux", points: 24 },
      { text: "Nouveau copain/copine d'un ex", points: 16 },
      { text: "Collègue chelou", points: 10 },
      { text: "Ami d'ami canon", points: 8 },
      { text: "Célébrité", points: 6 },
      { text: "Avant un date", points: 5 },
      { text: "Pure curiosité malsaine", points: 3 },
    ],
  },
  {
    id: 7,
    question: "Un truc qu'on dit quand on sait pas quoi dire.",
    answers: [
      { text: "Ah ouais... / D'accord", points: 26 },
      { text: "C'est chaud ça", points: 20 },
      { text: "Intéressant...", points: 16 },
      { text: "Je vois", points: 12 },
      { text: "Grave / Carrément", points: 10 },
      { text: "C'est pas faux", points: 8 },
      { text: "Hmm...", points: 5 },
      { text: "En même temps...", points: 3 },
    ],
  },
  {
    id: 8,
    question: "Un truc qu'on fait quand on est seul à la maison.",
    answers: [
      { text: "Chanter fort / Danser", points: 28 },
      { text: "Se balader à moitié nu", points: 22 },
      { text: "Parler tout seul", points: 16 },
      { text: "Manger n'importe quoi", points: 12 },
      { text: "Regarder des trucs débiles", points: 8 },
      { text: "Péter librement", points: 6 },
      { text: "Faire des grimaces au miroir", points: 5 },
      { text: "Fouiller chez les autres", points: 3 },
    ],
  },
  // 🔞 MANCHE NSFW #1
  {
    id: 9,
    question: "🔞 Un endroit insolite où les gens ont déjà fait l'amour.",
    answers: [
      { text: "Voiture", points: 28 },
      { text: "Plage", points: 22 },
      { text: "Bureau / Travail", points: 16 },
      { text: "Toilettes publiques", points: 12 },
      { text: "Ascenseur", points: 8 },
      { text: "Forêt / Parc", points: 6 },
      { text: "Avion", points: 5 },
      { text: "Chez les beaux-parents", points: 3 },
    ],
  },
  // 🔞 MANCHE NSFW #2
  {
    id: 10,
    question: "🔞 Un truc qui tue l'ambiance au lit.",
    answers: [
      { text: "Téléphone qui sonne", points: 26 },
      { text: "Dire le mauvais prénom", points: 24 },
      { text: "Quelqu'un qui rentre", points: 18 },
      { text: "Un pet / bruit gênant", points: 12 },
      { text: "Parler de son ex", points: 8 },
      { text: "S'endormir", points: 6 },
      { text: "Le chat qui regarde", points: 4 },
      { text: "Fou rire incontrôlable", points: 2 },
    ],
  },
];

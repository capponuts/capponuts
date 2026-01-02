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
    question: "Un truc qu'on fait en cachette au bureau.",
    answers: [
      { text: "Regarder son téléphone", points: 28 },
      { text: "Manger / Grignoter", points: 22 },
      { text: "Faire une sieste", points: 16 },
      { text: "Shopping en ligne", points: 12 },
      { text: "Réseaux sociaux", points: 8 },
      { text: "Chercher un autre job", points: 6 },
      { text: "Netflix / YouTube", points: 5 },
      { text: "Jeux sur l'ordi", points: 3 },
    ],
  },
  {
    id: 2,
    question: "Une chose qu'on regrette après une soirée.",
    answers: [
      { text: "Avoir trop bu", points: 30 },
      { text: "Les messages envoyés", points: 22 },
      { text: "La gueule de bois", points: 14 },
      { text: "Avoir trop mangé", points: 12 },
      { text: "Les photos moches", points: 8 },
      { text: "Avoir dansé", points: 6 },
      { text: "L'argent dépensé", points: 5 },
      { text: "Avoir parlé à son ex", points: 3 },
    ],
  },
  {
    id: 3,
    question: "Un truc qu'on dit quand on veut partir d'une soirée.",
    answers: [
      { text: "Je travaille demain", points: 28 },
      { text: "Je suis fatigué(e)", points: 24 },
      { text: "Mon Uber arrive", points: 14 },
      { text: "J'ai le chien à sortir", points: 10 },
      { text: "J'ai pas de batterie", points: 8 },
      { text: "Ma copine/copain m'attend", points: 6 },
      { text: "Je couve un truc", points: 6 },
      { text: "Faut que j'y aille là", points: 4 },
    ],
  },
  {
    id: 4,
    question: "Un truc qu'on achète et qu'on utilise jamais.",
    answers: [
      { text: "Abonnement salle de sport", points: 30 },
      { text: "Vêtements", points: 20 },
      { text: "Livres", points: 14 },
      { text: "Ustensiles de cuisine", points: 12 },
      { text: "Appareils de sport", points: 8 },
      { text: "Jeux vidéo", points: 6 },
      { text: "Produits de beauté", points: 6 },
      { text: "Robots cuisine", points: 4 },
    ],
  },
  {
    id: 5,
    question: "Un truc qu'on fait quand on s'ennuie en réunion.",
    answers: [
      { text: "Regarder son téléphone", points: 28 },
      { text: "Dessiner / Gribouiller", points: 22 },
      { text: "Rêvasser", points: 16 },
      { text: "Faire des listes", points: 10 },
      { text: "Compter les minutes", points: 8 },
      { text: "Jouer avec un stylo", points: 6 },
      { text: "Répondre aux mails", points: 6 },
      { text: "Dormir les yeux ouverts", points: 4 },
    ],
  },
  {
    id: 6,
    question: "Un truc qu'on dit pour éviter un rdv.",
    answers: [
      { text: "Je suis malade", points: 28 },
      { text: "J'ai déjà un truc", points: 22 },
      { text: "Je bosse ce jour-là", points: 16 },
      { text: "J'ai pas de voiture", points: 10 },
      { text: "C'est l'anniv de ma mère", points: 8 },
      { text: "J'attends le plombier", points: 6 },
      { text: "Mon chat est malade", points: 6 },
      { text: "J'ai pas reçu le message", points: 4 },
    ],
  },
  {
    id: 7,
    question: "Un sujet tabou au repas de famille.",
    answers: [
      { text: "Politique", points: 30 },
      { text: "Argent / Salaire", points: 22 },
      { text: "Religion", points: 14 },
      { text: "Les ex", points: 12 },
      { text: "Quand tu fais des enfants", points: 8 },
      { text: "Héritage", points: 6 },
      { text: "Le poids", points: 5 },
      { text: "Les notes à l'école", points: 3 },
    ],
  },
  {
    id: 8,
    question: "Un truc qu'on fait en voiture quand on est seul.",
    answers: [
      { text: "Chanter à tue-tête", points: 34 },
      { text: "Parler tout seul", points: 20 },
      { text: "Se curer le nez", points: 14 },
      { text: "Danser", points: 10 },
      { text: "Manger", points: 8 },
      { text: "Passer des appels", points: 6 },
      { text: "Se regarder dans le miroir", points: 5 },
      { text: "Péter", points: 3 },
    ],
  },
  // 🔞 MANCHE NSFW #1
  {
    id: 9,
    question: "🔞 Un truc qu'on efface de son historique.",
    answers: [
      { text: "Sites pour adultes", points: 30 },
      { text: "Recherches gênantes", points: 22 },
      { text: "Stalking d'ex", points: 14 },
      { text: "Sites de rencontres", points: 12 },
      { text: "Questions médicales bizarres", points: 8 },
      { text: "Shopping honteux", points: 6 },
      { text: "Messages à son crush", points: 5 },
      { text: "Tests de personnalité", points: 3 },
    ],
  },
  // 🔞 MANCHE NSFW #2
  {
    id: 10,
    question: "🔞 Un surnom ridicule qu'on donne à son partenaire.",
    answers: [
      { text: "Bébé / Baby", points: 26 },
      { text: "Mon cœur", points: 22 },
      { text: "Chéri(e)", points: 16 },
      { text: "Mon lapin", points: 12 },
      { text: "Poussin", points: 8 },
      { text: "Doudou", points: 6 },
      { text: "Mon canard", points: 6 },
      { text: "Bibiche", points: 4 },
    ],
  },
];

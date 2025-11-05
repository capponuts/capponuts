export type MiniGame = {
  slug: string;
  title: string;
  emoji: string;
  description: string;
  kind:
    | "blindtest"
    | "abc-story"
    | "scoop"
    | "jemappelle"
    | "articule"
    | "mime-dance"
    | "remix"
    | "lets-dance"
    | "freeze-dance";
};

export const MINI_GAMES: MiniGame[] = [
  {
    slug: "blind-test",
    title: "Blind Test",
    emoji: "🎧",
    description:
      "Lancez des intros de musiques, films ou séries. Première équipe à buzzer et donner la bonne réponse marque le point.",
    kind: "blindtest",
  },
  {
    slug: "abc-story",
    title: "ABC Story",
    emoji: "🔤",
    description:
      "À partir d’une lettre donnée, chaque joueur ajoute une phrase à l’histoire en respectant l’initiale.",
    kind: "abc-story",
  },
  {
    slug: "le-scoop",
    title: "Le Scoop",
    emoji: "📰",
    description:
      "Un joueur raconte une anecdote vraie ou fausse. L’équipe adverse buzze et vote : Vrai ou Faux.",
    kind: "scoop",
  },
  {
    slug: "je-mappelle",
    title: "Je m’appelle…",
    emoji: "🗣️",
    description:
      "En relais, compléter des phrases avec une lettre imposée (J’habite à…, je suis…, j’aime les…).",
    kind: "jemappelle",
  },
  {
    slug: "articule",
    title: "Articule",
    emoji: "👄",
    description:
      "Un joueur porte un casque avec musique. On lui donne des expressions à mimer avec les lèvres, sans son.",
    kind: "articule",
  },
  {
    slug: "mime-dance",
    title: "Mime Dance",
    emoji: "💃",
    description:
      "Danser en incorporant une action secrète. L’équipe adverse buzze et devine l’action.",
    kind: "mime-dance",
  },
  {
    slug: "le-remix",
    title: "Le Remix",
    emoji: "🎼",
    description:
      "2 minutes pour réécrire un refrain célèbre selon un thème imposé (texte, règles de la soirée…).",
    kind: "remix",
  },
  {
    slug: "lets-dance",
    title: "Let’s Dance",
    emoji: "🪩",
    description:
      "Battle 1v1 par styles (Salsa, Rock, Hip-Hop…). Le public vote au bruitmètre.",
    kind: "lets-dance",
  },
  {
    slug: "freeze-dance",
    title: "Freeze Dance",
    emoji: "🧊",
    description:
      "Tout le monde danse. Stop musique = mimer un objet/animal donné. Ceux qui bougent sont out.",
    kind: "freeze-dance",
  },
];

export const ARTICULE_EXPRESSIONS: string[] = [
  "J’ai perdu les clés du frigo",
  "Le chat a volé ma pizza",
  "Il pleut des kebabs sur Paris",
  "La raclette en été, c’est sacré",
  "Mon réveil sonne à 4h du soir",
];

export const MIME_ACTIONS: string[] = [
  "Sortir le chien",
  "Faire sauter des crêpes",
  "Chercher ses clés",
  "Jongler avec des citrons",
  "Planter une tente",
];

export const JEMAPPELLE_PROMPTS: string[] = [
  "J’habite à…",
  "Je suis…",
  "J’aime les…",
  "Je déteste…",
  "Je collectionne…",
];



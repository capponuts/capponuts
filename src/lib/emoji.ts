export function getEmojiForQuestion(question: string): string {
  const q = question.toLowerCase();
  // NSFW
  if (q.includes("[nsfw]")) return "😈";
  // Nourriture / cuisine / pizza / sandwich
  if (/(pizza|sandwich|pâtes|tacos|quiche|salade|cuisin|invité)/.test(q)) return "🍕";
  // Vacances / été / plage
  if (/(vacance|plage|soleil|maillot|crème)/.test(q)) return "🏖️";
  // Peurs / animaux
  if (/(peur|araign|serpent|orage|aiguille|hauteur|obscur|parler en public)/.test(q)) return "😱";
  // Apps / téléphone
  if (/(appli|téléphone|whatsapp|instagram|facebook|tiktok|youtube|maps|banque)/.test(q)) return "📱";
  // Sorties / clés / départ
  if (/(sortir|clés|porte|gaz|électr|lunette)/.test(q)) return "🔑";
  // Nuit / se lever / toilettes
  if (/(nuit|toilett|cauchemar|soif|grignoter)/.test(q)) return "🌙";
  // Perte de temps / transports
  if (/(embouteill|transport|administration|caisse|attente|guichet|ascenseur|réseaux)/.test(q)) return "⏳";
  // Peur/animaux (fallback secondaire)
  if (/(animal|ferme)/.test(q)) return "🐮";
  // Cadeaux
  if (/(cadeau|anniversaire|noël)/.test(q)) return "🎁";
  // Default fun
  return "🌟";
}



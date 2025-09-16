# Capponuts - Hub Gamer (MVP)

Application Next.js (App Router) pour agréger tes stats joueur (TFT/LoL, WoW) et streaming (Twitch). Stack actuelle: Next 15, Tailwind v4, Drizzle + Neon Postgres.

## État d’avancement
- Accueil → redirige vers `/dashboard` (UI sombre modernisée, animations Framer/Lucide).
- Pages:
  - `/dashboard`: cartes LoL/TFT (TFT via Riot), WoW (Blizzard), Twitch.
  - `/integrations`: vérifie la présence des clés et connectivité (côté serveur, no cache).
  - `/profile/[id]`, `/leaderboard` (squelettes).
- Intégrations:
  - Riot: compte TFT via endpoints officiels (ranked TFT). Fichier `public/riot.txt` en place.
  - Blizzard: auth Client Credentials corrigée (Basic + header Bearer).
  - Twitch: user public via App Access Token.
- Infra:
  - Drizzle + Neon initialisés (schéma minimal, pas d’ingestion persistée encore).
  - Tailwind v4 configuré, PostCSS corrigé.

## Variables d’environnement (local/Vercel)
```
DATABASE_URL=postgresql://…  # Neon
RIOT_API_KEY=…
BLIZZARD_CLIENT_ID=…
BLIZZARD_CLIENT_SECRET=…
TWITCH_CLIENT_ID=…
TWITCH_APP_TOKEN=…  # App Access Token OAuth Client Credentials
```

- Riot ownership: `https://capponuts.fr/riot.txt` (contenu: UUID fourni par Riot).

## Routes utiles
- `/` → redirection vers `/dashboard`
- `/dashboard` → stats en live (TFT via Riot, WoW, Twitch)
- `/integrations` → statut des clés et tests rapides
- `/api/health` → ping DB (Neon)

## Comment lancer
```bash
npm install
npm run dev
```

## Limites actuelles
- Pas de cache/cron: appels directs aux APIs (dépendants des rate limits et tokens courts).
- Données WoW/Twitch affichées si token valide au moment de l’appel.

## Prochaines étapes proposées
- Brancher valeurs “live” détaillées dans les cartes (MMR/rang, niveau/ilvl, followers/views).
- Cache léger côté serveur (60–120s) pour lisser les rate limits.
- Timeline jeux/streams (persistance Neon via Drizzle).
- Graphique d’évolution (winrate/semaine) et badges de rang.

---
Made with Next.js, Tailwind, Framer Motion, Lucide.

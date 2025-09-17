import { NextResponse } from "next/server";

type RiotRegion = "euw" | "eune" | "na" | "kr" | "br" | "oce" | "lan" | "las" | "tr" | "ru" | "jp";

function regionToPlatform(region: RiotRegion): string {
  switch (region) {
    case "euw":
      return "euw1";
    case "eune":
      return "eun1";
    case "na":
      return "na1";
    case "kr":
      return "kr";
    case "br":
      return "br1";
    case "oce":
      return "oc1";
    case "lan":
      return "la1";
    case "las":
      return "la2";
    case "tr":
      return "tr1";
    case "ru":
      return "ru";
    case "jp":
      return "jp1";
    default:
      return "euw1";
  }
}

function regionToRegionalGroup(region: RiotRegion): string {
  switch (region) {
    case "euw":
    case "eune":
    case "tr":
    case "ru":
      return "europe";
    case "na":
    case "lan":
    case "las":
    case "br":
      return "americas";
    case "kr":
    case "jp":
    case "oce":
      return "asia";
    default:
      return "europe";
  }
}

type RiotAccount = { puuid: string };
type RiotSummoner = { id: string };
type LeagueEntry = {
  queueType?: string;
  tier?: string;
  rank?: string;
  leaguePoints?: number;
  wins?: number;
  losses?: number;
};
type TftParticipant = { puuid: string; placement?: number };
type TftMatch = { info?: { participants?: TftParticipant[] } };

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const envGameName = process.env.RIOT_GAME_NAME || undefined;
  const envTagLine = process.env.RIOT_TAG_LINE || undefined;
  const envRegion = (process.env.RIOT_REGION || undefined) as RiotRegion | undefined;

  const gameName = (searchParams.get("gameName") || envGameName || "Capponuts") as string;
  const tagLine = (searchParams.get("tagLine") || envTagLine || "1993") as string;
  const regionParam = ((searchParams.get("region") || envRegion || "euw") as string).toLowerCase() as RiotRegion;

  if (!process.env.RIOT_API_KEY) {
    return NextResponse.json({ error: "Missing RIOT_API_KEY" }, { status: 500 });
  }

  // With public defaults above, this should never trigger for our use case

  const platform = regionToPlatform(regionParam);
  const regional = regionToRegionalGroup(regionParam);
  const headers = { "X-Riot-Token": process.env.RIOT_API_KEY as string };

  try {
    // 1) Try Riot Account by Riot ID to obtain PUUID
    let puuid: string | null = null;
    let lastErrorBody: string | null = null;
    const accountRes = await fetch(
      `https://${regional}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`,
      { headers, next: { revalidate: 120 } }
    );
    if (accountRes.ok) {
      const account = (await accountRes.json()) as RiotAccount;
      puuid = account.puuid;
    } else {
      lastErrorBody = await accountRes.text();
    }

    // Fallback: if Riot Account lookup failed, try summoner by name (platform)
    let summonerId: string | null = null;
    if (!puuid) {
      const byName = await fetch(
        `https://${platform}.api.riotgames.com/tft/summoner/v1/summoners/by-name/${encodeURIComponent(gameName)}`,
        { headers, next: { revalidate: 120 } }
      );
      if (!byName.ok) {
        const body = await byName.text();
        return NextResponse.json(
          {
            error: "Failed to resolve Riot ID",
            details: lastErrorBody || body,
            hint: "Vérifie l'orthographe de la Riot ID et le tag (#1993).",
          },
          { status: 400 }
        );
      }
      const summ = (await byName.json()) as RiotSummoner;
      summonerId = summ.id;
    }

    // 2) If we have PUUID (from Riot Account), get Summoner to obtain encryptedSummonerId
    if (!summonerId && puuid) {
      const summRes = await fetch(
        `https://${platform}.api.riotgames.com/tft/summoner/v1/summoners/by-puuid/${encodeURIComponent(puuid)}`,
        { headers, next: { revalidate: 120 } }
      );
      if (!summRes.ok) {
        const text = await summRes.text();
        return NextResponse.json({ error: "Failed to fetch summoner", details: text }, { status: summRes.status });
      }
      const summ = (await summRes.json()) as RiotSummoner;
      summonerId = summ.id;
    }

    // Ensure we have a valid summonerId
    if (!summonerId) {
      return NextResponse.json(
        {
          error: "Unable to resolve summoner",
          details: "Impossible de résoudre le compte via Riot ID ou nom d'invocateur.",
          hint: "Vérifie l'orthographe (Capponuts#1993) et la région (EUW).",
        },
        { status: 400 }
      );
    }

    // 3) Get League entries for rank/LP/wins/losses
    const leagueRes = await fetch(
      `https://${platform}.api.riotgames.com/tft/league/v1/entries/by-summoner/${encodeURIComponent(summonerId)}`,
      { headers, next: { revalidate: 120 } }
    );
    if (!leagueRes.ok) {
      const text = await leagueRes.text();
      return NextResponse.json({ error: "Failed to fetch league entries", details: text }, { status: leagueRes.status });
    }
    const entriesJson = (await leagueRes.json()) as unknown;
    const entries: LeagueEntry[] = Array.isArray(entriesJson) ? (entriesJson as LeagueEntry[]) : [];
    const solo: LeagueEntry | null = entries.length > 0 ? (entries.find((e: LeagueEntry) => e.queueType === "RANKED_TFT") || entries[0]) : null;

    // 4) Get last N matches to estimate top4 rate (optional, best-effort)
    let top4Rate: number | null = null;
    if (puuid) {
      try {
        const idsRes = await fetch(
          `https://${regional}.api.riotgames.com/tft/match/v1/matches/by-puuid/${encodeURIComponent(puuid)}/ids?count=10`,
          { headers, next: { revalidate: 60 } }
        );
        if (idsRes.ok) {
          const ids: string[] = await idsRes.json();
          let top4 = 0;
          let total = 0;
          for (const id of ids) {
            const mRes = await fetch(`https://${regional}.api.riotgames.com/tft/match/v1/matches/${id}`, { headers, next: { revalidate: 60 } });
            if (!mRes.ok) continue;
            const match = (await mRes.json()) as TftMatch;
            const me = match?.info?.participants?.find((p: TftParticipant) => p.puuid === puuid);
            if (me && typeof me.placement === "number") {
              total += 1;
              if (me.placement <= 4) top4 += 1;
            }
          }
          if (total > 0) top4Rate = top4 / total;
        }
      } catch {
        // ignore top4 failures
      }
    }

    const wins = solo?.wins ?? null;
    const losses = solo?.losses ?? null;
    const games = typeof wins === "number" && typeof losses === "number" ? wins + losses : null;
    const winRate = typeof wins === "number" && typeof games === "number" && games > 0 ? wins / games : null;

    const payload = {
      gameName,
      tagLine,
      region: regionParam,
      rank: solo ? `${solo.tier ?? ""} ${solo.rank ?? ""}`.trim() : null,
      lp: solo?.leaguePoints ?? null,
      wins,
      losses,
      games,
      winRate,
      top4Rate,
      bestAugment: null as string | null,
    };

    return NextResponse.json(payload, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: "Unexpected error", details: message }, { status: 500 });
  }
}


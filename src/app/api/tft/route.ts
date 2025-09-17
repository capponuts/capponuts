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

// Simple in-memory cache to smooth rate limits (best-effort; may not persist in serverless)
const cache = new Map<string, { ts: number; data: unknown }>();
const CACHE_TTL_MS = 60_000;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const envGameName = process.env.RIOT_GAME_NAME || undefined;
  const envTagLine = process.env.RIOT_TAG_LINE || undefined;
  const envRegion = (process.env.RIOT_REGION || undefined) as RiotRegion | undefined;

  const gameName = (searchParams.get("gameName") || envGameName || "Capponuts") as string;
  const tagLine = (searchParams.get("tagLine") || envTagLine || "1993") as string;
  const overridePuuid = (searchParams.get("puuid") || undefined) as string | undefined;
  const regionParam = ((searchParams.get("region") || envRegion || "euw") as string).toLowerCase() as RiotRegion;

  if (!process.env.RIOT_API_KEY) {
    return NextResponse.json({ error: "Missing RIOT_API_KEY" }, { status: 500 });
  }

  // With public defaults above, this should never trigger for our use case

  const platform = regionToPlatform(regionParam);
  const regional = regionToRegionalGroup(regionParam);
  const headers = { "X-Riot-Token": process.env.RIOT_API_KEY as string };

  // Cache key
  const cacheKey = JSON.stringify({ gameName, tagLine, regionParam, overridePuuid });
  const now = Date.now();
  const cached = cache.get(cacheKey);
  if (cached && now - cached.ts < CACHE_TTL_MS) {
    return NextResponse.json(cached.data);
  }

  try {
    // 1) Try Riot Account by Riot ID to obtain PUUID
    let puuid: string | null = overridePuuid ?? null;
    let accountStatus: number | null = null;
    let accountErrorBody: string | null = null;
    if (!puuid) {
      const accountRes = await fetch(
        `https://${regional}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`,
        { headers, next: { revalidate: 120 } }
      );
      if (accountRes.ok) {
        const account = (await accountRes.json()) as RiotAccount;
        puuid = account.puuid;
      } else {
        accountStatus = accountRes.status;
        accountErrorBody = await accountRes.text();
      }
    }

    // Fallback: if Riot Account lookup failed, try summoner by name (platform)
    let summonerId: string | null = null;
    let byNameStatus: number | null = null;
    let byNameErrorBody: string | null = null;
    if (!puuid) {
      const byName = await fetch(
        `https://${platform}.api.riotgames.com/tft/summoner/v1/summoners/by-name/${encodeURIComponent(gameName)}`,
        { headers, next: { revalidate: 120 } }
      );
      if (!byName.ok) {
        byNameStatus = byName.status;
        byNameErrorBody = await byName.text();
      } else {
        const summ = (await byName.json()) as RiotSummoner;
        summonerId = summ.id;
      }
    }

    // 2) If we have PUUID (from Riot Account), get Summoner to obtain encryptedSummonerId
    let byPuuidStatus: number | null = null;
    let byPuuidErrorBody: string | null = null;
    let byPuuidData: unknown = null;
    let lolByPuuidStatus: number | null = null;
    let lolByPuuidErrorBody: string | null = null;
    let lolByPuuidData: unknown = null;
    if (!summonerId && puuid) {
      const summRes = await fetch(
        `https://${platform}.api.riotgames.com/tft/summoner/v1/summoners/by-puuid/${encodeURIComponent(puuid)}`,
        { headers, next: { revalidate: 120 } }
      );
      byPuuidStatus = summRes.status;
      if (!summRes.ok) {
        byPuuidErrorBody = await summRes.text();
      } else {
        type SummonerLike = RiotSummoner & { summonerId?: unknown } & Record<string, unknown>;
        const summ = (await summRes.json()) as SummonerLike;
        const idFromId = typeof summ.id === "string" ? summ.id : null;
        const idFromAlt = typeof summ.summonerId === "string" ? summ.summonerId : null;
        const resolvedId = idFromId || idFromAlt;
        byPuuidData = { id: resolvedId, keys: Object.keys(summ || {}) };
        if (typeof resolvedId === "string" && resolvedId.length > 0) {
          summonerId = resolvedId;
        }
      }
    }

    // Extra fallback: if we still don't have summonerId, try by-name once more on platform
    if (!summonerId) {
      const byName2 = await fetch(
        `https://${platform}.api.riotgames.com/tft/summoner/v1/summoners/by-name/${encodeURIComponent(gameName)}`,
        { headers, next: { revalidate: 120 } }
      );
      if (byName2.ok) {
        const summ2 = (await byName2.json()) as RiotSummoner;
        if (typeof summ2?.id === "string" && summ2.id.length > 0) {
          summonerId = summ2.id;
        }
      }
    }

    // Final fallback: use LoL Summoner v4 by PUUID to retrieve encrypted summoner id
    if (!summonerId && puuid) {
      const lolRes = await fetch(
        `https://${platform}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${encodeURIComponent(puuid)}`,
        { headers, next: { revalidate: 120 } }
      );
      lolByPuuidStatus = lolRes.status;
      if (!lolRes.ok) {
        lolByPuuidErrorBody = await lolRes.text();
      } else {
        type LolSummoner = { id?: string } & Record<string, unknown>;
        const lolSumm = (await lolRes.json()) as LolSummoner;
        lolByPuuidData = { keys: Object.keys(lolSumm || {}), id: lolSumm?.id ?? null };
        if (typeof lolSumm?.id === "string" && lolSumm.id.length > 0) {
          summonerId = lolSumm.id;
        }
      }
    }

    // EU multi-platform probe: try other EU platforms if still no summonerId
    if (!summonerId && puuid) {
      const euPlatforms: string[] = [platform, "eun1", "tr1", "ru"]; // keep preferred first
      for (const plat of euPlatforms) {
        if (summonerId) break;
        const res = await fetch(
          `https://${plat}.api.riotgames.com/tft/summoner/v1/summoners/by-puuid/${encodeURIComponent(puuid)}`,
          { headers, next: { revalidate: 120 } }
        );
        if (res.ok) {
          type SummProbe = RiotSummoner & { summonerId?: unknown } & Record<string, unknown>;
          const s = (await res.json()) as SummProbe;
          const idFromId = typeof s.id === "string" ? s.id : null;
          const idFromAlt = typeof s.summonerId === "string" ? (s.summonerId as string) : null;
          const maybe = idFromId || idFromAlt;
          if (typeof maybe === "string" && maybe.length > 0) {
            summonerId = maybe;
          }
        }
      }
    }

    // If still no summonerId, continue with match-based fallback (200)
    const noSummonerId = !summonerId;

    // 3) Get League entries for rank/LP/wins/losses
    let solo: LeagueEntry | null = null;
    if (!noSummonerId) {
      const summId: string = summonerId as string;
      const leagueRes = await fetch(
        `https://${platform}.api.riotgames.com/tft/league/v1/entries/by-summoner/${encodeURIComponent(summId)}`,
        { headers, next: { revalidate: 120 } }
      );
      if (!leagueRes.ok) {
        const text = await leagueRes.text();
        return NextResponse.json({ error: "Failed to fetch league entries", details: text }, { status: leagueRes.status });
      }
      const entriesJson = (await leagueRes.json()) as unknown;
      const entries: LeagueEntry[] = Array.isArray(entriesJson) ? (entriesJson as LeagueEntry[]) : [];
      solo = entries.length > 0 ? (entries.find((e: LeagueEntry) => e.queueType === "RANKED_TFT") || entries[0]) : null;
    }

    // 4) Get last N matches to estimate top4 rate and match-based fallback winrate (optional, best-effort)
    let top4Rate: number | null = null;
    let matchGames: number | null = null;
    let matchWinRate: number | null = null;
    if (puuid) {
      try {
        const idsRes = await fetch(
          `https://${regional}.api.riotgames.com/tft/match/v1/matches/by-puuid/${encodeURIComponent(puuid)}/ids?count=5`,
          { headers, next: { revalidate: 60 } }
        );
        if (idsRes.ok) {
          const ids: string[] = await idsRes.json();
          let top4 = 0;
          let total = 0;
          let winsCnt = 0;
          for (const id of ids) {
            const mRes = await fetch(`https://${regional}.api.riotgames.com/tft/match/v1/matches/${id}`, { headers, next: { revalidate: 60 } });
            if (!mRes.ok) continue;
            const match = (await mRes.json()) as TftMatch;
            const me = match?.info?.participants?.find((p: TftParticipant) => p.puuid === puuid);
            if (me && typeof me.placement === "number") {
              total += 1;
              if (me.placement <= 4) top4 += 1;
              if (me.placement === 1) winsCnt += 1;
            }
          }
          if (total > 0) top4Rate = top4 / total;
          if (total > 0) {
            matchGames = total;
            matchWinRate = winsCnt / total;
          }
        }
      } catch {
        // ignore top4 failures
      }
    }

    const wins = solo?.wins ?? null;
    const losses = solo?.losses ?? null;
    const games = typeof wins === "number" && typeof losses === "number" ? wins + losses : matchGames;
    const winRate = typeof wins === "number" && typeof games === "number" && games > 0 ? wins / games : matchWinRate;

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
      hint: noSummonerId ? "Profil TFT non résolu côté API. Stats basées sur les derniers matchs." : null,
      debug: noSummonerId
        ? {
            regional,
            platform,
            puuidSource: overridePuuid ? "query" : "lookup",
            riotIdAttempt: { status: accountStatus, body: accountErrorBody },
            byNameAttempt: { status: byNameStatus, body: byNameErrorBody },
            byPuuidAttempt: { status: byPuuidStatus, body: byPuuidErrorBody, data: byPuuidData },
            lolByPuuidAttempt: { status: lolByPuuidStatus, body: lolByPuuidErrorBody, data: lolByPuuidData },
            resolved: { puuid, summonerId },
          }
        : undefined,
    };

    const res = NextResponse.json(payload, { status: 200 });
    cache.set(cacheKey, { ts: now, data: payload });
    return res;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: "Unexpected error", details: message }, { status: 500 });
  }
}


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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const gameName = searchParams.get("gameName");
  const tagLine = searchParams.get("tagLine");
  const regionParam = (searchParams.get("region") || "euw").toLowerCase() as RiotRegion;

  if (!process.env.RIOT_API_KEY) {
    return NextResponse.json({ error: "Missing RIOT_API_KEY" }, { status: 500 });
  }

  if (!gameName || !tagLine) {
    return NextResponse.json({ error: "Missing gameName or tagLine" }, { status: 400 });
  }

  const platform = regionToPlatform(regionParam);
  const regional = regionToRegionalGroup(regionParam);
  const headers = { "X-Riot-Token": process.env.RIOT_API_KEY as string };

  try {
    // 1) Get account by Riot ID to obtain PUUID
    const accountRes = await fetch(
      `https://${regional}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`,
      { headers, next: { revalidate: 120 } }
    );
    if (!accountRes.ok) {
      const text = await accountRes.text();
      return NextResponse.json({ error: "Failed to fetch account", details: text }, { status: accountRes.status });
    }
    const account = await accountRes.json();
    const puuid: string = account.puuid;

    // 2) Get Summoner by PUUID to obtain encryptedSummonerId
    const summRes = await fetch(
      `https://${platform}.api.riotgames.com/tft/summoner/v1/summoners/by-puuid/${encodeURIComponent(puuid)}`,
      { headers, next: { revalidate: 120 } }
    );
    if (!summRes.ok) {
      const text = await summRes.text();
      return NextResponse.json({ error: "Failed to fetch summoner", details: text }, { status: summRes.status });
    }
    const summ = await summRes.json();
    const summonerId: string = summ.id;

    // 3) Get League entries for rank/LP/wins/losses
    const leagueRes = await fetch(
      `https://${platform}.api.riotgames.com/tft/league/v1/entries/by-summoner/${encodeURIComponent(summonerId)}`,
      { headers, next: { revalidate: 120 } }
    );
    if (!leagueRes.ok) {
      const text = await leagueRes.text();
      return NextResponse.json({ error: "Failed to fetch league entries", details: text }, { status: leagueRes.status });
    }
    const entries = await leagueRes.json();
    const solo = Array.isArray(entries) ? entries.find((e: any) => e.queueType === "RANKED_TFT") || entries[0] : null;

    // 4) Get last N matches to estimate top4 rate (optional, best-effort)
    let top4Rate: number | null = null;
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
          const match = await mRes.json();
          const me = match?.info?.participants?.find((p: any) => p.puuid === puuid);
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
  } catch (err: any) {
    return NextResponse.json({ error: "Unexpected error", details: String(err?.message || err) }, { status: 500 });
  }
}


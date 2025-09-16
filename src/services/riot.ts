type RiotAccount = { puuid: string; gameName: string; tagLine: string }
type Summoner = { id: string; accountId: string; puuid: string; name: string; summonerLevel: number }
type LeagueEntry = { queueType: string; tier: string; rank: string; leaguePoints: number; wins: number; losses: number }

function getRiotKey(): string | null {
  return process.env.RIOT_API_KEY ?? null
}

function getRiotHeaders() {
  const key = getRiotKey()
  if (!key) throw new Error('RIOT_API_KEY manquant')
  return { 'X-Riot-Token': key }
}

export async function getAccountByRiotId(gameName: string, tagLine: string): Promise<RiotAccount | null> {
  const key = getRiotKey()
  if (!key) return null
  const url = `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`
  const res = await fetch(url, { headers: getRiotHeaders(), cache: 'no-store' })
  if (!res.ok) return null
  return (await res.json()) as RiotAccount
}

export async function getLolSummonerByPuuid(puuid: string, platform: 'euw1' | 'eun1' | 'na1' | 'kr' = 'euw1'): Promise<Summoner | null> {
  const key = getRiotKey()
  if (!key) return null
  const url = `https://${platform}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${encodeURIComponent(puuid)}`
  const res = await fetch(url, { headers: getRiotHeaders(), cache: 'no-store' })
  if (!res.ok) return null
  return (await res.json()) as Summoner
}

export async function getLolRankedBySummonerId(summonerId: string, platform: 'euw1' | 'eun1' | 'na1' | 'kr' = 'euw1'): Promise<LeagueEntry[] | null> {
  const key = getRiotKey()
  if (!key) return null
  const url = `https://${platform}.api.riotgames.com/lol/league/v4/entries/by-summoner/${encodeURIComponent(summonerId)}`
  const res = await fetch(url, { headers: getRiotHeaders(), cache: 'no-store' })
  if (!res.ok) return null
  return (await res.json()) as LeagueEntry[]
}

export type LolSummary = {
  gameName: string
  tagLine: string
  soloDuo?: { tier: string; rank: string; lp: number; wins: number; losses: number; winrate: number }
}

export async function getLolSummaryByRiotId(riotId: string, platform: 'euw1' | 'eun1' | 'na1' | 'kr' = 'euw1'): Promise<LolSummary | null> {
  const [name, tag] = riotId.split('#')
  if (!name || !tag) return null
  const account = await getAccountByRiotId(name, tag)
  if (!account) return null
  const summoner = await getLolSummonerByPuuid(account.puuid, platform)
  if (!summoner) return { gameName: account.gameName, tagLine: account.tagLine }
  const entries = await getLolRankedBySummonerId(summoner.id, platform)
  const solo = entries?.find((e) => e.queueType === 'RANKED_SOLO_5x5')
  const winrate = solo ? Math.round((solo.wins / Math.max(1, solo.wins + solo.losses)) * 100) : 0
  return {
    gameName: account.gameName,
    tagLine: account.tagLine,
    soloDuo: solo
      ? { tier: solo.tier, rank: solo.rank, lp: solo.leaguePoints, wins: solo.wins, losses: solo.losses, winrate }
      : undefined,
  }
}

// ===== TFT endpoints =====
type TftSummoner = { id: string; accountId: string; puuid: string; name: string; summonerLevel: number }
type TftLeagueEntry = { queueType: string; tier: string; rank: string; leaguePoints: number; wins: number; losses: number }

export async function getTftSummonerByPuuid(puuid: string, platform: 'euw1' | 'eun1' | 'na1' | 'kr' = 'euw1'): Promise<TftSummoner | null> {
  const key = getRiotKey()
  if (!key) return null
  const url = `https://${platform}.api.riotgames.com/tft/summoner/v1/summoners/by-puuid/${encodeURIComponent(puuid)}`
  const res = await fetch(url, { headers: getRiotHeaders(), cache: 'no-store' })
  if (!res.ok) return null
  return (await res.json()) as TftSummoner
}

export async function getTftRankedBySummonerId(summonerId: string, platform: 'euw1' | 'eun1' | 'na1' | 'kr' = 'euw1'): Promise<TftLeagueEntry[] | null> {
  const key = getRiotKey()
  if (!key) return null
  const url = `https://${platform}.api.riotgames.com/tft/league/v1/entries/by-summoner/${encodeURIComponent(summonerId)}`
  const res = await fetch(url, { headers: getRiotHeaders(), cache: 'no-store' })
  if (!res.ok) return null
  return (await res.json()) as TftLeagueEntry[]
}

export type TftSummary = {
  gameName: string
  tagLine: string
  ranked?: { tier: string; rank: string; lp: number; wins: number; losses: number; winrate: number }
}

export async function getTftSummaryByRiotId(riotId: string, platform: 'euw1' | 'eun1' | 'na1' | 'kr' = 'euw1'): Promise<TftSummary | null> {
  const [name, tag] = riotId.split('#')
  if (!name || !tag) return null
  const account = await getAccountByRiotId(name, tag)
  if (!account) return null
  const summoner = await getTftSummonerByPuuid(account.puuid, platform)
  if (!summoner) return { gameName: account.gameName, tagLine: account.tagLine }
  const entries = await getTftRankedBySummonerId(summoner.id, platform)
  const ranked = entries?.find((e) => e.queueType === 'RANKED_TFT')
  const winrate = ranked ? Math.round((ranked.wins / Math.max(1, ranked.wins + ranked.losses)) * 100) : 0
  return {
    gameName: account.gameName,
    tagLine: account.tagLine,
    ranked: ranked
      ? { tier: ranked.tier, rank: ranked.rank, lp: ranked.leaguePoints, wins: ranked.wins, losses: ranked.losses, winrate }
      : undefined,
  }
}



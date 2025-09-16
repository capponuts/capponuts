type WowCharacter = { name: string; level?: number; realm?: { slug: string } }

function getBlizzardTokenUrl() {
  return 'https://oauth.battle.net/token'
}

async function getAccessToken(): Promise<string | null> {
  const id = process.env.BLIZZARD_CLIENT_ID
  const secret = process.env.BLIZZARD_CLIENT_SECRET
  if (!id || !secret) return null
  const body = new URLSearchParams({ grant_type: 'client_credentials' })
  const res = await fetch(getBlizzardTokenUrl(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString('base64')}`,
    },
    body,
    cache: 'no-store',
  })
  if (!res.ok) return null
  const data = (await res.json()) as { access_token: string }
  return data.access_token
}

export async function getWowCharacter(realmSlug: string, name: string, region: 'eu' | 'us' = 'eu'): Promise<WowCharacter | null> {
  const token = await getAccessToken()
  if (!token) return null
  const ns = `profile-${region}`
  const url = `https://${region}.api.blizzard.com/profile/wow/character/${encodeURIComponent(realmSlug)}/${encodeURIComponent(name.toLowerCase())}?namespace=${ns}&locale=fr_FR`
  const res = await fetch(url, { cache: 'no-store', headers: { Authorization: `Bearer ${token}` } })
  if (!res.ok) return null
  return (await res.json()) as WowCharacter
}



type TwitchUser = { id: string; display_name: string; view_count?: number }

function getTwitchHeaders() {
  const clientId = process.env.TWITCH_CLIENT_ID
  const bearer = process.env.TWITCH_APP_TOKEN
  if (!clientId || !bearer) throw new Error('Twitch creds manquants')
  return { 'Client-Id': clientId, Authorization: `Bearer ${bearer}` }
}

export async function getTwitchUser(login: string): Promise<TwitchUser | null> {
  const clientId = process.env.TWITCH_CLIENT_ID
  const bearer = process.env.TWITCH_APP_TOKEN
  if (!clientId || !bearer) return null
  const res = await fetch(`https://api.twitch.tv/helix/users?login=${encodeURIComponent(login)}`, { headers: getTwitchHeaders(), cache: 'no-store' })
  if (!res.ok) return null
  const data = (await res.json()) as { data: TwitchUser[] }
  return data.data[0] ?? null
}



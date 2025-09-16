type YTChannel = { id: string; statistics?: { viewCount: string; subscriberCount: string; videoCount: string } }

export async function getYouTubeChannelByHandleOrId(idOrHandle: string): Promise<YTChannel | null> {
  const key = process.env.YOUTUBE_API_KEY
  if (!key) return null
  const isHandle = idOrHandle.startsWith('@')
  const url = isHandle
    ? `https://www.googleapis.com/youtube/v3/channels?part=statistics&forHandle=${encodeURIComponent(idOrHandle)}&key=${key}`
    : `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${encodeURIComponent(idOrHandle)}&key=${key}`
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) return null
  const data = (await res.json()) as { items: YTChannel[] }
  return data.items?.[0] ?? null
}



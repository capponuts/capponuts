import { NextResponse } from "next/server";

type HelixUser = {
  id: string;
  login: string;
  display_name: string;
  profile_image_url?: string;
  description?: string;
  view_count?: number;
};

type HelixStream = {
  id: string;
  user_id: string;
  user_login: string;
  user_name: string;
  game_id: string;
  game_name?: string;
  title: string;
  viewer_count: number;
  started_at: string;
  type: string; // "live" or ""
  thumbnail_url: string;
};

type HelixGame = { id: string; name: string; box_art_url?: string };

const TWITCH_API = "https://api.twitch.tv/helix";

function getTwitchHeaders() {
  const clientId = process.env.TWITCH_CLIENT_ID;
  const token = process.env.TWITCH_APP_TOKEN;
  if (!clientId || !token) return null;
  return {
    "Client-Id": clientId,
    Authorization: `Bearer ${token}`,
  } as Record<string, string>;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const login = (searchParams.get("login") || process.env.TWITCH_LOGIN || "capponuts").toLowerCase();

  const headers = getTwitchHeaders();
  if (!headers) {
    return NextResponse.json({ error: "Missing TWITCH_CLIENT_ID or TWITCH_APP_TOKEN" }, { status: 500 });
  }

  try {
    // 1) Get user by login
    const userRes = await fetch(`${TWITCH_API}/users?login=${encodeURIComponent(login)}`, { headers, next: { revalidate: 60 } });
    if (!userRes.ok) {
      const txt = await userRes.text();
      return NextResponse.json({ error: "Failed to fetch user", details: txt }, { status: userRes.status });
    }
    const usersJson = (await userRes.json()) as { data?: HelixUser[] };
    const user = usersJson?.data?.[0];
    if (!user) {
      return NextResponse.json({ error: "User not found", login }, { status: 404 });
    }

    // 2) Get stream by user_id
    const streamRes = await fetch(`${TWITCH_API}/streams?user_id=${encodeURIComponent(user.id)}`, { headers, next: { revalidate: 30 } });
    if (!streamRes.ok) {
      const txt = await streamRes.text();
      return NextResponse.json({ error: "Failed to fetch stream", details: txt }, { status: streamRes.status });
    }
    const streamsJson = (await streamRes.json()) as { data?: HelixStream[] };
    const stream = streamsJson?.data?.[0] || null;

    // 3) Optionally resolve game name
    let game: HelixGame | null = null;
    if (stream?.game_id) {
      const gameRes = await fetch(`${TWITCH_API}/games?id=${encodeURIComponent(stream.game_id)}`, { headers, next: { revalidate: 300 } });
      if (gameRes.ok) {
        const gamesJson = (await gameRes.json()) as { data?: HelixGame[] };
        game = gamesJson?.data?.[0] || null;
      }
    }

    return NextResponse.json(
      {
        user: {
          id: user.id,
          login: user.login,
          displayName: user.display_name,
          avatar: user.profile_image_url ?? null,
          description: user.description ?? null,
          views: user.view_count ?? null,
        },
        stream: stream
          ? {
              live: stream.type === "live",
              title: stream.title,
              viewers: stream.viewer_count,
              startedAt: stream.started_at,
              gameId: stream.game_id,
              gameName: game?.name ?? stream.game_name ?? null,
              thumbnailUrl: stream.thumbnail_url,
            }
          : { live: false },
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: "Unexpected error", details: message }, { status: 500 });
  }
}


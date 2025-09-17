import { NextResponse } from "next/server";

// Fetch WoW character summary using Blizzard Game Data API
// Required env: BLIZZARD_CLIENT_ID, BLIZZARD_CLIENT_SECRET

async function getBlizzardToken(): Promise<string> {
  const clientId = process.env.BLIZZARD_CLIENT_ID;
  const clientSecret = process.env.BLIZZARD_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error("Missing Blizzard credentials");
  const body = new URLSearchParams({ grant_type: "client_credentials" });
  const res = await fetch("https://oauth.battle.net/token", {
    method: "POST",
    headers: {
      Authorization: "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
    // no cache for token
  });
  if (!res.ok) throw new Error("Failed to obtain Blizzard token: " + (await res.text()));
  const json = (await res.json()) as { access_token: string };
  return json.access_token;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = (searchParams.get("name") || process.env.WOW_CHARACTER_NAME || "Dracaufist").toLowerCase();
  const realm = (searchParams.get("realm") || process.env.WOW_REALM_SLUG || "ysondre").toLowerCase();
  const namespace = "profile-eu"; // EU profile
  const locale = "fr_FR";

  try {
    const token = await getBlizzardToken();
    const headers = { Authorization: `Bearer ${token}` } as Record<string, string>;

    // Character Summary
    const base = `https://eu.api.blizzard.com/profile/wow/character/${encodeURIComponent(realm)}/${encodeURIComponent(name)}`;
    const summaryRes = await fetch(`${base}?namespace=${namespace}&locale=${locale}`, { headers, next: { revalidate: 120 } });
    if (!summaryRes.ok) {
      const t = await summaryRes.text();
      return NextResponse.json({ error: "Failed character summary", details: t }, { status: summaryRes.status });
    }
    const summary = await summaryRes.json();

    // Equipment Summary (basic ilvl)
    const equipRes = await fetch(`${base}/equipment?namespace=${namespace}&locale=${locale}`, { headers, next: { revalidate: 120 } });
    type EquipSummary = { equipped_item_level?: number } | null;
    let equip: EquipSummary = null;
    if (equipRes.ok) {
      equip = (await equipRes.json()) as EquipSummary;
    }

    return NextResponse.json(
      {
        name: summary?.name,
        realm: summary?.realm?.name,
        faction: summary?.faction?.name,
        race: summary?.race?.name,
        characterClass: summary?.character_class?.name,
        activeSpec: summary?.active_spec?.name ?? null,
        level: summary?.level,
        averageItemLevel: equip?.equipped_item_level ?? null,
        thumbnail: summary?.media?.avatar_url ?? null,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: "Unexpected error", details: message }, { status: 500 });
  }
}


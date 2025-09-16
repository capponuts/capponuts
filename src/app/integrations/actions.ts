'use server'

import { db } from '@/db/client'
import { integrations } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function upsertDefaultIntegrations() {
  // Crée des intégrations de base pour MVP solo si absentes
  type NewIntegration = typeof integrations.$inferInsert
  const base: ReadonlyArray<Pick<NewIntegration, 'provider' | 'identifier' | 'region'>> = [
    { provider: 'riot', identifier: 'Capponuts#1993', region: 'EUW' },
    { provider: 'blizzard', identifier: 'dracaufist@ysondre', region: 'EU' },
    { provider: 'twitch', identifier: 'capponuts', region: null },
  ] as const

  for (const it of base) {
    const found = await db.select().from(integrations).where(eq(integrations.identifier, it.identifier as string))
    if (found.length === 0) await db.insert(integrations).values(it)
  }
}



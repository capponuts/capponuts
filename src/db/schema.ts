import { pgEnum, pgTable, serial, timestamp, varchar, jsonb, integer } from 'drizzle-orm/pg-core'

export const providerEnum = pgEnum('provider', ['riot', 'blizzard', 'twitch', 'youtube'])
export const eventKindEnum = pgEnum('event_kind', ['game', 'stream'])

export const userProfile = pgTable('user_profile', {
  id: serial('id').primaryKey(),
  displayName: varchar('display_name', { length: 120 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const integrations = pgTable('integrations', {
  id: serial('id').primaryKey(),
  provider: providerEnum('provider').notNull(),
  identifier: varchar('identifier', { length: 256 }).notNull(), // pseudo, channel ID, etc.
  region: varchar('region', { length: 16 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export const timelineEvents = pgTable('timeline_events', {
  id: serial('id').primaryKey(),
  kind: eventKindEnum('kind').notNull(),
  provider: providerEnum('provider').notNull(),
  title: varchar('title', { length: 256 }).notNull(),
  occurredAt: timestamp('occurred_at', { withTimezone: true }).defaultNow().notNull(),
  // Données brutes de l'API (matchId, VOD, MMR, etc.)
  data: jsonb('data').$type<Record<string, unknown>>().notNull(),
})

export const kpisWeekly = pgTable('kpis_weekly', {
  id: serial('id').primaryKey(),
  weekStart: timestamp('week_start', { withTimezone: true }).notNull(),
  provider: providerEnum('provider').notNull(),
  metric: varchar('metric', { length: 64 }).notNull(), // ex: winrate, views, subs
  value: integer('value').notNull(),
})



// Server-only: this module uses @vercel/kv and must not be imported from client components.

import { kv } from '@vercel/kv'

/**
 * Returns all event counts grouped by event name and date.
 * Shape: { 'lesson_completed': { '2026-06-21': 42, '2026-06-20': 31 }, ... }
 */
export async function getAllEventCounts(): Promise<Record<string, Record<string, number>>> {
  // Note: kv.keys scans the full keyspace — acceptable for this bounded set of event keys,
  // but replace with kv.scan for high-cardinality key spaces.
  const keys = await kv.keys('events:*')
  if (keys.length === 0) return {}

  const values = await kv.mget<(number | null)[]>(...keys)

  const result: Record<string, Record<string, number>> = {}
  keys.forEach((key, i) => {
    // key format: events:{event_name}:{YYYY-MM-DD}
    const parts = key.split(':')
    const date = parts[parts.length - 1]
    const eventName = parts.slice(1, -1).join(':')
    if (!result[eventName]) result[eventName] = {}
    result[eventName][date] = Number(values[i] ?? 0)
  })

  return result
}

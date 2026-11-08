import { cacheLife } from "next/cache"
import type { MatchEvent, MatchExtra, SportId } from "@/lib/types"

const EMPTY: MatchExtra = {
  minute: null,
  homeHalf: null,
  awayHalf: null,
  events: [],
}

type RawIncident = {
  time?: number | string | null
  type?: string
  side?: string
  player?: string
  is_goal?: boolean
}

type RawDetail = {
  live_minute?: number | string | null
  home_ht_score?: string | number | null
  away_ht_score?: string | number | null
  incidents?: RawIncident[]
}

function halfScore(value: unknown) {
  if (value === null || value === undefined) return null
  const text = String(value).trim()
  if (!text || text === "-" || text.toLowerCase() === "null") return null
  return text
}

function liveMinute(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value) && value >= 0) return Math.round(value)
  if (typeof value === "string" && /^\d+$/.test(value)) return Number(value)
  return null
}

function eventFrom(raw: RawIncident): MatchEvent | null {
  const type = raw.type?.trim().toLowerCase() ?? ""
  const goal = raw.is_goal === true || type.includes("goal")
  const red = type.includes("red")
  if (!goal && !red) return null

  const side = raw.side === "away" ? "away" : "home"
  const minute = raw.time === null || raw.time === undefined ? "" : String(raw.time).trim()
  const player = raw.player?.trim() ?? ""
  const note = type.includes("own") ? "og" : type.includes("pen") ? "pen" : null

  return {
    minute,
    kind: goal ? "goal" : "red",
    side,
    player,
    note,
  }
}

function minuteOrder(value: string) {
  const match = /^(\d+)/.exec(value)
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER
}

export async function getMatchExtra(sport: SportId, slug: string): Promise<MatchExtra> {
  "use cache"
  cacheLife({ stale: 120, revalidate: 300, expire: 900 })

  if (sport !== "football" || !/^[a-z0-9-]{2,160}$/i.test(slug)) return EMPTY

  const url = new URL("https://sportscore.com/api/widget/match/")
  url.searchParams.set("sport", sport)
  url.searchParams.set("slug", slug)

  const response = await fetch(url, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "User-Agent": "game-notifier/0.1",
    },
    signal: AbortSignal.timeout(12_000),
  })

  if (response.status === 404) return EMPTY
  if (!response.ok) {
    throw new Error(`${sport} match ${slug} returned ${response.status}`)
  }

  const body = (await response.json()) as { match?: RawDetail }
  const match = body.match
  if (!match) return EMPTY

  const events = (Array.isArray(match.incidents) ? match.incidents : [])
    .map(eventFrom)
    .filter((event): event is MatchEvent => event !== null)
    .sort((a, b) => minuteOrder(a.minute) - minuteOrder(b.minute) || a.player.localeCompare(b.player))

  return {
    minute: liveMinute(match.live_minute),
    homeHalf: halfScore(match.home_ht_score),
    awayHalf: halfScore(match.away_ht_score),
    events,
  }
}

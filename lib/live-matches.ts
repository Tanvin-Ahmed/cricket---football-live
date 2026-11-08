import { cacheLife } from "next/cache"
import { describeMatch } from "@/lib/match-info"
import type { LiveBoard, LiveMatch, SportId, SportSection } from "@/lib/types"

const SPORT_LABEL: Record<SportId, string> = {
  cricket: "Cricket",
  football: "Football",
}

type RawMatch = {
  home?: string
  away?: string
  home_logo?: string
  away_logo?: string
  home_score?: string | number | null
  away_score?: string | number | null
  status?: string
  status_text?: string
  time?: string
  competition?: string
  url?: string
}

type RawEnvelope = {
  count?: number
  matches?: RawMatch[]
}

function utcDay(offset: number) {
  const now = new Date()
  const day = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + offset))
  return day.toISOString().slice(0, 10)
}

function httpsUrl(value: unknown) {
  if (typeof value !== "string" || !value) return null
  try {
    const url = new URL(value)
    return url.protocol === "https:" ? url.toString() : null
  } catch {
    return null
  }
}

function matchHref(value: unknown) {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) return null
  return `https://sportscore.com${value}`
}

function matchSlug(value: unknown) {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) return null
  const parts = value.split("/").filter(Boolean)
  const matchIndex = parts.indexOf("match")
  const slug = matchIndex >= 0 ? parts[matchIndex + 1] : parts.at(-1)
  if (!slug || !/^[a-z0-9-]{2,160}$/i.test(slug)) return null
  return slug
}

function kickoffTime(value: unknown) {
  if (typeof value !== "string" || !value.trim()) return null
  const time = Date.parse(value)
  return Number.isNaN(time) ? null : new Date(time).toISOString()
}

function scoreText(value: unknown) {
  if (value === null || value === undefined) return "–"
  const text = String(value).trim()
  if (!text || text === "-" || text.toLowerCase() === "null") return "–"
  return text
}

async function fetchLiveDay(sport: SportId, date: string) {
  const url = new URL("https://sportscore.com/api/v1/fixtures/")
  url.searchParams.set("sport", sport)
  url.searchParams.set("status", "live")
  url.searchParams.set("date", date)
  url.searchParams.set("limit", "200")

  const response = await fetch(url, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "User-Agent": "game-notifier/0.1",
    },
    signal: AbortSignal.timeout(12_000),
  })

  if (!response.ok) {
    throw new Error(`${sport} fixtures for ${date} returned ${response.status}`)
  }

  const body = (await response.json()) as RawEnvelope
  const matches = Array.isArray(body.matches) ? body.matches : []
  return {
    matches,
    capped: matches.length >= 200 || (body.count ?? 0) >= 200,
  }
}

function toMatch(sport: SportId, raw: RawMatch): LiveMatch | null {
  const home = raw.home?.trim()
  const away = raw.away?.trim()
  if (!home || !away) return null
  if (raw.status && raw.status !== "live") return null

  const competition = raw.competition?.trim() || "Competition"
  const info = describeMatch({ sport, competition, home, away })
  const href = matchHref(raw.url)
  const kickoff = kickoffTime(raw.time)

  return {
    id: href || `${sport}:${home}:${away}:${kickoff ?? ""}`,
    slug: matchSlug(raw.url),
    home,
    away,
    homeLogo: httpsUrl(raw.home_logo),
    awayLogo: httpsUrl(raw.away_logo),
    homeFlag: info.homeFlag,
    awayFlag: info.awayFlag,
    homeScore: scoreText(raw.home_score),
    awayScore: scoreText(raw.away_score),
    statusText: raw.status_text?.trim() || "Live",
    kickoff,
    competition,
    competitionFlag: info.competitionFlag,
    tags: info.tags,
    href,
  }
}

async function loadSport(sport: SportId): Promise<SportSection> {
  const label = SPORT_LABEL[sport]
  const days = await Promise.allSettled([fetchLiveDay(sport, utcDay(-1)), fetchLiveDay(sport, utcDay(0))])
  const fulfilled = days.filter((day) => day.status === "fulfilled")

  if (fulfilled.length === 0) {
    return {
      sport,
      label,
      totalLive: 0,
      matches: [],
      error: `${label} scores are unavailable right now.`,
      capped: false,
    }
  }

  const seen = new Set<string>()
  const matches: LiveMatch[] = []
  let capped = false

  for (const day of fulfilled) {
    capped = capped || day.value.capped
    for (const raw of day.value.matches) {
      const match = toMatch(sport, raw)
      if (!match || seen.has(match.id)) continue
      seen.add(match.id)
      matches.push(match)
    }
  }

  matches.sort(
    (a, b) =>
      a.competition.localeCompare(b.competition) ||
      a.home.localeCompare(b.home) ||
      a.away.localeCompare(b.away),
  )

  return {
    sport,
    label,
    totalLive: matches.length,
    matches,
    error: null,
    capped,
  }
}

export async function getLiveBoard(): Promise<LiveBoard> {
  "use cache"
  cacheLife({ stale: 30, revalidate: 60, expire: 180 })

  const [cricket, football] = await Promise.all([loadSport("cricket"), loadSport("football")])

  return {
    updatedAt: new Date().toISOString(),
    cricket,
    football,
  }
}

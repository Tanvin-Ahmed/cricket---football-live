export type SportId = "cricket" | "football"

export type Flag = {
  code: string
  name: string
}

export type MatchEvent = {
  minute: string
  kind: "goal" | "red"
  side: "home" | "away"
  player: string
  note: "pen" | "og" | null
}

export type MatchExtra = {
  minute: number | null
  homeHalf: string | null
  awayHalf: string | null
  events: MatchEvent[]
}

export type LiveMatch = {
  id: string
  slug: string | null
  home: string
  away: string
  homeLogo: string | null
  awayLogo: string | null
  homeFlag: Flag | null
  awayFlag: Flag | null
  homeScore: string
  awayScore: string
  statusText: string
  kickoff: string | null
  competition: string
  competitionFlag: Flag | null
  tags: string[]
  href: string | null
}

export type SportSection = {
  sport: SportId
  label: string
  totalLive: number
  matches: LiveMatch[]
  error: string | null
  capped: boolean
}

export type LiveBoard = {
  updatedAt: string
  cricket: SportSection
  football: SportSection
}

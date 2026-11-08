"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Flag, LiveBoard, LiveMatch, MatchEvent, MatchExtra, SportId, SportSection } from "@/lib/types"

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const SCORE_REFRESH_MS = 60_000
const DETAIL_REFRESH_MS = 5 * 60_000

function formatCountdown(ms: number) {
  const total = Math.max(0, Math.ceil(ms / 1000))
  const minutes = Math.floor(total / 60)
  const seconds = total % 60
  return `${minutes}:${String(seconds).padStart(2, "0")}`
}

function RefreshCountdown({
  label,
  remaining,
  className,
}: {
  label: string
  remaining: number
  className: string
}) {
  const urgent = remaining <= 10_000

  return (
    <Card className={`gap-1 py-3 ring-2 ${className} ${urgent ? "animate-pulse" : ""}`}>
      <CardHeader className="gap-1 px-3">
        <CardDescription className="text-xs font-bold tracking-wide text-current uppercase">
          {label}
        </CardDescription>
        <CardTitle className="text-4xl font-bold tabular-nums leading-none">{formatCountdown(remaining)}</CardTitle>
        <p className="text-sm font-semibold text-current">until refresh</p>
      </CardHeader>
    </Card>
  )
}

function formatLocal(iso: string | null) {
  if (!iso) return ""
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ""
  const day = String(date.getDate()).padStart(2, "0")
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")
  return `${day} ${MONTHS[date.getMonth()]} ${hours}:${minutes}`
}

function eventLabel(event: MatchEvent) {
  const minute = event.minute ? `${event.minute}′` : ""
  const note = event.note === "pen" ? " (pen)" : event.note === "og" ? " (og)" : ""
  if (!event.player) {
    if (event.kind === "red") return `${minute} Red card`.trim()
    return `${minute}${note}`.trim() || "Goal"
  }
  const card = event.kind === "red" ? "Red card " : ""
  return `${card}${minute} ${event.player}${note}`.replace(/\s+/g, " ").trim()
}

function initials(name: string) {
  const parts = name.split(/\s+/).filter(Boolean)
  return (parts[0]?.[0] ?? "").concat(parts[1]?.[0] ?? "").toUpperCase() || "?"
}

function Mark({ flag, logo, name }: { flag: Flag | null; logo: string | null; name: string }) {
  const [flagFailed, setFlagFailed] = useState(false)
  const [logoFailed, setLogoFailed] = useState(false)

  if (flag && !flagFailed) {
    return (
      <Image
        src={`https://flagcdn.com/48x36/${flag.code}.png`}
        width={24}
        height={18}
        alt=""
        title={flag.name}
        unoptimized
        className="h-[18px] w-6 shrink-0 rounded-[3px] object-cover ring-1 ring-black/15"
        onError={() => setFlagFailed(true)}
      />
    )
  }

  if (logo && !logoFailed) {
    return (
      <Image
        src={logo}
        alt=""
        width={20}
        height={20}
        unoptimized
        className="size-5 shrink-0 rounded-full bg-white object-contain ring-1 ring-black/10"
        onError={() => setLogoFailed(true)}
      />
    )
  }

  return (
    <span
      aria-hidden
      className="grid size-5 shrink-0 place-items-center rounded-full bg-muted text-[9px] font-semibold"
    >
      {initials(name)}
    </span>
  )
}

function Side({ flag, logo, name }: { flag: Flag | null; logo: string | null; name: string }) {
  return (
    <span className="inline-flex max-w-full items-center gap-1.5">
      <Mark flag={flag} logo={logo} name={name} />
      <span className="break-words">{name}</span>
    </span>
  )
}

function EventSide({ name, events }: { name: string; events: MatchEvent[] }) {
  if (events.length === 0) return null
  return (
    <span className="block leading-6">
      <span className="font-semibold">{name}</span>
      <span className="text-muted-foreground"> {events.map(eventLabel).join(" · ")}</span>
    </span>
  )
}

function MatchRow({ match, index, extra }: { match: LiveMatch; index: number; extra?: MatchExtra }) {
  const showCompetitionFlag = Boolean(match.competitionFlag && (!match.homeFlag || !match.awayFlag))
  const hasScore = match.homeScore !== "–" || match.awayScore !== "–"
  const firstHalf = /1st|first/i.test(match.statusText)
  const hasHalf = Boolean(extra?.homeHalf && extra?.awayHalf) && !firstHalf
  const goals = extra?.events.filter((event) => event.kind === "goal") ?? []
  const reds = extra?.events.filter((event) => event.kind === "red") ?? []
  const kickoff = formatLocal(match.kickoff)
  const className = "flex gap-3 px-4 py-3.5 transition-colors hover:bg-muted/70"

  const body = (
    <>
      <span className="w-7 shrink-0 pt-0.5 text-base font-semibold tabular-nums text-muted-foreground">
        {index}.
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-start justify-between gap-3">
          <span className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1 text-base font-semibold leading-6">
            <Side flag={match.homeFlag} logo={match.homeLogo} name={match.home} />
            <span className="text-sm font-normal text-muted-foreground">vs</span>
            <Side flag={match.awayFlag} logo={match.awayLogo} name={match.away} />
          </span>
          {hasScore ? (
            <span className="shrink-0 pt-0.5 text-base font-bold tabular-nums leading-6">
              {match.homeScore}
              <span className="px-1 font-semibold text-muted-foreground">–</span>
              {match.awayScore}
            </span>
          ) : null}
        </span>
        <span className="mt-1.5 flex flex-wrap items-center gap-1.5 text-sm leading-5">
          <Badge variant="destructive">
            <span className="size-1.5 rounded-full bg-current" aria-hidden />
            {match.statusText}
          </Badge>
          {extra?.minute != null ? <Badge variant="outline">{extra.minute}′</Badge> : null}
          {hasHalf ? (
            <Badge variant="secondary">
              HT {extra?.homeHalf}–{extra?.awayHalf}
            </Badge>
          ) : null}
        </span>
        {goals.length > 0 ? (
          <span className="mt-1.5 block text-sm">
            <EventSide name={match.home} events={goals.filter((event) => event.side === "home")} />
            <EventSide name={match.away} events={goals.filter((event) => event.side === "away")} />
          </span>
        ) : null}
        {reds.length > 0 ? (
          <span className="mt-1 block text-sm">
            <EventSide name={match.home} events={reds.filter((event) => event.side === "home")} />
            <EventSide name={match.away} events={reds.filter((event) => event.side === "away")} />
          </span>
        ) : null}
        {match.tags.length > 0 ? (
          <span className="mt-2 flex flex-wrap gap-1.5">
            {match.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </span>
        ) : null}
        <span className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm leading-5 text-muted-foreground">
          {showCompetitionFlag && match.competitionFlag ? (
            <Image
              src={`https://flagcdn.com/48x36/${match.competitionFlag.code}.png`}
              width={16}
              height={12}
              alt=""
              title={match.competitionFlag.name}
              unoptimized
              className="h-3 w-4 shrink-0 rounded-[2px] object-cover ring-1 ring-black/10"
            />
          ) : null}
          <span>{match.competition}</span>
          {kickoff ? <span suppressHydrationWarning>Kickoff {kickoff}</span> : null}
        </span>
      </span>
    </>
  )

  if (!match.href) {
    return <li className={className}>{body}</li>
  }

  return (
    <li>
      <a
        href={match.href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${className} outline-none focus-visible:bg-muted focus-visible:ring-2 focus-visible:ring-ring`}
      >
        {body}
      </a>
    </li>
  )
}

function SportPanel({
  section,
  active,
  extras,
}: {
  section: SportSection
  active: boolean
  extras: Record<string, MatchExtra>
}) {
  const accent = section.sport === "cricket" ? "bg-amber-500" : "bg-emerald-600"

  return (
    <Card
      role="region"
      aria-label={section.label}
      className={`min-w-0 gap-0 py-0 ${active ? "flex" : "hidden md:flex"}`}
    >
      <div className={`h-1 ${accent}`} />
      <CardHeader className="border-b">
        <CardTitle className="text-xl font-bold">{section.label}</CardTitle>
        <CardDescription className="flex items-baseline gap-2 text-base">
          <span className="text-4xl font-bold text-foreground tabular-nums">{section.totalLive}</span>
          live worldwide
        </CardDescription>
        {section.capped ? <p className="text-sm text-muted-foreground">Showing 200 live matches. More may be in play.</p> : null}
      </CardHeader>
      <CardContent className="px-0">
        {section.error ? (
          <p role="alert" className="px-4 py-8 text-sm text-muted-foreground">
            {section.error}
          </p>
        ) : section.matches.length === 0 ? (
          <p className="px-4 py-10 text-sm text-muted-foreground">No live matches right now.</p>
        ) : (
          <ol className="divide-y md:max-h-[calc(100dvh-16rem)] md:overflow-y-auto">
            {section.matches.map((match, index) => (
              <MatchRow key={match.id} match={match} index={index + 1} extra={extras[match.id]} />
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  )
}

export function LiveBoard({ initial }: { initial: LiveBoard }) {
  const [board, setBoard] = useState(initial)
  const [tab, setTab] = useState<SportId>("cricket")
  const [refreshing, setRefreshing] = useState(false)
  const [problem, setProblem] = useState<string | null>(null)
  const [extras, setExtras] = useState<Record<string, MatchExtra>>({})
  const [scoreLeft, setScoreLeft] = useState(SCORE_REFRESH_MS)
  const [detailLeft, setDetailLeft] = useState(DETAIL_REFRESH_MS)
  const updated = formatLocal(board.updatedAt)
  const busy = useRef(false)
  const footballRef = useRef(board.football.matches)
  const refreshNow = useRef<() => Promise<void>>(async () => {})

  const refresh = useCallback(async () => {
    if (busy.current) return
    busy.current = true
    setRefreshing(true)
    try {
      const response = await fetch("/api/live", {
        cache: "no-store",
        signal: AbortSignal.timeout(20_000),
      })
      if (!response.ok) throw new Error("Refresh failed")
      const next = (await response.json()) as LiveBoard
      setBoard(next)
      setProblem(null)
    } catch {
      setProblem("Couldn't refresh. Showing the last scores.")
    } finally {
      busy.current = false
      setRefreshing(false)
    }
  }, [])

  const loadExtras = useCallback(async () => {
    const items = footballRef.current
      .filter((match) => match.slug)
      .map((match) => ({ id: match.id, sport: "football" as const, slug: match.slug }))
    if (items.length === 0) return
    try {
      const response = await fetch("/api/live/details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
        cache: "no-store",
        signal: AbortSignal.timeout(20_000),
      })
      if (!response.ok) return
      const body = (await response.json()) as { extras?: Record<string, MatchExtra> }
      if (!body.extras) return
      setExtras((current) => ({ ...current, ...body.extras }))
    } catch {
      // The score list stays visible when play details are slow.
    }
  }, [])

  useEffect(() => {
    footballRef.current = board.football.matches
  }, [board.football.matches])

  useEffect(() => {
    let cancelled = false
    const scoreDue = { at: Date.now() + SCORE_REFRESH_MS }
    const detailDue = { at: Date.now() + DETAIL_REFRESH_MS }
    const timers = { score: 0, detail: 0 }

    const armScore = () => {
      window.clearTimeout(timers.score)
      scoreDue.at = Date.now() + SCORE_REFRESH_MS
      setScoreLeft(SCORE_REFRESH_MS)
      timers.score = window.setTimeout(() => {
        void refresh().finally(() => {
          if (!cancelled) armScore()
        })
      }, SCORE_REFRESH_MS)
    }

    const armDetail = () => {
      window.clearTimeout(timers.detail)
      detailDue.at = Date.now() + DETAIL_REFRESH_MS
      setDetailLeft(DETAIL_REFRESH_MS)
      timers.detail = window.setTimeout(() => {
        void loadExtras().finally(() => {
          if (!cancelled) armDetail()
        })
      }, DETAIL_REFRESH_MS)
    }

    timers.score = window.setTimeout(() => {
      void refresh().finally(() => {
        if (!cancelled) armScore()
      })
    }, SCORE_REFRESH_MS)
    timers.detail = window.setTimeout(() => {
      void loadExtras().finally(() => {
        if (!cancelled) armDetail()
      })
    }, DETAIL_REFRESH_MS)
    void loadExtras()

    const tick = window.setInterval(() => {
      const now = Date.now()
      setScoreLeft(Math.max(0, scoreDue.at - now))
      setDetailLeft(Math.max(0, detailDue.at - now))
    }, 1000)

    refreshNow.current = async () => {
      window.clearTimeout(timers.score)
      window.clearTimeout(timers.detail)
      setScoreLeft(0)
      setDetailLeft(0)
      await Promise.all([refresh(), loadExtras()])
      if (cancelled) return
      armScore()
      armDetail()
    }

    return () => {
      cancelled = true
      window.clearTimeout(timers.score)
      window.clearTimeout(timers.detail)
      window.clearInterval(tick)
      refreshNow.current = async () => {}
    }
  }, [refresh, loadExtras])

  return (
    <div>
      <div className="mb-3 space-y-1">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground" suppressHydrationWarning>
            {problem ?? (refreshing ? "Updating scores…" : `Updated ${updated}`)}
          </p>
          <Button type="button" variant="outline" size="sm" onClick={() => void refreshNow.current()} disabled={refreshing}>
            <RefreshCw className={refreshing ? "animate-spin" : undefined} />
            Refresh
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <RefreshCountdown
            label="Scores"
            remaining={scoreLeft}
            className="bg-amber-500/15 text-amber-950 ring-amber-500 dark:bg-amber-400/20 dark:text-amber-50"
          />
          <RefreshCountdown
            label="Match details"
            remaining={detailLeft}
            className="bg-emerald-600/15 text-emerald-950 ring-emerald-600 dark:bg-emerald-400/20 dark:text-emerald-50"
          />
        </div>
      </div>

      <Separator className="mb-4" />

      <Tabs
        value={tab}
        onValueChange={(value) => setTab(value as SportId)}
        className="sticky top-0 z-20 -mx-4 mb-4 bg-background/95 px-4 py-2 backdrop-blur md:hidden"
      >
        <TabsList className="grid h-auto w-full grid-cols-2">
          {([board.cricket, board.football] as const).map((section) => (
            <TabsTrigger key={section.sport} value={section.sport} className="h-auto flex-col gap-0 py-2">
              <span className="text-base font-bold">{section.label}</span>
              <span className="text-sm font-semibold tabular-nums">{section.totalLive} live</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-2">
        <SportPanel section={board.cricket} active={tab === "cricket"} extras={extras} />
        <SportPanel section={board.football} active={tab === "football"} extras={extras} />
      </div>
    </div>
  )
}

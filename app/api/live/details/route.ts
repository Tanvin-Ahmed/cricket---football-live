import { getMatchExtra } from "@/lib/match-extra"
import type { MatchExtra, SportId } from "@/lib/types"

const SLUG = /^[a-z0-9-]{2,160}$/i

type DetailRequest = {
  id?: unknown
  sport?: unknown
  slug?: unknown
}

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ extras: {} }, { status: 400 })
  }

  const items = Array.isArray((body as { items?: unknown }).items)
    ? ((body as { items: unknown[] }).items.slice(0, 80) as DetailRequest[])
    : []

  const extras: Record<string, MatchExtra> = {}

  await Promise.all(
    items.map(async (item) => {
      if (item.sport !== "football" || typeof item.id !== "string" || typeof item.slug !== "string") return
      if (!SLUG.test(item.slug)) return
      try {
        const extra = await getMatchExtra(item.sport as SportId, item.slug)
        const useful =
          extra.minute !== null ||
          (extra.homeHalf !== null && extra.awayHalf !== null) ||
          extra.events.length > 0
        if (useful) extras[item.id] = extra
      } catch {
        // Keep the score from the live list when one match detail is unavailable.
      }
    }),
  )

  return Response.json(
    { extras },
    { headers: { "Cache-Control": "private, max-age=60" } },
  )
}

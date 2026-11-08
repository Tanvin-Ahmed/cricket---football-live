import { getLiveBoard } from "@/lib/live-matches"

export async function GET() {
  const board = await getLiveBoard()
  return Response.json(board, {
    headers: {
      "Cache-Control": "public, max-age=30, stale-while-revalidate=30",
    },
  })
}

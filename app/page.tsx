import { Suspense } from "react"
import { ApiReference } from "@/components/api-reference"
import { BoardSkeleton } from "@/components/board-skeleton"
import { LiveBoard } from "@/components/live-board"
import { ThemeToggle } from "@/components/theme-toggle"
import { getLiveBoard } from "@/lib/live-matches"

export default function Page() {
  return (
    <main className="flex flex-1 flex-col bg-muted/40">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-5 sm:px-6 lg:max-w-[1600px] xl:max-w-[1800px]">
        <header className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Worldwide</p>
            <h1 className="mt-1 text-3xl font-bold sm:text-4xl">Live cricket and football</h1>
            <p className="mt-2 max-w-2xl text-base leading-6 text-muted-foreground">
              Every match in play right now, with the score, scorers, and competition type.
            </p>
          </div>
          <ThemeToggle />
        </header>
        <Suspense fallback={<BoardSkeleton />}>
          <LiveSection />
        </Suspense>
        <footer className="mt-6 text-sm text-muted-foreground">
          <a
            href="https://sportscore.com/"
            rel="dofollow"
            title="Sports data by SportScore"
            className="font-medium text-foreground underline-offset-2 hover:underline"
          >
            Powered by SportScore
          </a>
        </footer>
        <ApiReference />
      </div>
    </main>
  )
}

async function LiveSection() {
  const board = await getLiveBoard()
  return <LiveBoard initial={board} />
}

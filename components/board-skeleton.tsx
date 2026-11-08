import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

function PanelSkeleton({ accent }: { accent: string }) {
  return (
    <Card className="gap-0 py-0">
      <div className={`h-1 ${accent}`} />
      <CardHeader className="border-b">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-9 w-40" />
      </CardHeader>
      <CardContent className="space-y-4 px-4 py-4">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-5 w-4/5" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function BoardSkeleton() {
  return (
    <div role="status" className="grid gap-4 md:grid-cols-2">
      <span className="sr-only">Loading live matches</span>
      <PanelSkeleton accent="bg-amber-500" />
      <div className="hidden md:block">
        <PanelSkeleton accent="bg-emerald-600" />
      </div>
    </div>
  )
}

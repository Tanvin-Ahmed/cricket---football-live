"use client"

import { ChevronsUpDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

type Field = {
  name: string
  required: boolean
  detail: string
}

type EndpointDoc = {
  id: string
  method: "GET" | "POST"
  path: string
  summary: string
  auth: string
  fieldsTitle: string
  fields: Field[]
  response: string
  rate: string
  notes: string[]
}

const ENDPOINTS: EndpointDoc[] = [
  {
    id: "app-live",
    method: "GET",
    path: "/api/live",
    summary: "Live cricket and football board used by this page. Counts, scores, flags, and competition tags are already normalized.",
    auth: "None. Same origin as this app.",
    fieldsTitle: "Query",
    fields: [
      { name: "(none)", required: false, detail: "The route takes no query parameters. It always returns matches that are live now." },
    ],
    response: `{
  "updatedAt": "2026-11-08T07:08:00.000Z",
  "cricket": {
    "sport": "cricket",
    "label": "Cricket",
    "totalLive": 4,
    "error": null,
    "capped": false,
    "matches": [
      {
        "id": "https://sportscore.com/cricket/match/pakistan-u19-vs-india-u19/",
        "slug": "pakistan-u19-vs-india-u19",
        "home": "India U19",
        "away": "Pakistan U19",
        "homeLogo": "https://img.thesports.com/...",
        "awayLogo": "https://img.thesports.com/...",
        "homeFlag": { "code": "in", "name": "India" },
        "awayFlag": { "code": "pk", "name": "Pakistan" },
        "homeScore": "–",
        "awayScore": "–",
        "statusText": "1st innings (home)",
        "kickoff": "2026-11-08T05:00:00.000Z",
        "competition": "ACC MEN'S U19 ASIA CUP",
        "competitionFlag": null,
        "tags": ["Asia", "U19"],
        "href": "https://sportscore.com/cricket/match/pakistan-u19-vs-india-u19/"
      }
    ]
  },
  "football": { "sport": "football", "label": "Football", "totalLive": 25, "matches": [], "error": null, "capped": false }
}`,
    rate: "The browser calls this every 60 seconds. The response is cached for 30 seconds (Cache-Control: public, max-age=30, stale-while-revalidate=30). The server reuses one SportScore fetch for about 60 seconds, so many visitors share the same upstream request.",
    notes: [
      "HTTP 200 even when one sport fails. That sport then has error set and matches as an empty array.",
      "homeScore and awayScore are \"–\" when the feed has no score yet. Cricket scores such as 162/2 are passed through.",
      "kickoff is an ISO timestamp. The page formats it in the viewer's local time.",
      "capped is true when a day returns 200 matches, which is the upstream page size. More matches may be live.",
      "tags are inferred here from the competition and team names. SportScore does not send a separate format field.",
      "Each refresh asks SportScore for yesterday and today in UTC, for both sports: 4 upstream requests.",
    ],
  },
  {
    id: "app-details",
    method: "POST",
    path: "/api/live/details",
    summary: "Football play details for matches already returned by /api/live: live minute, half-time score, goals, and red cards.",
    auth: "None. Send Content-Type: application/json.",
    fieldsTitle: "Body",
    fields: [
      { name: "items", required: true, detail: "Array of match lookups. More than 80 items are ignored." },
      { name: "items[].id", required: true, detail: "Any string. It is echoed back as the key in extras. This app uses the match href." },
      { name: "items[].sport", required: true, detail: "Only \"football\" is loaded. Other sports are skipped." },
      { name: "items[].slug", required: true, detail: "Lowercase slug, 2–160 characters, letters, numbers, and hyphens. Taken from the path segment after /match/." },
    ],
    response: `{
  "extras": {
    "https://sportscore.com/football/match/vissel-kobe-vs-urawa-red-diamonds/": {
      "minute": 67,
      "homeHalf": "1",
      "awayHalf": "0",
      "events": [
        { "minute": "43", "kind": "goal", "side": "home", "player": "Yoshinori Muto", "note": null },
        { "minute": "69", "kind": "goal", "side": "away", "player": "Ryoma Watanabe", "note": null },
        { "minute": "55", "kind": "red", "side": "away", "player": "Yuto Yamada", "note": null }
      ]
    }
  }
}`,
    rate: "The page requests this every 5 minutes, and again when Refresh is pressed. The response may be cached privately for 60 seconds. Each football slug is cached on the server for about 5 minutes (revalidate 300 seconds, expire 900 seconds).",
    notes: [
      "Invalid JSON returns HTTP 400 and { \"extras\": {} }.",
      "A match is omitted from extras when it has no minute, no half-time pair, and no goals or red cards.",
      "note is \"pen\" for a penalty, \"og\" for an own goal, or null.",
      "kind is \"goal\" or \"red\". Yellow cards and substitutions are not returned.",
      "One failed upstream match does not fail the whole request. That id is simply absent.",
      "Cricket detail calls are not made. The list endpoint already carries the cricket score.",
    ],
  },
  {
    id: "sportscore-fixtures",
    method: "GET",
    path: "https://sportscore.com/api/v1/fixtures/",
    summary: "SportScore day list. This is the source for the live counts and the match rows.",
    auth: "No key for anonymous use. A free registered key can be sent as the X-Api-Key header.",
    fieldsTitle: "Query",
    fields: [
      { name: "sport", required: false, detail: "football, basketball, cricket, or tennis. Default football. This app sends cricket or football." },
      { name: "date", required: false, detail: "UTC calendar day, YYYY-MM-DD. Default is today UTC. This app requests yesterday and today, then drops duplicates." },
      { name: "status", required: false, detail: "live, finished, or upcoming. This app sends live." },
      { name: "competition", required: false, detail: "Competition slug. Not used by this app." },
      { name: "team", required: false, detail: "Team slug. Not used by this app." },
      { name: "limit", required: false, detail: "Integer, maximum 200, default 100. This app sends 200." },
    ],
    response: `{
  "sport": "football",
  "date": "2026-11-08",
  "count": 25,
  "matches": [
    {
      "home": "Adelaide United",
      "away": "Melbourne Victory",
      "home_logo": "https://img.thesports.com/football/team/....png",
      "away_logo": "https://img.thesports.com/football/team/....png",
      "home_score": "1",
      "away_score": "0",
      "status": "live",
      "status_text": "1st half",
      "time": "2026-11-08T06:00:00+00:00",
      "competition": "Australia A-League",
      "competition_logo": "https://img.thesports.com/football/competition/....png",
      "url": "/football/match/adelaide-united-vs-melbourne-victory/vjxm8ghe14e1r6o/"
    }
  ]
}`,
    rate: "Free tier: about 10,000 requests per 24 hours per IP. Anonymous traffic is also limited to about 15 requests per second. A free registered key raises the speed limit to 6,000 requests per minute. Any page that renders this data must show a visible dofollow link to https://sportscore.com/ with the text Powered by SportScore.",
    notes: [
      "CORS is open. A browser can call this URL directly.",
      "Responses are cached by SportScore for about 60 seconds.",
      "home_score and away_score may be \"-\", null, or a cricket figure such as \"162/2\".",
      "Football urls contain a readable slug and then a provider id. Cricket urls usually contain only the slug.",
      "This list does not include the live minute, half-time score, or goal incidents. Those come from the match endpoint.",
      "OpenAPI: https://sportscore.com/developers/openapi.yaml",
      "Terms: https://sportscore.com/developers/terms/",
    ],
  },
  {
    id: "sportscore-match",
    method: "GET",
    path: "https://sportscore.com/api/widget/match/",
    summary: "SportScore single-match detail. /api/v1/match/ is the same contract. This app uses it for football minutes, half-time scores, and incidents.",
    auth: "No key for anonymous use. Same free-tier rules as the fixtures endpoint.",
    fieldsTitle: "Query",
    fields: [
      { name: "sport", required: true, detail: "football, basketball, cricket, or tennis." },
      { name: "slug", required: true, detail: "The readable slug after /match/. For /football/match/ad-san-carlos-vs-municipal-perez-zeledon/k82rekhgdx89rep/ the slug is ad-san-carlos-vs-municipal-perez-zeledon, not the trailing id." },
    ],
    response: `{
  "sport": "football",
  "updated": "2026-11-08T06:46:55.024440+00:00",
  "match": {
    "home": "AD San Carlos",
    "away": "Municipal Pérez Zeledón",
    "home_score": "1",
    "away_score": "1",
    "home_ht_score": "0",
    "away_ht_score": "0",
    "status": "finished",
    "status_text": "Finished",
    "live_minute": null,
    "time": "2026-11-08T00:00:00+00:00",
    "competition": "Costa Rica Primera Division",
    "url": "/football/match/ad-san-carlos-vs-municipal-perez-zeledon/k82rekhgdx89rep/",
    "incidents": [
      { "time": 66, "type": "Penalty goal", "type_id": 8, "side": "away", "player": "Wilber Renteria", "is_goal": true, "home_score": 0, "away_score": 1 }
    ],
    "stats": [],
    "lineups": { "confirmed": true, "home_xi": [], "away_xi": [] },
    "tracker": { "id": "23xmvjcl93j0mg8", "profile": "47q3ktv6gh1u8mx", "sport": "football" }
  }
}`,
    rate: "Counts toward the same free-tier budget: about 10,000 requests per 24 hours per IP, about 15 requests per second without a key, or 6,000 requests per minute with a free X-Api-Key. The attribution link is required on every page that shows the data.",
    notes: [
      "HTTP 404 when the slug does not match a match. This app treats 404 as an empty detail and caches that result.",
      "live_minute is a number while the clock is running, and null before kickoff or after the match ends.",
      "During the first half, home_ht_score and away_ht_score can echo the current score. This app shows them as half-time only after the first half.",
      "Incidents include goals, cards, and substitutions. player may be an empty string. This app keeps goals and red cards only.",
      "Goal type text can be \"Goal\", \"Penalty goal\", or an own goal. type_id 1 is a goal and type_id 8 is a penalty goal in the samples used here.",
      "lineups include name, number, position, captain, and rating when the provider has them. This app does not display lineups.",
      "A free key can be created at https://sportscore.com/developers/api/key/.",
    ],
  },
]

function Endpoint({ doc }: { doc: EndpointDoc }) {
  return (
    <Collapsible className="flex flex-col gap-2 rounded-lg border px-4 py-3">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <Badge variant={doc.method === "GET" ? "default" : "secondary"} className="h-6 px-2 font-bold">
            {doc.method}
          </Badge>
          <span className="min-w-0 font-mono text-sm leading-5 font-semibold break-all">{doc.path}</span>
        </div>
        <CollapsibleTrigger render={<Button variant="ghost" size="icon" className="size-8" />}>
          <ChevronsUpDown />
          <span className="sr-only">Toggle {doc.path}</span>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="flex flex-col gap-2 border-t pt-3">
        <p className="text-base leading-6">{doc.summary}</p>
        <p className="mt-3 text-sm leading-5 text-muted-foreground">
          <span className="font-semibold text-foreground">Auth. </span>
          {doc.auth}
        </p>

        <h4 className="mt-5 text-sm font-bold tracking-wide uppercase">{doc.fieldsTitle}</h4>
        <dl className="mt-2 divide-y rounded-lg bg-muted/60">
          {doc.fields.map((field) => (
            <div key={field.name} className="grid gap-1 px-3 py-2.5 sm:grid-cols-[11rem_1fr] sm:gap-3">
              <dt className="font-mono text-sm font-semibold break-all">
                {field.name}
                {field.required ? <span className="ml-2 font-sans text-xs font-bold text-amber-700 dark:text-amber-300">Required</span> : null}
              </dt>
              <dd className="text-sm leading-5 text-muted-foreground">{field.detail}</dd>
            </div>
          ))}
        </dl>

        <h4 className="mt-5 text-sm font-bold tracking-wide uppercase">Response</h4>
        <pre className="mt-2 overflow-x-auto rounded-lg bg-muted p-3 font-mono text-xs leading-5">{doc.response}</pre>

        <h4 className="mt-5 text-sm font-bold tracking-wide uppercase">Rate limit</h4>
        <p className="mt-2 text-sm leading-6">{doc.rate}</p>

        <h4 className="mt-5 text-sm font-bold tracking-wide uppercase">Notes</h4>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-6 text-muted-foreground">
          {doc.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  )
}

export function ApiReference() {
  return (
    <Card className="mt-6 mb-6">
      <Collapsible className="flex flex-col gap-2">
        <CardHeader>
          <CardTitle className="text-xl font-bold">API reference</CardTitle>
          <CardDescription className="text-base leading-6">
            Endpoints, query fields, response shapes, and rate limits for this app and SportScore.
          </CardDescription>
          <CardAction>
            <CollapsibleTrigger render={<Button variant="ghost" size="icon" className="size-8" />}>
              <ChevronsUpDown />
              <span className="sr-only">Toggle API reference</span>
            </CollapsibleTrigger>
          </CardAction>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="space-y-3">
            <p className="text-sm leading-6 text-muted-foreground">
              This page reads two local routes. Those routes call SportScore, which needs no API key on the free tier and
              requires the Powered by SportScore link in the footer. Open an endpoint for the request, the response, and
              the limit.
            </p>
            {ENDPOINTS.map((doc) => (
              <Endpoint key={doc.id} doc={doc} />
            ))}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}

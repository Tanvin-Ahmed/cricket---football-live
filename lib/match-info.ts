import { countryByCode, countryForTeam, countryInText, fold, stripCountryNames } from "@/lib/countries"
import type { SportId } from "@/lib/types"

const CRICKET_LEAGUES: { pattern: RegExp; code: string }[] = [
  { pattern: /\bbig bash\b|\bbbl\b|\bsheffield shield\b|\bmarsh cup\b|\bvictoria t20\b/, code: "au" },
  { pattern: /\bipl\b|\bindian premier league\b/, code: "in" },
  { pattern: /\bpsl\b|\bpakistan super league\b/, code: "pk" },
  { pattern: /\bbpl\b|\bbangladesh premier league\b/, code: "bd" },
  { pattern: /\blpl\b|\blanka premier\b/, code: "lk" },
  { pattern: /\bcsa\b|\bsa20\b/, code: "za" },
  { pattern: /\babu dhabi\b|\bilt20\b/, code: "ae" },
  { pattern: /\bmlc\b|\bmajor league cricket\b/, code: "us" },
  { pattern: /\bthe hundred\b|\bt20 blast\b|\bvitality blast\b|\bcounty championship\b/, code: "gb-eng" },
  { pattern: /\bsuper smash\b/, code: "nz" },
]

const FOOTBALL_LEAGUES: { pattern: RegExp; code: string }[] = [
  { pattern: /\bk league\b/, code: "kr" },
  { pattern: /\bj[123] league\b|\bnadeshiko\b/, code: "jp" },
  { pattern: /\bmls\b|\bmajor league soccer\b|\busl\b/, code: "us" },
  { pattern: /\bliga mx\b/, code: "mx" },
  { pattern: /\beredivisie\b/, code: "nl" },
  { pattern: /\ballsvenskan\b/, code: "se" },
  { pattern: /\bbrasileirao\b/, code: "br" },
  { pattern: /\bpsl\b/, code: "za" },
]

function leagueCountry(sport: SportId, competition: string) {
  const folded = fold(competition)
  const rules = sport === "cricket" ? CRICKET_LEAGUES : FOOTBALL_LEAGUES
  for (const rule of rules) {
    if (rule.pattern.test(folded)) return countryByCode(rule.code)
  }
  return null
}

function formatTag(sport: SportId, competition: string) {
  const folded = fold(competition)
  if (sport === "football") {
    return /\bfutsal\b/.test(folded) ? "Futsal" : null
  }
  if (/\bt10\b/.test(folded)) return "T10"
  if (
    /\bt20\b|\bbig bash\b|\bbbl\b|\bipl\b|\bsa20\b|\bthe hundred\b|\bcpl\b|\bpsl\b|\blpl\b|\bbpl\b|\bmlc\b|\bilt20\b|\bt20 blast\b|\bvitality blast\b|\bsuper smash\b|\bwpl\b/.test(
      folded,
    )
  ) {
    return "T20"
  }
  if (/\bodi\b|\bone day international\b/.test(folded)) return "ODI"
  if (/\bpro ?50\b|\blist a\b|\bone day\b/.test(folded)) return "List A"
  if (/\btests?\b|\bfirst class\b/.test(folded)) return "Test"
  return null
}

function regionOf(sport: SportId, text: string) {
  if (sport === "cricket") {
    if (/\basia cup\b|\basian\b|\bacc\b|\basia\b/.test(text)) return "Asia"
    if (/\bafrica cup\b|\bafrican\b|\bafrica\b/.test(text)) return "Africa"
    return null
  }
  if (/\basia cup\b|\basian cup\b|\basian\b|\bafc\b|\bsaff\b|\basia\b/.test(text)) return "Asia"
  if (/\bafrica cup\b|\bafcon\b|\bcaf\b|\bafrican\b|\bafrica\b/.test(text)) return "Africa"
  if (/\buefa\b|\beuro\b|\beuropa\b|\beuropean championship\b|\bnations league\b/.test(text)) return "Europe"
  if (/\bcopa america\b|\bconmebol\b|\bgold cup\b|\bconcacaf\b|\blibertadores\b|\bsudamericana\b/.test(text)) {
    return "Americas"
  }
  return null
}

function scopeTags(sport: SportId, competition: string, bothNational: boolean) {
  const text = stripCountryNames(competition)
  if (/\bworld cup\b/.test(text)) return ["World Cup"]

  const continental =
    /\bchampions league\b|\beuropa league\b|\bconference league\b|\blibertadores\b|\bsudamericana\b|\bafc champions\b|\bcaf champions\b|\bconcacaf champions\b/.test(
      text,
    )
  const region = regionOf(sport, text)
  if (continental) return region ? ["Continental", region] : ["Continental"]

  const cup = /\bcup\b|\bchampionship\b|\btrophy\b|\bqualif/.test(text)
  const invitational = /\bfriendly\b|\binvitational\b|\binternational tournament\b/.test(text)
  if (region && (bothNational || cup || invitational || /\bseries\b/.test(text))) return [region]
  if (bothNational || invitational) return ["International"]
  return [sport === "football" ? "Club" : "Domestic"]
}

function unique(tags: string[]) {
  return [...new Set(tags)]
}

export function describeMatch(input: {
  sport: SportId
  competition: string
  home: string
  away: string
}) {
  const homeCountry = countryForTeam(input.home)
  const awayCountry = countryForTeam(input.away)
  const competitionCountry = countryInText(input.competition) ?? leagueCountry(input.sport, input.competition)
  const blob = `${input.competition} ${input.home} ${input.away}`
  const youth = blob.match(/\b(?:u[\s-]?|under[\s-]?)(\d{2})\b/i)
  const women = /\b(women|woman|ladies)\b/i.test(blob) || /\bfeminin/.test(fold(blob))
  const tags = unique(
    [
      formatTag(input.sport, input.competition),
      ...scopeTags(input.sport, input.competition, Boolean(homeCountry && awayCountry)),
      youth ? `U${youth[1]}` : /\byouth\b/i.test(blob) ? "Youth" : null,
      women ? "Women" : null,
    ].filter((tag): tag is string => Boolean(tag)),
  )

  return {
    tags,
    homeFlag: homeCountry,
    awayFlag: awayCountry,
    competitionFlag: competitionCountry,
  }
}

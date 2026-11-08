export type Country = {
  code: string
  name: string
}

type CountryRecord = Country & { aliases: string[] }

const COUNTRIES: CountryRecord[] = [
  { code: "af", name: "Afghanistan", aliases: ["afghanistan", "afghan", "afg"] },
  { code: "al", name: "Albania", aliases: ["albania", "albanian"] },
  { code: "dz", name: "Algeria", aliases: ["algeria", "algerian"] },
  { code: "ad", name: "Andorra", aliases: ["andorra"] },
  { code: "ao", name: "Angola", aliases: ["angola", "angolan"] },
  { code: "ag", name: "Antigua and Barbuda", aliases: ["antigua and barbuda", "antigua"] },
  { code: "ar", name: "Argentina", aliases: ["argentina", "argentine", "argentinian", "arg"] },
  { code: "am", name: "Armenia", aliases: ["armenia", "armenian"] },
  { code: "aw", name: "Aruba", aliases: ["aruba"] },
  { code: "au", name: "Australia", aliases: ["australia", "australian", "aus"] },
  { code: "at", name: "Austria", aliases: ["austria", "austrian"] },
  { code: "az", name: "Azerbaijan", aliases: ["azerbaijan", "azerbaijani"] },
  { code: "bs", name: "Bahamas", aliases: ["bahamas", "bahamian"] },
  { code: "bh", name: "Bahrain", aliases: ["bahrain", "bahraini"] },
  { code: "bd", name: "Bangladesh", aliases: ["bangladesh", "bangladeshi", "ban"] },
  { code: "bb", name: "Barbados", aliases: ["barbados"] },
  { code: "by", name: "Belarus", aliases: ["belarus", "belarusian"] },
  { code: "be", name: "Belgium", aliases: ["belgium", "belgian", "bel"] },
  { code: "bz", name: "Belize", aliases: ["belize"] },
  { code: "bj", name: "Benin", aliases: ["benin"] },
  { code: "bm", name: "Bermuda", aliases: ["bermuda"] },
  { code: "bt", name: "Bhutan", aliases: ["bhutan"] },
  { code: "bo", name: "Bolivia", aliases: ["bolivia", "bolivian"] },
  { code: "ba", name: "Bosnia and Herzegovina", aliases: ["bosnia and herzegovina", "bosnia", "bosnian"] },
  { code: "bw", name: "Botswana", aliases: ["botswana"] },
  { code: "br", name: "Brazil", aliases: ["brazil", "brazilian", "bra"] },
  { code: "bn", name: "Brunei", aliases: ["brunei"] },
  { code: "bg", name: "Bulgaria", aliases: ["bulgaria", "bulgarian"] },
  { code: "bf", name: "Burkina Faso", aliases: ["burkina faso", "burkina"] },
  { code: "bi", name: "Burundi", aliases: ["burundi"] },
  { code: "kh", name: "Cambodia", aliases: ["cambodia", "cambodian"] },
  { code: "cm", name: "Cameroon", aliases: ["cameroon", "cameroonian"] },
  { code: "ca", name: "Canada", aliases: ["canada", "canadian"] },
  { code: "cv", name: "Cape Verde", aliases: ["cape verde", "cabo verde"] },
  { code: "ky", name: "Cayman Islands", aliases: ["cayman islands", "cayman"] },
  { code: "cf", name: "Central African Republic", aliases: ["central african republic"] },
  { code: "td", name: "Chad", aliases: ["chad"] },
  { code: "cl", name: "Chile", aliases: ["chile", "chilean"] },
  { code: "cn", name: "China", aliases: ["china", "chinese", "chn"] },
  { code: "tw", name: "Chinese Taipei", aliases: ["chinese taipei", "taiwan", "taiwanese"] },
  { code: "co", name: "Colombia", aliases: ["colombia", "colombian"] },
  { code: "km", name: "Comoros", aliases: ["comoros"] },
  { code: "cg", name: "Congo", aliases: ["republic of the congo", "congo brazzaville"] },
  { code: "cd", name: "DR Congo", aliases: ["democratic republic of the congo", "dr congo", "congo dr", "drc"] },
  { code: "cr", name: "Costa Rica", aliases: ["costa rica", "costa rican"] },
  { code: "hr", name: "Croatia", aliases: ["croatia", "croatian", "cro"] },
  { code: "cu", name: "Cuba", aliases: ["cuba", "cuban"] },
  { code: "cw", name: "Curacao", aliases: ["curacao"] },
  { code: "cy", name: "Cyprus", aliases: ["cyprus", "cypriot"] },
  { code: "cz", name: "Czechia", aliases: ["czech republic", "czechia", "czech"] },
  { code: "dk", name: "Denmark", aliases: ["denmark", "danish"] },
  { code: "dj", name: "Djibouti", aliases: ["djibouti"] },
  { code: "dm", name: "Dominica", aliases: ["dominica"] },
  { code: "do", name: "Dominican Republic", aliases: ["dominican republic", "dominican"] },
  { code: "ec", name: "Ecuador", aliases: ["ecuador", "ecuadorian"] },
  { code: "eg", name: "Egypt", aliases: ["egypt", "egyptian"] },
  { code: "sv", name: "El Salvador", aliases: ["el salvador", "salvadoran"] },
  { code: "gb-eng", name: "England", aliases: ["england", "english", "eng"] },
  { code: "gq", name: "Equatorial Guinea", aliases: ["equatorial guinea"] },
  { code: "er", name: "Eritrea", aliases: ["eritrea"] },
  { code: "ee", name: "Estonia", aliases: ["estonia", "estonian"] },
  { code: "sz", name: "Eswatini", aliases: ["eswatini", "swaziland"] },
  { code: "et", name: "Ethiopia", aliases: ["ethiopia", "ethiopian"] },
  { code: "fo", name: "Faroe Islands", aliases: ["faroe islands", "faroe"] },
  { code: "fj", name: "Fiji", aliases: ["fiji", "fijian"] },
  { code: "fi", name: "Finland", aliases: ["finland", "finnish"] },
  { code: "fr", name: "France", aliases: ["france", "french", "fra"] },
  { code: "ga", name: "Gabon", aliases: ["gabon"] },
  { code: "gm", name: "Gambia", aliases: ["gambia", "gambian"] },
  { code: "ge", name: "Georgia", aliases: ["georgia", "georgian"] },
  { code: "de", name: "Germany", aliases: ["germany", "german", "ger"] },
  { code: "gh", name: "Ghana", aliases: ["ghana", "ghanaian"] },
  { code: "gr", name: "Greece", aliases: ["greece", "greek"] },
  { code: "gd", name: "Grenada", aliases: ["grenada"] },
  { code: "gt", name: "Guatemala", aliases: ["guatemala", "guatemalan"] },
  { code: "gn", name: "Guinea", aliases: ["guinea", "guinean"] },
  { code: "gw", name: "Guinea-Bissau", aliases: ["guinea bissau", "guinea-bissau"] },
  { code: "gy", name: "Guyana", aliases: ["guyana"] },
  { code: "ht", name: "Haiti", aliases: ["haiti", "haitian"] },
  { code: "hn", name: "Honduras", aliases: ["honduras", "honduran"] },
  { code: "hk", name: "Hong Kong", aliases: ["chinese hong kong", "hong kong"] },
  { code: "hu", name: "Hungary", aliases: ["hungary", "hungarian"] },
  { code: "is", name: "Iceland", aliases: ["iceland", "icelandic"] },
  { code: "in", name: "India", aliases: ["india", "indian", "ind"] },
  { code: "id", name: "Indonesia", aliases: ["indonesia", "indonesian"] },
  { code: "ir", name: "Iran", aliases: ["iran", "iranian"] },
  { code: "iq", name: "Iraq", aliases: ["iraq", "iraqi"] },
  { code: "ie", name: "Ireland", aliases: ["republic of ireland", "ireland", "irish", "ire"] },
  { code: "il", name: "Israel", aliases: ["israel", "israeli"] },
  { code: "it", name: "Italy", aliases: ["italy", "italian", "ita"] },
  { code: "ci", name: "Ivory Coast", aliases: ["ivory coast", "cote divoire", "ivorian"] },
  { code: "jm", name: "Jamaica", aliases: ["jamaica", "jamaican"] },
  { code: "jp", name: "Japan", aliases: ["japan", "japanese", "jpn"] },
  { code: "jo", name: "Jordan", aliases: ["jordan", "jordanian"] },
  { code: "kz", name: "Kazakhstan", aliases: ["kazakhstan", "kazakh"] },
  { code: "ke", name: "Kenya", aliases: ["kenya", "kenyan"] },
  { code: "xk", name: "Kosovo", aliases: ["kosovo"] },
  { code: "kw", name: "Kuwait", aliases: ["kuwait", "kuwaiti"] },
  { code: "kg", name: "Kyrgyzstan", aliases: ["kyrgyzstan", "kyrgyz"] },
  { code: "la", name: "Laos", aliases: ["laos", "lao"] },
  { code: "lv", name: "Latvia", aliases: ["latvia", "latvian"] },
  { code: "lb", name: "Lebanon", aliases: ["lebanon", "lebanese"] },
  { code: "ls", name: "Lesotho", aliases: ["lesotho"] },
  { code: "lr", name: "Liberia", aliases: ["liberia"] },
  { code: "ly", name: "Libya", aliases: ["libya", "libyan"] },
  { code: "li", name: "Liechtenstein", aliases: ["liechtenstein"] },
  { code: "lt", name: "Lithuania", aliases: ["lithuania", "lithuanian"] },
  { code: "lu", name: "Luxembourg", aliases: ["luxembourg"] },
  { code: "mo", name: "Macau", aliases: ["macau", "macao"] },
  { code: "mg", name: "Madagascar", aliases: ["madagascar"] },
  { code: "mw", name: "Malawi", aliases: ["malawi"] },
  { code: "my", name: "Malaysia", aliases: ["malaysia", "malaysian"] },
  { code: "mv", name: "Maldives", aliases: ["maldives"] },
  { code: "ml", name: "Mali", aliases: ["mali", "malian"] },
  { code: "mt", name: "Malta", aliases: ["malta", "maltese"] },
  { code: "mr", name: "Mauritania", aliases: ["mauritania"] },
  { code: "mu", name: "Mauritius", aliases: ["mauritius"] },
  { code: "mx", name: "Mexico", aliases: ["mexico", "mexican", "mex"] },
  { code: "md", name: "Moldova", aliases: ["moldova", "moldovan"] },
  { code: "mc", name: "Monaco", aliases: ["monaco"] },
  { code: "mn", name: "Mongolia", aliases: ["mongolia"] },
  { code: "me", name: "Montenegro", aliases: ["montenegro"] },
  { code: "ma", name: "Morocco", aliases: ["morocco", "moroccan"] },
  { code: "mz", name: "Mozambique", aliases: ["mozambique"] },
  { code: "mm", name: "Myanmar", aliases: ["myanmar", "burma", "burmese"] },
  { code: "na", name: "Namibia", aliases: ["namibia", "namibian"] },
  { code: "np", name: "Nepal", aliases: ["nepal", "nepalese", "nepali"] },
  { code: "nl", name: "Netherlands", aliases: ["netherlands", "holland", "dutch", "ned"] },
  { code: "nz", name: "New Zealand", aliases: ["new zealand", "nz"] },
  { code: "ni", name: "Nicaragua", aliases: ["nicaragua", "nicaraguan"] },
  { code: "ne", name: "Niger", aliases: ["niger"] },
  { code: "ng", name: "Nigeria", aliases: ["nigeria", "nigerian"] },
  { code: "kp", name: "North Korea", aliases: ["north korea", "north korean", "dprk"] },
  { code: "mk", name: "North Macedonia", aliases: ["north macedonia", "macedonia"] },
  { code: "gb-nir", name: "Northern Ireland", aliases: ["northern ireland", "northern irish"] },
  { code: "no", name: "Norway", aliases: ["norway", "norwegian"] },
  { code: "om", name: "Oman", aliases: ["oman", "omani"] },
  { code: "pk", name: "Pakistan", aliases: ["pakistan", "pakistani", "pak"] },
  { code: "ps", name: "Palestine", aliases: ["palestine", "palestinian"] },
  { code: "pa", name: "Panama", aliases: ["panama", "panamanian"] },
  { code: "pg", name: "Papua New Guinea", aliases: ["papua new guinea"] },
  { code: "py", name: "Paraguay", aliases: ["paraguay", "paraguayan"] },
  { code: "pe", name: "Peru", aliases: ["peru", "peruvian"] },
  { code: "ph", name: "Philippines", aliases: ["philippines", "philippine", "filipino"] },
  { code: "pl", name: "Poland", aliases: ["poland", "polish"] },
  { code: "pt", name: "Portugal", aliases: ["portugal", "portuguese", "por"] },
  { code: "pr", name: "Puerto Rico", aliases: ["puerto rico"] },
  { code: "qa", name: "Qatar", aliases: ["qatar", "qatari"] },
  { code: "ro", name: "Romania", aliases: ["romania", "romanian"] },
  { code: "ru", name: "Russia", aliases: ["russia", "russian", "rus"] },
  { code: "rw", name: "Rwanda", aliases: ["rwanda", "rwandan"] },
  { code: "kn", name: "Saint Kitts and Nevis", aliases: ["saint kitts and nevis", "st kitts and nevis", "saint kitts", "st kitts"] },
  { code: "lc", name: "Saint Lucia", aliases: ["saint lucia", "st lucia"] },
  { code: "vc", name: "Saint Vincent and the Grenadines", aliases: ["saint vincent and the grenadines", "saint vincent", "st vincent"] },
  { code: "ws", name: "Samoa", aliases: ["samoa", "samoan"] },
  { code: "sm", name: "San Marino", aliases: ["san marino"] },
  { code: "st", name: "Sao Tome and Principe", aliases: ["sao tome and principe", "sao tome"] },
  { code: "sa", name: "Saudi Arabia", aliases: ["saudi arabia", "saudi arabian", "saudi", "ksa"] },
  { code: "gb-sct", name: "Scotland", aliases: ["scotland", "scottish", "sco"] },
  { code: "sn", name: "Senegal", aliases: ["senegal", "senegalese"] },
  { code: "rs", name: "Serbia", aliases: ["serbia", "serbian", "srb"] },
  { code: "sc", name: "Seychelles", aliases: ["seychelles"] },
  { code: "sl", name: "Sierra Leone", aliases: ["sierra leone"] },
  { code: "sg", name: "Singapore", aliases: ["singapore", "singaporean"] },
  { code: "sk", name: "Slovakia", aliases: ["slovakia", "slovak"] },
  { code: "si", name: "Slovenia", aliases: ["slovenia", "slovenian"] },
  { code: "sb", name: "Solomon Islands", aliases: ["solomon islands", "solomon"] },
  { code: "so", name: "Somalia", aliases: ["somalia"] },
  { code: "za", name: "South Africa", aliases: ["south africa", "south african", "rsa"] },
  { code: "kr", name: "South Korea", aliases: ["south korea", "south korean", "republic of korea", "korea", "korean", "kor"] },
  { code: "ss", name: "South Sudan", aliases: ["south sudan"] },
  { code: "es", name: "Spain", aliases: ["spain", "spanish", "esp"] },
  { code: "lk", name: "Sri Lanka", aliases: ["sri lanka", "sri lankan", "lanka"] },
  { code: "sd", name: "Sudan", aliases: ["sudan", "sudanese"] },
  { code: "sr", name: "Suriname", aliases: ["suriname"] },
  { code: "se", name: "Sweden", aliases: ["sweden", "swedish"] },
  { code: "ch", name: "Switzerland", aliases: ["switzerland", "swiss", "sui"] },
  { code: "sy", name: "Syria", aliases: ["syria", "syrian"] },
  { code: "tj", name: "Tajikistan", aliases: ["tajikistan", "tajik"] },
  { code: "tz", name: "Tanzania", aliases: ["tanzania", "tanzanian"] },
  { code: "th", name: "Thailand", aliases: ["thailand", "thai"] },
  { code: "tl", name: "Timor-Leste", aliases: ["timor leste", "east timor"] },
  { code: "tg", name: "Togo", aliases: ["togo"] },
  { code: "to", name: "Tonga", aliases: ["tonga"] },
  { code: "tt", name: "Trinidad and Tobago", aliases: ["trinidad and tobago", "trinidad"] },
  { code: "tn", name: "Tunisia", aliases: ["tunisia", "tunisian"] },
  { code: "tr", name: "Turkey", aliases: ["turkey", "turkiye", "turkish"] },
  { code: "ug", name: "Uganda", aliases: ["uganda", "ugandan"] },
  { code: "ua", name: "Ukraine", aliases: ["ukraine", "ukrainian"] },
  { code: "ae", name: "United Arab Emirates", aliases: ["united arab emirates", "uae", "emirati"] },
  { code: "us", name: "United States", aliases: ["united states of america", "united states", "usa", "usmnt", "uswnt"] },
  { code: "uy", name: "Uruguay", aliases: ["uruguay", "uruguayan", "uru"] },
  { code: "uz", name: "Uzbekistan", aliases: ["uzbekistan", "uzbek"] },
  { code: "vu", name: "Vanuatu", aliases: ["vanuatu"] },
  { code: "ve", name: "Venezuela", aliases: ["venezuela", "venezuelan"] },
  { code: "vn", name: "Vietnam", aliases: ["vietnam", "vietnamese"] },
  { code: "gb-wls", name: "Wales", aliases: ["wales", "welsh", "wal"] },
  { code: "ye", name: "Yemen", aliases: ["yemen", "yemeni"] },
  { code: "zm", name: "Zambia", aliases: ["zambia", "zambian"] },
  { code: "zw", name: "Zimbabwe", aliases: ["zimbabwe", "zimbabwean"] },
]

export function fold(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/['’.]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

type Entry = { alias: string; country: Country }

const exact = new Map<string, Country>()
const entries: Entry[] = []
const byCode = new Map<string, Country>()

for (const record of COUNTRIES) {
  const country = { code: record.code, name: record.name }
  byCode.set(record.code, country)
  for (const alias of record.aliases) {
    const key = fold(alias)
    const previous = exact.get(key)
    if (previous && previous.code !== country.code) {
      throw new Error(`Country alias "${key}" maps to ${previous.code} and ${country.code}`)
    }
    if (!previous) {
      exact.set(key, country)
      entries.push({ alias: key, country })
    }
  }
}

entries.sort((a, b) => b.alias.length - a.alias.length || a.alias.localeCompare(b.alias))

const SQUAD_WORDS = new Set([
  "lions",
  "development",
  "emerging",
  "select",
  "invitation",
  "invitational",
  "board",
  "xi",
  "presidents",
  "president",
  "squad",
  "team",
])

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function cleanTeam(name: string) {
  let cleaned = fold(name)
  cleaned = cleaned.replace(/\b(women|womens|woman|ladies|men|mens|boys|girls|male|female)\b/g, " ")
  cleaned = cleaned.replace(/\bu\s?\d{1,2}\b/g, " ")
  cleaned = cleaned.replace(/\bunder\s?\d{1,2}\b/g, " ")
  cleaned = cleaned.replace(/\s+/g, " ").trim()
  cleaned = cleaned.replace(/\s+[abc]$/, "").trim()
  return cleaned
}

export function countryByCode(code: string) {
  return byCode.get(code) ?? null
}

export function countryForTeam(name: string) {
  const cleaned = cleanTeam(name)
  const direct = exact.get(cleaned)
  if (direct) return direct

  for (const entry of entries) {
    if (!cleaned.startsWith(`${entry.alias} `)) continue
    const rest = cleaned.slice(entry.alias.length + 1).trim()
    const words = rest.split(" ").filter(Boolean)
    if (words.length > 0 && words.every((word) => SQUAD_WORDS.has(word))) {
      return entry.country
    }
  }

  return null
}

export function countryInText(text: string) {
  const folded = fold(text)
  for (const entry of entries) {
    const pattern = new RegExp(`\\b${escapeRegExp(entry.alias)}\\b`)
    if (pattern.test(folded)) return entry.country
  }
  return null
}

export function stripCountryNames(text: string) {
  let folded = fold(text)
  for (const entry of entries) {
    folded = folded.replace(new RegExp(`\\b${escapeRegExp(entry.alias)}\\b`, "g"), " ")
  }
  return folded.replace(/\s+/g, " ").trim()
}

// ========== TYPES ==========
export type Category = {
  id: string
  name: string
  slug: string
  minAge: number
  maxAge: number
  description: string
}

export type Team = {
  id: string
  name: string
  slug: string
  color: string
  foundedYear: number
  city: string
}

export type Pilot = {
  id: string
  name: string
  slug: string
  number: number
  birthYear: number
  city: string
  teamId: string
  categoryId: string
  seasonsHistory: SeasonEntry[]
}

export type SeasonEntry = {
  season: string
  categoryId: string
  teamId: string
  points: number
  wins: number
  podiums: number
  bestLap: string | null
  position: number
}

export type Race = {
  id: string
  name: string
  slug: string
  date: string
  track: string
  categoryId: string
  season: string
  status: "upcoming" | "completed"
  results?: RaceResult[]
}

export type RaceResult = {
  position: number
  pilotId: string
  teamId: string
  bestLap: string
  totalTime: string
  points: number
}

// ========== CATEGORIES ==========
export const categories: Category[] = [
  { id: "cat-1", name: "Cadete", slug: "cadete", minAge: 8, maxAge: 11, description: "Categoria inicial para pilotos de 8 a 11 anos" },
  { id: "cat-2", name: "Mirim", slug: "mirim", minAge: 10, maxAge: 13, description: "Categoria intermediaria para pilotos de 10 a 13 anos" },
  { id: "cat-3", name: "Junior", slug: "junior", minAge: 13, maxAge: 16, description: "Categoria para pilotos de 13 a 16 anos" },
  { id: "cat-4", name: "Senior", slug: "senior", minAge: 16, maxAge: 99, description: "Categoria principal para pilotos de 16 anos ou mais" },
]

// ========== TEAMS ==========
export const teams: Team[] = [
  { id: "team-1", name: "Racing Bulls", slug: "racing-bulls", color: "#E63946", foundedYear: 2015, city: "Uberlandia" },
  { id: "team-2", name: "Thunder Kart", slug: "thunder-kart", color: "#457B9D", foundedYear: 2017, city: "Uberaba" },
  { id: "team-3", name: "Velocity Racing", slug: "velocity-racing", color: "#2A9D8F", foundedYear: 2016, city: "Uberlandia" },
  { id: "team-4", name: "Storm Racers", slug: "storm-racers", color: "#E9C46A", foundedYear: 2018, city: "Araguari" },
  { id: "team-5", name: "Phoenix Speed", slug: "phoenix-speed", color: "#F4A261", foundedYear: 2019, city: "Patos de Minas" },
]

// ========== PILOTS ==========
export const pilots: Pilot[] = [
  // Cadete
  { id: "p-1", name: "Lucas Ferreira", slug: "lucas-ferreira", number: 7, birthYear: 2016, city: "Uberlandia", teamId: "team-1", categoryId: "cat-1", seasonsHistory: [
    { season: "2025", categoryId: "cat-1", teamId: "team-1", points: 142, wins: 3, podiums: 6, bestLap: "48.231", position: 1 },
  ]},
  { id: "p-2", name: "Pedro Almeida", slug: "pedro-almeida", number: 14, birthYear: 2015, city: "Uberaba", teamId: "team-2", categoryId: "cat-1", seasonsHistory: [
    { season: "2025", categoryId: "cat-1", teamId: "team-2", points: 128, wins: 2, podiums: 5, bestLap: "48.445", position: 2 },
  ]},
  { id: "p-3", name: "Maria Clara Santos", slug: "maria-clara-santos", number: 22, birthYear: 2016, city: "Uberlandia", teamId: "team-3", categoryId: "cat-1", seasonsHistory: [
    { season: "2025", categoryId: "cat-1", teamId: "team-3", points: 115, wins: 1, podiums: 4, bestLap: "48.678", position: 3 },
  ]},
  { id: "p-4", name: "Thiago Costa", slug: "thiago-costa", number: 9, birthYear: 2015, city: "Araguari", teamId: "team-4", categoryId: "cat-1", seasonsHistory: [
    { season: "2025", categoryId: "cat-1", teamId: "team-4", points: 98, wins: 1, podiums: 3, bestLap: "49.012", position: 4 },
  ]},

  // Mirim
  { id: "p-5", name: "Gabriel Oliveira", slug: "gabriel-oliveira", number: 33, birthYear: 2013, city: "Uberlandia", teamId: "team-1", categoryId: "cat-2", seasonsHistory: [
    { season: "2024", categoryId: "cat-1", teamId: "team-1", points: 156, wins: 5, podiums: 8, bestLap: "47.890", position: 1 },
    { season: "2025", categoryId: "cat-2", teamId: "team-1", points: 134, wins: 3, podiums: 6, bestLap: "45.231", position: 1 },
  ]},
  { id: "p-6", name: "Ana Beatriz Lima", slug: "ana-beatriz-lima", number: 8, birthYear: 2013, city: "Uberaba", teamId: "team-2", categoryId: "cat-2", seasonsHistory: [
    { season: "2024", categoryId: "cat-1", teamId: "team-2", points: 120, wins: 2, podiums: 5, bestLap: "48.100", position: 3 },
    { season: "2025", categoryId: "cat-2", teamId: "team-2", points: 121, wins: 2, podiums: 5, bestLap: "45.567", position: 2 },
  ]},
  { id: "p-7", name: "Rafael Mendes", slug: "rafael-mendes", number: 44, birthYear: 2012, city: "Uberlandia", teamId: "team-3", categoryId: "cat-2", seasonsHistory: [
    { season: "2023", categoryId: "cat-1", teamId: "team-3", points: 110, wins: 2, podiums: 4, bestLap: "48.900", position: 2 },
    { season: "2024", categoryId: "cat-2", teamId: "team-3", points: 102, wins: 1, podiums: 4, bestLap: "46.100", position: 4 },
    { season: "2025", categoryId: "cat-2", teamId: "team-3", points: 112, wins: 2, podiums: 4, bestLap: "45.890", position: 3 },
  ]},
  { id: "p-8", name: "Matheus Rocha", slug: "matheus-rocha", number: 5, birthYear: 2012, city: "Araguari", teamId: "team-5", categoryId: "cat-2", seasonsHistory: [
    { season: "2025", categoryId: "cat-2", teamId: "team-5", points: 95, wins: 1, podiums: 3, bestLap: "46.200", position: 4 },
  ]},

  // Junior
  { id: "p-9", name: "Henrique Souza", slug: "henrique-souza", number: 11, birthYear: 2010, city: "Uberlandia", teamId: "team-1", categoryId: "cat-3", seasonsHistory: [
    { season: "2023", categoryId: "cat-2", teamId: "team-1", points: 145, wins: 4, podiums: 7, bestLap: "44.500", position: 1 },
    { season: "2024", categoryId: "cat-3", teamId: "team-1", points: 160, wins: 5, podiums: 8, bestLap: "42.230", position: 1 },
    { season: "2025", categoryId: "cat-3", teamId: "team-1", points: 148, wins: 4, podiums: 7, bestLap: "42.100", position: 1 },
  ]},
  { id: "p-10", name: "Julia Martins", slug: "julia-martins", number: 27, birthYear: 2010, city: "Uberaba", teamId: "team-4", categoryId: "cat-3", seasonsHistory: [
    { season: "2023", categoryId: "cat-2", teamId: "team-4", points: 130, wins: 3, podiums: 6, bestLap: "44.800", position: 2 },
    { season: "2024", categoryId: "cat-3", teamId: "team-4", points: 142, wins: 3, podiums: 7, bestLap: "42.500", position: 2 },
    { season: "2025", categoryId: "cat-3", teamId: "team-4", points: 138, wins: 3, podiums: 6, bestLap: "42.350", position: 2 },
  ]},
  { id: "p-11", name: "Leonardo Barbosa", slug: "leonardo-barbosa", number: 18, birthYear: 2011, city: "Patos de Minas", teamId: "team-5", categoryId: "cat-3", seasonsHistory: [
    { season: "2024", categoryId: "cat-2", teamId: "team-5", points: 88, wins: 0, podiums: 3, bestLap: "46.500", position: 5 },
    { season: "2025", categoryId: "cat-3", teamId: "team-5", points: 110, wins: 1, podiums: 4, bestLap: "42.900", position: 3 },
  ]},
  { id: "p-12", name: "Isabela Nunes", slug: "isabela-nunes", number: 3, birthYear: 2010, city: "Uberlandia", teamId: "team-3", categoryId: "cat-3", seasonsHistory: [
    { season: "2025", categoryId: "cat-3", teamId: "team-3", points: 92, wins: 0, podiums: 3, bestLap: "43.200", position: 4 },
  ]},

  // Senior
  { id: "p-13", name: "Marcos Vieira", slug: "marcos-vieira", number: 1, birthYear: 2007, city: "Uberlandia", teamId: "team-1", categoryId: "cat-4", seasonsHistory: [
    { season: "2022", categoryId: "cat-3", teamId: "team-1", points: 170, wins: 6, podiums: 9, bestLap: "41.200", position: 1 },
    { season: "2023", categoryId: "cat-4", teamId: "team-1", points: 180, wins: 7, podiums: 10, bestLap: "39.500", position: 1 },
    { season: "2024", categoryId: "cat-4", teamId: "team-1", points: 175, wins: 6, podiums: 9, bestLap: "39.300", position: 1 },
    { season: "2025", categoryId: "cat-4", teamId: "team-1", points: 162, wins: 5, podiums: 8, bestLap: "39.100", position: 1 },
  ]},
  { id: "p-14", name: "Felipe Cardoso", slug: "felipe-cardoso", number: 21, birthYear: 2008, city: "Uberaba", teamId: "team-2", categoryId: "cat-4", seasonsHistory: [
    { season: "2023", categoryId: "cat-3", teamId: "team-2", points: 148, wins: 4, podiums: 7, bestLap: "41.800", position: 2 },
    { season: "2024", categoryId: "cat-4", teamId: "team-2", points: 155, wins: 4, podiums: 8, bestLap: "39.800", position: 2 },
    { season: "2025", categoryId: "cat-4", teamId: "team-2", points: 149, wins: 4, podiums: 7, bestLap: "39.500", position: 2 },
  ]},
  { id: "p-15", name: "Camila Duarte", slug: "camila-duarte", number: 77, birthYear: 2007, city: "Uberlandia", teamId: "team-3", categoryId: "cat-4", seasonsHistory: [
    { season: "2023", categoryId: "cat-3", teamId: "team-3", points: 135, wins: 3, podiums: 6, bestLap: "42.100", position: 3 },
    { season: "2024", categoryId: "cat-4", teamId: "team-3", points: 140, wins: 3, podiums: 7, bestLap: "40.200", position: 3 },
    { season: "2025", categoryId: "cat-4", teamId: "team-3", points: 131, wins: 2, podiums: 6, bestLap: "39.900", position: 3 },
  ]},
  { id: "p-16", name: "Bruno Teixeira", slug: "bruno-teixeira", number: 55, birthYear: 2008, city: "Araguari", teamId: "team-4", categoryId: "cat-4", seasonsHistory: [
    { season: "2024", categoryId: "cat-3", teamId: "team-4", points: 120, wins: 2, podiums: 5, bestLap: "42.400", position: 3 },
    { season: "2025", categoryId: "cat-4", teamId: "team-4", points: 118, wins: 2, podiums: 4, bestLap: "40.100", position: 4 },
  ]},
]

// ========== RACES ==========
export const races: Race[] = [
  // Past races - Senior 2025
  {
    id: "r-1", name: "GP Uberlandia - Etapa 1", slug: "gp-uberlandia-etapa-1-senior-2025", date: "2025-03-15", track: "Kartódromo Internacional de Uberlândia", categoryId: "cat-4", season: "2025", status: "completed",
    results: [
      { position: 1, pilotId: "p-13", teamId: "team-1", bestLap: "39.450", totalTime: "18:23.100", points: 25 },
      { position: 2, pilotId: "p-14", teamId: "team-2", bestLap: "39.600", totalTime: "18:24.500", points: 18 },
      { position: 3, pilotId: "p-15", teamId: "team-3", bestLap: "39.900", totalTime: "18:26.200", points: 15 },
      { position: 4, pilotId: "p-16", teamId: "team-4", bestLap: "40.100", totalTime: "18:28.800", points: 12 },
    ]
  },
  {
    id: "r-2", name: "GP Uberaba - Etapa 2", slug: "gp-uberaba-etapa-2-senior-2025", date: "2025-04-26", track: "Kartódromo de Uberaba", categoryId: "cat-4", season: "2025", status: "completed",
    results: [
      { position: 1, pilotId: "p-14", teamId: "team-2", bestLap: "39.500", totalTime: "18:20.300", points: 25 },
      { position: 2, pilotId: "p-13", teamId: "team-1", bestLap: "39.550", totalTime: "18:21.100", points: 18 },
      { position: 3, pilotId: "p-16", teamId: "team-4", bestLap: "40.000", totalTime: "18:25.600", points: 15 },
      { position: 4, pilotId: "p-15", teamId: "team-3", bestLap: "40.200", totalTime: "18:27.400", points: 12 },
    ]
  },
  {
    id: "r-3", name: "GP Araguari - Etapa 3", slug: "gp-araguari-etapa-3-senior-2025", date: "2025-06-14", track: "Kartódromo de Araguari", categoryId: "cat-4", season: "2025", status: "completed",
    results: [
      { position: 1, pilotId: "p-13", teamId: "team-1", bestLap: "39.100", totalTime: "18:18.500", points: 25 },
      { position: 2, pilotId: "p-15", teamId: "team-3", bestLap: "39.900", totalTime: "18:22.300", points: 18 },
      { position: 3, pilotId: "p-14", teamId: "team-2", bestLap: "39.800", totalTime: "18:23.100", points: 15 },
      { position: 4, pilotId: "p-16", teamId: "team-4", bestLap: "40.300", totalTime: "18:26.900", points: 12 },
    ]
  },

  // Past races - Junior 2025
  {
    id: "r-4", name: "GP Uberlandia - Etapa 1", slug: "gp-uberlandia-etapa-1-junior-2025", date: "2025-03-15", track: "Kartódromo Internacional de Uberlândia", categoryId: "cat-3", season: "2025", status: "completed",
    results: [
      { position: 1, pilotId: "p-9", teamId: "team-1", bestLap: "42.100", totalTime: "19:45.200", points: 25 },
      { position: 2, pilotId: "p-10", teamId: "team-4", bestLap: "42.350", totalTime: "19:47.100", points: 18 },
      { position: 3, pilotId: "p-11", teamId: "team-5", bestLap: "42.900", totalTime: "19:51.300", points: 15 },
      { position: 4, pilotId: "p-12", teamId: "team-3", bestLap: "43.200", totalTime: "19:55.600", points: 12 },
    ]
  },
  {
    id: "r-5", name: "GP Uberaba - Etapa 2", slug: "gp-uberaba-etapa-2-junior-2025", date: "2025-04-26", track: "Kartódromo de Uberaba", categoryId: "cat-3", season: "2025", status: "completed",
    results: [
      { position: 1, pilotId: "p-10", teamId: "team-4", bestLap: "42.400", totalTime: "19:46.800", points: 25 },
      { position: 2, pilotId: "p-9", teamId: "team-1", bestLap: "42.300", totalTime: "19:47.500", points: 18 },
      { position: 3, pilotId: "p-12", teamId: "team-3", bestLap: "43.100", totalTime: "19:53.200", points: 15 },
      { position: 4, pilotId: "p-11", teamId: "team-5", bestLap: "43.500", totalTime: "19:56.100", points: 12 },
    ]
  },

  // Past races - Mirim 2025
  {
    id: "r-6", name: "GP Uberlandia - Etapa 1", slug: "gp-uberlandia-etapa-1-mirim-2025", date: "2025-03-15", track: "Kartódromo Internacional de Uberlândia", categoryId: "cat-2", season: "2025", status: "completed",
    results: [
      { position: 1, pilotId: "p-5", teamId: "team-1", bestLap: "45.231", totalTime: "20:10.500", points: 25 },
      { position: 2, pilotId: "p-6", teamId: "team-2", bestLap: "45.567", totalTime: "20:13.200", points: 18 },
      { position: 3, pilotId: "p-7", teamId: "team-3", bestLap: "45.890", totalTime: "20:16.700", points: 15 },
      { position: 4, pilotId: "p-8", teamId: "team-5", bestLap: "46.200", totalTime: "20:20.400", points: 12 },
    ]
  },

  // Past races - Cadete 2025
  {
    id: "r-7", name: "GP Uberlandia - Etapa 1", slug: "gp-uberlandia-etapa-1-cadete-2025", date: "2025-03-15", track: "Kartódromo Internacional de Uberlândia", categoryId: "cat-1", season: "2025", status: "completed",
    results: [
      { position: 1, pilotId: "p-1", teamId: "team-1", bestLap: "48.231", totalTime: "21:30.100", points: 25 },
      { position: 2, pilotId: "p-2", teamId: "team-2", bestLap: "48.445", totalTime: "21:33.400", points: 18 },
      { position: 3, pilotId: "p-3", teamId: "team-3", bestLap: "48.678", totalTime: "21:36.800", points: 15 },
      { position: 4, pilotId: "p-4", teamId: "team-4", bestLap: "49.012", totalTime: "21:40.200", points: 12 },
    ]
  },

  // Upcoming races
  {
    id: "r-8", name: "GP Patos de Minas - Etapa 4", slug: "gp-patos-etapa-4-senior-2025", date: "2026-03-14", track: "Kartódromo de Patos de Minas", categoryId: "cat-4", season: "2025", status: "upcoming",
  },
  {
    id: "r-9", name: "GP Uberlandia - Etapa 5", slug: "gp-uberlandia-etapa-5-senior-2025", date: "2026-04-18", track: "Kartódromo Internacional de Uberlândia", categoryId: "cat-4", season: "2025", status: "upcoming",
  },
  {
    id: "r-10", name: "GP Final - Etapa 6", slug: "gp-final-etapa-6-senior-2025", date: "2026-05-23", track: "Kartódromo Internacional de Uberlândia", categoryId: "cat-4", season: "2025", status: "upcoming",
  },
  {
    id: "r-11", name: "GP Patos de Minas - Etapa 3", slug: "gp-patos-etapa-3-junior-2025", date: "2026-03-14", track: "Kartódromo de Patos de Minas", categoryId: "cat-3", season: "2025", status: "upcoming",
  },
  {
    id: "r-12", name: "GP Uberlandia - Etapa 4", slug: "gp-uberlandia-etapa-4-junior-2025", date: "2026-04-18", track: "Kartódromo Internacional de Uberlândia", categoryId: "cat-3", season: "2025", status: "upcoming",
  },
  {
    id: "r-13", name: "GP Uberaba - Etapa 2", slug: "gp-uberaba-etapa-2-mirim-2025", date: "2026-03-28", track: "Kartódromo de Uberaba", categoryId: "cat-2", season: "2025", status: "upcoming",
  },
  {
    id: "r-14", name: "GP Uberaba - Etapa 2", slug: "gp-uberaba-etapa-2-cadete-2025", date: "2026-03-28", track: "Kartódromo de Uberaba", categoryId: "cat-1", season: "2025", status: "upcoming",
  },
]

// ========== HELPER FUNCTIONS ==========

export function getPilotById(id: string) {
  return pilots.find(p => p.id === id)
}

export function getTeamById(id: string) {
  return teams.find(t => t.id === id)
}

export function getCategoryById(id: string) {
  return categories.find(c => c.id === id)
}

export function getPilotsByCategory(categoryId: string) {
  return pilots.filter(p => p.categoryId === categoryId)
}

export function getPilotsByTeam(teamId: string) {
  return pilots.filter(p => p.teamId === teamId)
}

export function getRacesByCategory(categoryId: string) {
  return races.filter(r => r.categoryId === categoryId)
}

export function getUpcomingRaces() {
  return races.filter(r => r.status === "upcoming").sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

export function getCompletedRaces() {
  return races.filter(r => r.status === "completed").sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPilotAllTimeStats(pilotId: string) {
  const pilot = getPilotById(pilotId)
  if (!pilot) return null
  const totalPoints = pilot.seasonsHistory.reduce((sum, s) => sum + s.points, 0)
  const totalWins = pilot.seasonsHistory.reduce((sum, s) => sum + s.wins, 0)
  const totalPodiums = pilot.seasonsHistory.reduce((sum, s) => sum + s.podiums, 0)
  const totalSeasons = pilot.seasonsHistory.length
  const bestPosition = Math.min(...pilot.seasonsHistory.map(s => s.position))
  return { totalPoints, totalWins, totalPodiums, totalSeasons, bestPosition }
}

export function getTeamCategories(teamId: string) {
  const teamPilots = getPilotsByTeam(teamId)
  const categoryIds = [...new Set(teamPilots.map(p => p.categoryId))]
  return categoryIds.map(id => getCategoryById(id)!).filter(Boolean)
}

export function getSeasonStandings(categoryId: string, season: string) {
  const categoryPilots = pilots.filter(p =>
    p.seasonsHistory.some(s => s.categoryId === categoryId && s.season === season)
  )
  return categoryPilots
    .map(p => {
      const seasonEntry = p.seasonsHistory.find(s => s.categoryId === categoryId && s.season === season)!
      return { pilot: p, ...seasonEntry }
    })
    .sort((a, b) => a.position - b.position)
}

export const seasons = ["2025", "2024", "2023", "2022"]

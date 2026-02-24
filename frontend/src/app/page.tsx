import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  fetchCategorias,
  fetchCorridasCompleted,
  fetchCorridasUpcoming,
  fetchEquipes,
  fetchPilotos,
  fetchResultadosByCorrida,
} from "@/lib/api"
import type { PilotoFromAPI, EquipeFromAPI, RaceResultFromAPI } from "@/lib/api"
import { ArrowRight, Calendar, Flag, Trophy, Users, Zap } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

function buildMaps(
  pilots: PilotoFromAPI[],
  teams: EquipeFromAPI[]
) {
  const pilotByCpf = new Map(pilots.map((p) => [p.cpf, p]))
  const teamBySlug = new Map(teams.map((t) => [t.slug, t]))
  return { pilotByCpf, teamBySlug }
}

export default async function HomePage() {
  let categories: Awaited<ReturnType<typeof fetchCategorias>> = []
  let pilots: Awaited<ReturnType<typeof fetchPilotos>> = []
  let teams: Awaited<ReturnType<typeof fetchEquipes>> = []
  let upcomingRacesRaw: Awaited<ReturnType<typeof fetchCorridasUpcoming>> = []
  let completedRacesRaw: Awaited<ReturnType<typeof fetchCorridasCompleted>> = []

  try {
    ;[categories, pilots, teams, upcomingRacesRaw, completedRacesRaw] = await Promise.all([
      fetchCategorias(),
      fetchPilotos(),
      fetchEquipes(),
      fetchCorridasUpcoming(),
      fetchCorridasCompleted(),
    ])
  } catch {
    // API indisponível (backend parado, CORS ou NEXT_PUBLIC_SERVER_URL incorreto)
  }

  const upcomingRaces = upcomingRacesRaw.slice(0, 4)
  const completedRaces = completedRacesRaw.slice(0, 3)

  const resultsBySlug: Record<string, RaceResultFromAPI[]> = {}
  await Promise.all(
    completedRaces.map(async (r) => {
      try {
        resultsBySlug[r.slug] = await fetchResultadosByCorrida(r.slug)
      } catch {
        resultsBySlug[r.slug] = []
      }
    })
  )

  const { pilotByCpf, teamBySlug } = buildMaps(pilots, teams)
  const categoryBySlug = new Map(categories.map((c) => [c.slug, c]))

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden bg-card py-16 md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4">
          <div className="max-w-2xl">
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
              Temporada 2025
            </Badge>
            <h1 className="font-serif text-4xl font-bold uppercase leading-tight tracking-tight text-foreground md:text-6xl">
              A velocidade <br />
              <span className="text-primary">comeca aqui</span>
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground md:text-xl">
              Acompanhe as corridas de kart organizadas pela UFOPKART. Pilotos, equipes, resultados e muito mais.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/calendario"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Calendar className="h-4 w-4" />
                Ver Calendario
              </Link>
              <Link
                href="/resultados"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-secondary px-5 py-2.5 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80"
              >
                <Trophy className="h-4 w-4" />
                Resultados
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-secondary/50 py-6">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 md:grid-cols-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-serif text-2xl font-bold text-foreground">{pilots.length}</p>
              <p className="text-xs text-muted-foreground">Pilotos</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10">
              <Flag className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-serif text-2xl font-bold text-foreground">{teams.length}</p>
              <p className="text-xs text-muted-foreground">Equipes</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-serif text-2xl font-bold text-foreground">{categories.length}</p>
              <p className="text-xs text-muted-foreground">Categorias</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10">
              <Trophy className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-serif text-2xl font-bold text-foreground">{completedRaces.length + upcomingRaces.length}+</p>
              <p className="text-xs text-muted-foreground">Corridas</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-serif text-2xl font-bold uppercase tracking-tight text-foreground">
            Proximas Corridas
          </h2>
          <Link href="/calendario" className="flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80">
            Ver todas <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {upcomingRaces.map((race) => {
            const category = categoryBySlug.get(race.categoryId)
            return (
              <Card key={race.id} className="border-border bg-card transition-colors hover:border-primary/30">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs font-medium">
                      {category?.name}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(race.date), "dd MMM yyyy", { locale: ptBR })}
                    </span>
                  </div>
                  <CardTitle className="mt-2 font-serif text-base font-semibold text-foreground">
                    {race.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{race.track}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      <section className="border-t border-border bg-secondary/30 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold uppercase tracking-tight text-foreground">
              Resultados Recentes
            </h2>
            <Link href="/resultados" className="flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80">
              Ver todos <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {completedRaces.map((race) => {
              const category = categoryBySlug.get(race.categoryId)
              const podium = (resultsBySlug[race.slug] ?? []).slice(0, 3)
              return (
                <Link key={race.id} href={`/resultados/${race.slug}`}>
                  <Card className="border-border bg-card transition-colors hover:border-primary/30">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">{category?.name}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(race.date), "dd MMM yyyy", { locale: ptBR })}
                        </span>
                      </div>
                      <CardTitle className="mt-2 font-serif text-base font-semibold text-foreground">
                        {race.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col gap-2">
                        {podium.map((result) => {
                          const pilot = pilotByCpf.get(result.pilotId)
                          const team = teamBySlug.get(result.teamId)
                          const positionColors = ["text-gold", "text-silver", "text-bronze"]
                          return (
                            <div key={result.position} className="flex items-center gap-3">
                              <span className={`font-serif text-lg font-bold ${positionColors[result.position - 1]}`}>
                                {result.position}
                              </span>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-foreground">{pilot?.name}</p>
                                <p className="text-xs text-muted-foreground">{team?.name}</p>
                              </div>
                              <span className="text-xs text-muted-foreground">{result.bestLap}</span>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-serif text-2xl font-bold uppercase tracking-tight text-foreground">
            Categorias
          </h2>
          <Link href="/categorias" className="flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80">
            Ver todas <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/categorias/${cat.slug}`}>
              <Card className="border-border bg-card transition-colors hover:border-primary/30">
                <CardHeader>
                  <CardTitle className="font-serif text-lg font-bold uppercase text-foreground">
                    {cat.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{cat.description}</p>
                  <p className="mt-2 text-xs font-medium text-primary">
                    {cat.minAge} - {cat.maxAge === 99 ? "+" : cat.maxAge} anos
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

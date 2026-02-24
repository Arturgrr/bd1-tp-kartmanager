import { notFound } from "next/navigation"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  fetchCategorias,
  fetchCorridasCompleted,
  fetchEquipes,
  fetchPilotoBySlug,
  fetchResultadosByCorrida,
  fetchStandings,
} from "@/lib/api"
import type { StandingFromAPI } from "@/lib/api"
import type { Metadata } from "next"
import { ArrowLeft, Trophy } from "lucide-react"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params
  const pilot = await fetchPilotoBySlug(slug)
  return { title: pilot?.name ?? "Piloto" }
}

export default async function PilotoDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [pilot, categories, teams, completedCorridas] = await Promise.all([
    fetchPilotoBySlug(slug),
    fetchCategorias(),
    fetchEquipes(),
    fetchCorridasCompleted(),
  ])
  if (!pilot) notFound()

  const team = teams.find((t) => t.slug === pilot.teamSlug)
  const category = categories.find((c) => c.slug === pilot.categorySlug)
  const teamBySlug = new Map(teams.map((t) => [t.slug, t]))
  const categoryBySlug = new Map(categories.map((c) => [c.slug, c]))

  const seasons = ["2025", "2024", "2023"]
  const seasonHistory: StandingFromAPI[] = []
  for (const cat of categories) {
    for (const season of seasons) {
      const standings = await fetchStandings(cat.slug, season)
      const entry = standings.find((s) => s.pilotId === pilot.cpf)
      if (entry) seasonHistory.push(entry)
    }
  }
  seasonHistory.sort((a, b) => b.season.localeCompare(a.season))

  const pilotRaces: { race: { slug: string; name: string; date: string; categoryId: string }; result: { position: number; points: number; bestLap: string; totalTime: string } }[] = []
  for (const race of completedCorridas) {
    const results = await fetchResultadosByCorrida(race.slug)
    const result = results.find((r) => r.pilotId === pilot.cpf)
    if (result)
      pilotRaces.push({
        race: { slug: race.slug, name: race.name, date: race.date, categoryId: race.categoryId },
        result: { position: result.position, points: result.points, bestLap: result.bestLap, totalTime: result.totalTime },
      })
  }
  pilotRaces.sort((a, b) => new Date(b.race.date).getTime() - new Date(a.race.date).getTime())

  const totalPoints = seasonHistory.reduce((s, e) => s + e.points, 0)
  const totalWins = seasonHistory.reduce((s, e) => s + e.wins, 0)
  const totalPodiums = seasonHistory.reduce((s, e) => s + e.podiums, 0)
  const bestPosition = seasonHistory.length > 0 ? Math.min(...seasonHistory.map((e) => e.position)) : 0

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <Link href="/pilotos" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Voltar para pilotos
      </Link>

      <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-start">
        <div
          className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg font-serif text-4xl font-bold"
          style={{ backgroundColor: team ? team.color + "20" : "#333", color: team?.color ?? "#fff" }}
        >
          {pilot.number}
        </div>
        <div className="flex-1">
          <h1 className="font-serif text-3xl font-bold uppercase tracking-tight text-foreground md:text-4xl">
            {pilot.name}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            {team && (
              <Link href={`/equipes/${team.slug}`}>
                <Badge variant="secondary" className="gap-1.5">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: team.color }} />
                  {team.name}
                </Badge>
              </Link>
            )}
            <Link href={`/categorias/${pilot.categorySlug}`}>
              <Badge variant="outline" className="border-primary/30 text-primary">
                {category?.name ?? pilot.categorySlug}
              </Badge>
            </Link>
            <span className="text-sm text-muted-foreground">{pilot.city}</span>
          </div>
        </div>
      </div>

      {(totalPoints > 0 || totalWins > 0 || totalPodiums > 0) && (
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-5">
          {[
            { label: "Pontos Totais", value: totalPoints },
            { label: "Vitorias", value: totalWins },
            { label: "Podios", value: totalPodiums },
            { label: "Temporadas", value: seasonHistory.length > 0 ? new Set(seasonHistory.map((e) => e.season)).size : 0 },
            { label: "Melhor Posicao", value: bestPosition > 0 ? `${bestPosition}º` : "-" },
          ].map((stat) => (
            <Card key={stat.label} className="border-border bg-card">
              <CardContent className="py-4 text-center">
                <p className="font-serif text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs uppercase text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {seasonHistory.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 font-serif text-xl font-bold uppercase text-foreground">Historico por Temporada</h2>
          <Card className="border-border bg-card">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Temporada</TableHead>
                    <TableHead className="text-muted-foreground">Categoria</TableHead>
                    <TableHead className="text-muted-foreground">Equipe</TableHead>
                    <TableHead className="text-right text-muted-foreground">Pos.</TableHead>
                    <TableHead className="text-right text-muted-foreground">Pts</TableHead>
                    <TableHead className="text-right text-muted-foreground">Vit.</TableHead>
                    <TableHead className="text-right text-muted-foreground">Podios</TableHead>
                    <TableHead className="text-right text-muted-foreground">Melhor Volta</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {seasonHistory.map((entry) => {
                    const entryCat = categoryBySlug.get(entry.categoryId)
                    const displayTeam = teamBySlug.get(entry.teamId)
                    return (
                      <TableRow key={entry.season + entry.categoryId} className="border-border">
                        <TableCell className="font-medium text-foreground">{entry.season}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">{entryCat?.name}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {displayTeam && (
                              <>
                                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: displayTeam.color }} />
                                <span className="text-sm text-muted-foreground">{displayTeam.name}</span>
                              </>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={entry.position <= 3 ? "font-bold text-primary" : "text-foreground"}>
                            {entry.position}º
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-medium text-foreground">{entry.points}</TableCell>
                        <TableCell className="text-right text-foreground">{entry.wins}</TableCell>
                        <TableCell className="text-right text-foreground">{entry.podiums}</TableCell>
                        <TableCell className="text-right text-muted-foreground">{entry.bestLap ?? "-"}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      )}

      {pilotRaces.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 font-serif text-xl font-bold uppercase text-foreground">Resultados em Corridas</h2>
          <Card className="border-border bg-card">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Corrida</TableHead>
                    <TableHead className="text-muted-foreground">Categoria</TableHead>
                    <TableHead className="text-right text-muted-foreground">Pos.</TableHead>
                    <TableHead className="text-right text-muted-foreground">Pts</TableHead>
                    <TableHead className="text-right text-muted-foreground">Melhor Volta</TableHead>
                    <TableHead className="text-right text-muted-foreground">Tempo Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pilotRaces.map(({ race, result }) => {
                    const raceCat = categoryBySlug.get(race.categoryId)
                    return (
                      <TableRow key={race.slug} className="border-border">
                        <TableCell>
                          <Link href={`/resultados/${race.slug}`} className="font-medium text-foreground hover:text-primary">
                            {race.name}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">{raceCat?.name}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {result.position <= 3 ? (
                            <span className="inline-flex items-center gap-1 font-bold text-primary">
                              <Trophy className="h-3 w-3" /> {result.position}º
                            </span>
                          ) : (
                            <span className="text-foreground">{result.position}º</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right font-medium text-foreground">{result.points}</TableCell>
                        <TableCell className="text-right text-muted-foreground">{result.bestLap}</TableCell>
                        <TableCell className="text-right text-muted-foreground">{result.totalTime}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  )
}

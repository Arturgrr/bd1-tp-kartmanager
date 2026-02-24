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
  pilots,
  getTeamById,
  getCategoryById,
  getPilotAllTimeStats,
  races,
} from "@/lib/mock-data"
import type { Metadata } from "next"
import { ArrowLeft, Trophy } from "lucide-react"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const pilot = pilots.find((p) => p.slug === slug)
  return { title: pilot?.name || "Piloto" }
}

export function generateStaticParams() {
  return pilots.map((p) => ({ slug: p.slug }))
}

export default async function PilotoDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const pilot = pilots.find((p) => p.slug === slug)
  if (!pilot) notFound()

  const team = getTeamById(pilot.teamId)
  const category = getCategoryById(pilot.categoryId)
  const stats = getPilotAllTimeStats(pilot.id)

  const pilotRaces = races
    .filter((r) => r.status === "completed" && r.results?.some((res) => res.pilotId === pilot.id))
    .map((r) => {
      const result = r.results!.find((res) => res.pilotId === pilot.id)!
      const cat = getCategoryById(r.categoryId)
      return { race: r, result, category: cat }
    })
    .sort((a, b) => new Date(b.race.date).getTime() - new Date(a.race.date).getTime())

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <Link href="/pilotos" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Voltar para pilotos
      </Link>

      <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-start">
        <div
          className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg font-serif text-4xl font-bold"
          style={{ backgroundColor: team?.color + "20", color: team?.color }}
        >
          {pilot.number}
        </div>
        <div className="flex-1">
          <h1 className="font-serif text-3xl font-bold uppercase tracking-tight text-foreground md:text-4xl">
            {pilot.name}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <Link href={`/equipes/${team?.slug}`}>
              <Badge variant="secondary" className="gap-1.5">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: team?.color }} />
                {team?.name}
              </Badge>
            </Link>
            <Link href={`/categorias/${category?.slug}`}>
              <Badge variant="outline" className="border-primary/30 text-primary">{category?.name}</Badge>
            </Link>
            <span className="text-sm text-muted-foreground">{pilot.city}</span>
          </div>
        </div>
      </div>

      {stats && (
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-5">
          {[
            { label: "Pontos Totais", value: stats.totalPoints },
            { label: "Vitorias", value: stats.totalWins },
            { label: "Podios", value: stats.totalPodiums },
            { label: "Temporadas", value: stats.totalSeasons },
            { label: "Melhor Posicao", value: `${stats.bestPosition}` + String.fromCharCode(186) },
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
                {pilot.seasonsHistory
                  .sort((a, b) => b.season.localeCompare(a.season))
                  .map((entry) => {
                    const entryCat = getCategoryById(entry.categoryId)
                    const entryTeam = getTeamById(entry.teamId)
                    return (
                      <TableRow key={entry.season + entry.categoryId} className="border-border">
                        <TableCell className="font-medium text-foreground">{entry.season}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">{entryCat?.name}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entryTeam?.color }} />
                            <span className="text-sm text-muted-foreground">{entryTeam?.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={entry.position <= 3 ? "font-bold text-primary" : "text-foreground"}>
                            {entry.position}{String.fromCharCode(186)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-medium text-foreground">{entry.points}</TableCell>
                        <TableCell className="text-right text-foreground">{entry.wins}</TableCell>
                        <TableCell className="text-right text-foreground">{entry.podiums}</TableCell>
                        <TableCell className="text-right text-muted-foreground">{entry.bestLap || "-"}</TableCell>
                      </TableRow>
                    )
                  })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

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
                  {pilotRaces.map(({ race, result, category: raceCat }) => (
                    <TableRow key={race.id} className="border-border">
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
                            <Trophy className="h-3 w-3" /> {result.position}{String.fromCharCode(186)}
                          </span>
                        ) : (
                          <span className="text-foreground">{result.position}{String.fromCharCode(186)}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-medium text-foreground">{result.points}</TableCell>
                      <TableCell className="text-right text-muted-foreground">{result.bestLap}</TableCell>
                      <TableCell className="text-right text-muted-foreground">{result.totalTime}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  )
}

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
  fetchCorridaBySlug,
  fetchEquipes,
  fetchPilotos,
  fetchResultadosByCorrida,
} from "@/lib/api"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { Metadata } from "next"
import { ArrowLeft, Trophy } from "lucide-react"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const race = await fetchCorridaBySlug(slug)
  return { title: race?.name ?? "Resultado" }
}

export default async function ResultadoDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [race, results, categories, pilots, teams] = await Promise.all([
    fetchCorridaBySlug(slug),
    fetchResultadosByCorrida(slug),
    fetchCategorias(),
    fetchPilotos(),
    fetchEquipes(),
  ])
  if (!race || race.status !== "completed") notFound()

  const category = categories.find((c) => c.slug === race.categoryId)
  const pilotByCpf = new Map(pilots.map((p) => [p.cpf, p]))
  const teamBySlug = new Map(teams.map((t) => [t.slug, t]))
  const sortedResults = [...results].sort((a, b) => a.position - b.position)

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <Link href="/resultados" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Voltar para resultados
      </Link>

      <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold uppercase tracking-tight text-foreground md:text-4xl">
            {race.name}
          </h1>
          <p className="mt-1 text-muted-foreground">{race.track}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{category?.name}</Badge>
            <span className="text-sm text-muted-foreground">
              {format(new Date(race.date), "dd MMMM yyyy", { locale: ptBR })}
            </span>
          </div>
        </div>
      </div>

      <Card className="mt-8 border-border bg-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="w-12 text-muted-foreground">Pos.</TableHead>
                <TableHead className="text-muted-foreground">Piloto</TableHead>
                <TableHead className="text-muted-foreground">Equipe</TableHead>
                <TableHead className="text-right text-muted-foreground">Melhor Volta</TableHead>
                <TableHead className="text-right text-muted-foreground">Tempo Total</TableHead>
                <TableHead className="text-right text-muted-foreground">Pts</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedResults.map((result) => {
                const pilot = pilotByCpf.get(result.pilotId)
                const team = teamBySlug.get(result.teamId)
                const positionColors: Record<number, string> = { 1: "text-gold", 2: "text-silver", 3: "text-bronze" }
                return (
                  <TableRow key={result.pilotId} className="border-border">
                    <TableCell>
                      <span className={`font-serif text-lg font-bold ${positionColors[result.position] ?? "text-foreground"}`}>
                        {result.position <= 3 && <Trophy className="mr-1 inline h-3.5 w-3.5" />}
                        {result.position}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Link href={`/pilotos/${pilot?.slug ?? ""}`} className="font-medium text-foreground hover:text-primary">
                        {pilot?.name ?? result.pilotId}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/equipes/${team?.slug ?? ""}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: team?.color }} />
                        {team?.name ?? result.teamId}
                      </Link>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">{result.bestLap}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{result.totalTime}</TableCell>
                    <TableCell className="text-right font-medium text-foreground">{result.points}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

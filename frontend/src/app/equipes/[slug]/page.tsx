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
import { fetchCategorias, fetchEquipeBySlug, fetchPilotos, fetchStandings } from "@/lib/api"
import type { Metadata } from "next"
import { ArrowLeft } from "lucide-react"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const team = await fetchEquipeBySlug(slug)
  return { title: team?.name ?? "Equipe" }
}

export default async function EquipeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [team, pilots, categories] = await Promise.all([
    fetchEquipeBySlug(slug),
    fetchPilotos(),
    fetchCategorias(),
  ])
  if (!team) notFound()

  const teamPilots = pilots.filter((p) => p.teamSlug === slug)
  const teamCategorySlugs = [...new Set(teamPilots.map((p) => p.categorySlug))]
  const teamCategories = categories.filter((c) => teamCategorySlugs.includes(c.slug))

  const seasons = ["2025", "2024", "2023"]
  let totalWins = 0
  let totalPoints = 0
  for (const cat of teamCategories) {
    for (const season of seasons) {
      const standings = await fetchStandings(cat.slug, season)
      const teamStandings = standings.filter((s) => s.teamId === slug)
      totalWins += teamStandings.reduce((s, e) => s + e.wins, 0)
      totalPoints += teamStandings.reduce((s, e) => s + e.points, 0)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <Link href="/equipes" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Voltar para equipes
      </Link>

      <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-center">
        <div
          className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: team.color }}
        >
          <span className="font-serif text-2xl font-bold text-foreground">{team.name.charAt(0)}</span>
        </div>
        <div>
          <h1 className="font-serif text-3xl font-bold uppercase tracking-tight text-foreground md:text-4xl">
            {team.name}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <span className="text-sm text-muted-foreground">{team.city}</span>
            <span className="text-sm text-muted-foreground">Fundada em {team.foundedYear}</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {teamCategories.map((cat) => (
              <Link key={cat.id} href={`/categorias/${cat.slug}`}>
                <Badge variant="outline" className="border-primary/30 text-primary">{cat.name}</Badge>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card className="border-border bg-card">
          <CardContent className="py-4 text-center">
            <p className="font-serif text-2xl font-bold text-foreground">{teamPilots.length}</p>
            <p className="text-xs uppercase text-muted-foreground">Pilotos</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="py-4 text-center">
            <p className="font-serif text-2xl font-bold text-foreground">{teamCategories.length}</p>
            <p className="text-xs uppercase text-muted-foreground">Categorias</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="py-4 text-center">
            <p className="font-serif text-2xl font-bold text-foreground">{totalWins}</p>
            <p className="text-xs uppercase text-muted-foreground">Vitorias Totais</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="py-4 text-center">
            <p className="font-serif text-2xl font-bold text-foreground">{totalPoints}</p>
            <p className="text-xs uppercase text-muted-foreground">Pontos Totais</p>
          </CardContent>
        </Card>
      </div>

      {teamCategories.map((cat) => {
        const catPilots = teamPilots.filter((p) => p.categorySlug === cat.slug)
        if (catPilots.length === 0) return null
        return (
          <section key={cat.id} className="mt-10">
            <h2 className="mb-4 font-serif text-xl font-bold uppercase text-foreground">
              Pilotos - {cat.name}
            </h2>
            <Card className="border-border bg-card">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="text-muted-foreground">Num.</TableHead>
                      <TableHead className="text-muted-foreground">Nome</TableHead>
                      <TableHead className="text-muted-foreground">Cidade</TableHead>
                      <TableHead className="text-right text-muted-foreground">Pontos</TableHead>
                      <TableHead className="text-right text-muted-foreground">Vitorias</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {catPilots.map((pilot) => (
                      <TableRow key={pilot.cpf} className="border-border">
                        <TableCell>
                          <div
                            className="flex h-8 w-8 items-center justify-center rounded font-serif text-sm font-bold"
                            style={{ backgroundColor: team.color + "20", color: team.color }}
                          >
                            {pilot.number}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Link href={`/pilotos/${pilot.slug}`} className="font-medium text-foreground hover:text-primary">
                            {pilot.name}
                          </Link>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{pilot.city}</TableCell>
                        <TableCell className="text-right font-medium text-foreground">-</TableCell>
                        <TableCell className="text-right text-foreground">-</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </section>
        )
      })}
    </div>
  )
}

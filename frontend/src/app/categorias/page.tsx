import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { categories, getPilotsByCategory, getTeamById } from "@/lib/mock-data"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Categorias",
}

export default function CategoriasPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-serif text-3xl font-bold uppercase tracking-tight text-foreground md:text-4xl">
        Categorias
      </h1>
      <p className="mt-2 text-muted-foreground">As categorias organizadas por faixa etaria dos pilotos.</p>

      <div className="mt-8 flex flex-col gap-6">
        {categories.map((cat) => {
          const catPilots = getPilotsByCategory(cat.id)
          const uniqueTeams = [...new Set(catPilots.map((p) => p.teamId))]
          return (
            <Card key={cat.id} className="border-border bg-card">
              <CardHeader>
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle className="font-serif text-xl font-bold uppercase text-foreground">{cat.name}</CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">{cat.description}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="border-primary/30 text-primary">
                      {cat.minAge} - {cat.maxAge === 99 ? "+" : cat.maxAge} anos
                    </Badge>
                    <Link
                      href={`/categorias/${cat.slug}`}
                      className="rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      Ver Classificacao
                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {catPilots.map((pilot) => {
                    const team = getTeamById(pilot.teamId)
                    const currentSeason = pilot.seasonsHistory.find(
                      (s) => s.categoryId === cat.id && s.season === "2025"
                    )
                    return (
                      <Link key={pilot.id} href={`/pilotos/${pilot.slug}`}>
                        <div className="flex items-center gap-3 rounded-md bg-secondary/50 p-3 transition-colors hover:bg-secondary">
                          <div
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded font-serif text-sm font-bold"
                            style={{ backgroundColor: team?.color + "20", color: team?.color }}
                          >
                            {pilot.number}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-foreground">{pilot.name}</p>
                            <div className="flex items-center gap-1.5">
                              <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: team?.color }} />
                              <span className="truncate text-xs text-muted-foreground">{team?.name}</span>
                            </div>
                          </div>
                          {currentSeason && (
                            <span className="shrink-0 font-serif text-sm font-bold text-primary">
                              {currentSeason.points}pts
                            </span>
                          )}
                        </div>
                      </Link>
                    )
                  })}
                </div>
                <div className="mt-4 flex gap-2">
                  <span className="text-xs text-muted-foreground">{catPilots.length} pilotos</span>
                  <span className="text-xs text-muted-foreground">{uniqueTeams.length} equipes</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { pilots, getTeamById, getCategoryById } from "@/lib/mock-data"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pilotos",
}

export default function PilotosPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-serif text-3xl font-bold uppercase tracking-tight text-foreground md:text-4xl">
        Pilotos
      </h1>
      <p className="mt-2 text-muted-foreground">Todos os pilotos registrados na UFOPKART.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {pilots.map((pilot) => {
          const team = getTeamById(pilot.teamId)
          const category = getCategoryById(pilot.categoryId)
          const totalPoints = pilot.seasonsHistory.reduce((sum, s) => sum + s.points, 0)
          const totalWins = pilot.seasonsHistory.reduce((sum, s) => sum + s.wins, 0)
          return (
            <Link key={pilot.id} href={`/pilotos/${pilot.slug}`}>
              <Card className="border-border bg-card transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                <CardContent className="pt-5">
                  <div className="flex items-start justify-between">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-md font-serif text-xl font-bold"
                      style={{ backgroundColor: team?.color + "20", color: team?.color }}
                    >
                      {pilot.number}
                    </div>
                    <Badge variant="secondary" className="text-xs">{category?.name}</Badge>
                  </div>
                  <h3 className="mt-3 font-serif text-base font-semibold text-foreground">{pilot.name}</h3>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: team?.color }} />
                    <span className="text-sm text-muted-foreground">{team?.name}</span>
                  </div>
                  <div className="mt-4 flex items-center gap-4 border-t border-border pt-3">
                    <div>
                      <p className="font-serif text-lg font-bold text-foreground">{totalPoints}</p>
                      <p className="text-[10px] uppercase text-muted-foreground">Pontos</p>
                    </div>
                    <div>
                      <p className="font-serif text-lg font-bold text-foreground">{totalWins}</p>
                      <p className="text-[10px] uppercase text-muted-foreground">Vitorias</p>
                    </div>
                    <div>
                      <p className="font-serif text-lg font-bold text-foreground">{pilot.seasonsHistory.length}</p>
                      <p className="text-[10px] uppercase text-muted-foreground">Temporadas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

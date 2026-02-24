import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  getCompletedRaces,
  getCategoryById,
  getPilotById,
  getTeamById,
} from "@/lib/mock-data"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { Metadata } from "next"
import { Trophy } from "lucide-react"

export const metadata: Metadata = {
  title: "Resultados",
}

export default function ResultadosPage() {
  const completedRaces = getCompletedRaces()

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-serif text-3xl font-bold uppercase tracking-tight text-foreground md:text-4xl">
        Resultados
      </h1>
      <p className="mt-2 text-muted-foreground">Historico de corridas finalizadas e seus resultados.</p>

      <div className="mt-8 flex flex-col gap-4">
        {completedRaces.map((race) => {
          const category = getCategoryById(race.categoryId)
          const podium = race.results?.slice(0, 3) || []
          const winner = podium[0] ? getPilotById(podium[0].pilotId) : null
          const winnerTeam = podium[0] ? getTeamById(podium[0].teamId) : null
          return (
            <Link key={race.id} href={`/resultados/${race.slug}`}>
              <Card className="border-border bg-card transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                <CardContent className="flex flex-col gap-4 py-5 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-md bg-secondary text-foreground">
                      <span className="font-serif text-lg font-bold leading-none">
                        {format(new Date(race.date), "dd")}
                      </span>
                      <span className="text-[10px] font-medium uppercase text-muted-foreground">
                        {format(new Date(race.date), "MMM", { locale: ptBR })}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif text-base font-semibold text-foreground">{race.name}</h3>
                        <Badge variant="secondary" className="text-xs">{category?.name}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{race.track}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    {podium.map((result, idx) => {
                      const pilot = getPilotById(result.pilotId)
                      const team = getTeamById(result.teamId)
                      const positionColors = ["text-gold", "text-silver", "text-bronze"]
                      return (
                        <div key={result.position} className="flex items-center gap-2">
                          <span className={`font-serif text-lg font-bold ${positionColors[idx]}`}>
                            {result.position}
                          </span>
                          <div>
                            <p className="text-sm font-medium text-foreground">{pilot?.name}</p>
                            <div className="flex items-center gap-1">
                              <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: team?.color }} />
                              <span className="text-xs text-muted-foreground">{team?.name}</span>
                            </div>
                          </div>
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
  )
}

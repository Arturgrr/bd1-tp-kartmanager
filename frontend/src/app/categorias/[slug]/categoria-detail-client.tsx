"use client"

import Link from "next/link"
import { useCallback, useState } from "react"
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
import { fetchStandings } from "@/lib/api"
import type { CategoriaFromAPI, StandingFromAPI } from "@/lib/api"
import { ArrowLeft, Trophy } from "lucide-react"

type PilotsMap = Map<string, { slug: string; name: string; number: number }>
type TeamsMap = Map<string, { name: string; color: string; slug: string }>

type Props = {
  category: CategoriaFromAPI
  availableSeasons: string[]
  initialStandings: StandingFromAPI[]
  pilotsMap: PilotsMap
  teamsMap: TeamsMap
}

export function CategoriaDetailClient({
  category,
  availableSeasons,
  initialStandings,
  pilotsMap,
  teamsMap,
}: Props) {
  const [selectedSeason, setSelectedSeason] = useState(availableSeasons[0] ?? "2025")
  const [standings, setStandings] = useState<StandingFromAPI[]>(initialStandings)
  const [loading, setLoading] = useState(false)

  const handleSeasonChange = useCallback(
    async (season: string) => {
      setSelectedSeason(season)
      setLoading(true)
      try {
        const data = await fetchStandings(category.slug, season)
        setStandings(data)
      } finally {
        setLoading(false)
      }
    },
    [category.slug]
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <Link href="/categorias" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Voltar para categorias
      </Link>

      <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold uppercase tracking-tight text-foreground md:text-4xl">
            {category.name}
          </h1>
          <p className="mt-1 text-muted-foreground">{category.description}</p>
          <Badge variant="outline" className="mt-2 border-primary/30 text-primary">
            {category.minAge} - {category.maxAge === 99 ? "+" : category.maxAge} anos
          </Badge>
        </div>

        <div className="flex gap-2">
          {availableSeasons.map((season) => (
            <button
              key={season}
              type="button"
              onClick={() => handleSeasonChange(season)}
              disabled={loading}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                selectedSeason === season
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {season}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <Card className="border-border bg-card">
          <CardContent className="py-4 text-center">
            <p className="font-serif text-2xl font-bold text-foreground">{standings.length}</p>
            <p className="text-xs uppercase text-muted-foreground">Pilotos</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="py-4 text-center">
            <p className="font-serif text-2xl font-bold text-foreground">-</p>
            <p className="text-xs uppercase text-muted-foreground">Corridas Realizadas</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="py-4 text-center">
            <p className="font-serif text-2xl font-bold text-foreground">-</p>
            <p className="text-xs uppercase text-muted-foreground">Corridas Restantes</p>
          </CardContent>
        </Card>
      </div>

      <section className="mt-8">
        <h2 className="mb-4 font-serif text-xl font-bold uppercase text-foreground">
          Classificacao - Temporada {selectedSeason}
        </h2>
        {standings.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum resultado para esta temporada.</p>
        ) : (
          <Card className="border-border bg-card">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="w-12 text-muted-foreground">Pos.</TableHead>
                    <TableHead className="text-muted-foreground">Piloto</TableHead>
                    <TableHead className="text-muted-foreground">Equipe</TableHead>
                    <TableHead className="text-right text-muted-foreground">Pts</TableHead>
                    <TableHead className="text-right text-muted-foreground">Vit.</TableHead>
                    <TableHead className="text-right text-muted-foreground">Podios</TableHead>
                    <TableHead className="text-right text-muted-foreground">Melhor Volta</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {standings.map((entry) => {
                    const team = teamsMap.get(entry.teamId)
                    const pilot = pilotsMap.get(entry.pilotId)
                    const positionColors: Record<number, string> = { 1: "text-gold", 2: "text-silver", 3: "text-bronze" }
                    return (
                      <TableRow key={entry.pilotId + entry.season} className="border-border">
                        <TableCell>
                          <span className={`font-serif text-lg font-bold ${positionColors[entry.position] ?? "text-foreground"}`}>
                            {entry.position <= 3 && <Trophy className="mr-1 inline h-3.5 w-3.5" />}
                            {entry.position}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Link href={`/pilotos/${pilot?.slug ?? ""}`} className="flex items-center gap-2">
                            <div
                              className="flex h-7 w-7 shrink-0 items-center justify-center rounded font-serif text-xs font-bold"
                              style={{ backgroundColor: team?.color ? team.color + "20" : undefined, color: team?.color }}
                            >
                              {pilot?.number ?? ""}
                            </div>
                            <span className="font-medium text-foreground hover:text-primary">{pilot?.name ?? entry.pilotId}</span>
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Link href={`/equipes/${team?.slug ?? ""}`} className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: team?.color }} />
                            <span className="text-sm text-muted-foreground hover:text-primary">{team?.name ?? entry.teamId}</span>
                          </Link>
                        </TableCell>
                        <TableCell className="text-right font-serif text-base font-bold text-primary">{entry.points}</TableCell>
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
        )}
      </section>
    </div>
  )
}

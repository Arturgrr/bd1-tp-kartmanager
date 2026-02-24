import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { fetchCategorias, fetchPilotos } from "@/lib/api"
import { getTeamBySlug } from "@/lib/mock-data"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pilotos",
}

export default async function PilotosPage() {
  const [pilots, categories] = await Promise.all([
    fetchPilotos(),
    fetchCategorias(),
  ])

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-serif text-3xl font-bold uppercase tracking-tight text-foreground md:text-4xl">
        Pilotos
      </h1>
      <p className="mt-2 text-muted-foreground">Todos os pilotos registrados na UFOPKART.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {pilots.map((pilot) => {
          const team = getTeamBySlug(pilot.teamSlug)
          const category = categories.find((c) => c.slug === pilot.categorySlug)
          return (
            <Link key={pilot.cpf} href={`/pilotos/${pilot.slug}`}>
              <Card className="border-border bg-card transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                <CardContent className="pt-5">
                  <div className="flex items-start justify-between">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-md font-serif text-xl font-bold"
                      style={{ backgroundColor: team ? team.color + "20" : "#333", color: team?.color ?? "#fff" }}
                    >
                      {pilot.number}
                    </div>
                    <Badge variant="secondary" className="text-xs">{category?.name ?? pilot.categorySlug}</Badge>
                  </div>
                  <h3 className="mt-3 font-serif text-base font-semibold text-foreground">{pilot.name}</h3>
                  <div className="mt-1 flex items-center gap-2">
                    {team && (
                      <>
                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: team.color }} />
                        <span className="text-sm text-muted-foreground">{team.name}</span>
                      </>
                    )}
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

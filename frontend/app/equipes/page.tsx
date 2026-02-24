import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { teams, getPilotsByTeam, getTeamCategories } from "@/lib/mock-data"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Equipes",
}

export default function EquipesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-serif text-3xl font-bold uppercase tracking-tight text-foreground md:text-4xl">
        Equipes
      </h1>
      <p className="mt-2 text-muted-foreground">Conheca as equipes que competem na UFOPKART.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {teams.map((team) => {
          const teamPilots = getPilotsByTeam(team.id)
          const teamCategories = getTeamCategories(team.id)
          return (
            <Link key={team.id} href={`/equipes/${team.slug}`}>
              <Card className="border-border bg-card transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                <CardContent className="pt-5">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded-md"
                      style={{ backgroundColor: team.color }}
                    />
                    <div>
                      <h3 className="font-serif text-lg font-bold text-foreground">{team.name}</h3>
                      <p className="text-sm text-muted-foreground">{team.city}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {teamCategories.map((cat) => (
                      <Badge key={cat.id} variant="secondary" className="text-xs">{cat.name}</Badge>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center gap-4 border-t border-border pt-3">
                    <div>
                      <p className="font-serif text-lg font-bold text-foreground">{teamPilots.length}</p>
                      <p className="text-[10px] uppercase text-muted-foreground">Pilotos</p>
                    </div>
                    <div>
                      <p className="font-serif text-lg font-bold text-foreground">{teamCategories.length}</p>
                      <p className="text-[10px] uppercase text-muted-foreground">Categorias</p>
                    </div>
                    <div>
                      <p className="font-serif text-lg font-bold text-foreground">{team.foundedYear}</p>
                      <p className="text-[10px] uppercase text-muted-foreground">Fundacao</p>
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

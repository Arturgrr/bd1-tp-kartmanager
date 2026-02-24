import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchCategorias, fetchCorridasCompleted, fetchCorridasUpcoming } from "@/lib/api"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Calendario",
}

export default async function CalendarioPage() {
  const [upcomingRaces, completedRaces, categories] = await Promise.all([
    fetchCorridasUpcoming(),
    fetchCorridasCompleted(),
    fetchCategorias(),
  ])

  const categoryBySlug = new Map(categories.map((c) => [c.slug, c]))

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-serif text-3xl font-bold uppercase tracking-tight text-foreground md:text-4xl">
        Calendario
      </h1>
      <p className="mt-2 text-muted-foreground">Todas as corridas da temporada.</p>

      <section className="mt-10">
        <h2 className="mb-4 font-serif text-xl font-bold uppercase text-foreground">Proximas Corridas</h2>
        {upcomingRaces.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhuma corrida agendada.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {upcomingRaces.map((race) => {
              const category = categoryBySlug.get(race.categoryId)
              return (
                <Card key={race.id} className="border-border bg-card">
                  <CardContent className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-md bg-primary/10 text-primary">
                        <span className="font-serif text-lg font-bold leading-none">
                          {format(new Date(race.date), "dd")}
                        </span>
                        <span className="text-[10px] font-medium uppercase">
                          {format(new Date(race.date), "MMM", { locale: ptBR })}
                        </span>
                      </div>
                      <div>
                        <p className="font-serif text-base font-semibold text-foreground">{race.name}</p>
                        <p className="text-sm text-muted-foreground">{race.track}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">{category?.name}</Badge>
                      <Badge variant="outline" className="border-primary/30 text-primary">Em breve</Badge>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </section>

      <section className="mt-12">
        <h2 className="mb-4 font-serif text-xl font-bold uppercase text-foreground">Por Categoria</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {categories.map((cat) => {
            const catUpcoming = upcomingRaces.filter((r) => r.categoryId === cat.slug)
            const catCompleted = completedRaces.filter((r) => r.categoryId === cat.slug)
            return (
              <Card key={cat.id} className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="font-serif text-lg font-bold uppercase text-foreground">{cat.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-3">
                    {catUpcoming.length === 0 && catCompleted.length === 0 && (
                      <p className="text-sm text-muted-foreground">Nenhuma corrida registrada.</p>
                    )}
                    {catCompleted.map((race) => (
                      <div key={race.id} className="flex items-center justify-between rounded-md bg-secondary/50 px-3 py-2">
                        <div>
                          <p className="text-sm font-medium text-foreground">{race.name}</p>
                          <p className="text-xs text-muted-foreground">{race.track}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(race.date), "dd MMM yyyy", { locale: ptBR })}
                          </span>
                          <Badge variant="secondary" className="text-[10px]">Finalizada</Badge>
                        </div>
                      </div>
                    ))}
                    {catUpcoming.map((race) => (
                      <div key={race.id} className="flex items-center justify-between rounded-md border border-primary/20 bg-primary/5 px-3 py-2">
                        <div>
                          <p className="text-sm font-medium text-foreground">{race.name}</p>
                          <p className="text-xs text-muted-foreground">{race.track}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(race.date), "dd MMM yyyy", { locale: ptBR })}
                          </span>
                          <Badge variant="outline" className="border-primary/30 text-[10px] text-primary">Em breve</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { axiosInstance } from "@/lib/api/kubb/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Flag, Users, UserCircle, Calendar, BarChart3 } from "lucide-react"

type Counts = {
  categorias: number
  equipes: number
  pilotos: number
  corridas: number
  standings: number
}

export default function AdminHomePage() {
  const [counts, setCounts] = useState<Counts | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    axiosInstance
      .get<Counts>("/admin/summary")
      .then((res) => setCounts(res.data))
      .catch(() => setError("Erro ao carregar resumo."))
  }, [])

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4">
        <p className="text-destructive">{error}</p>
      </div>
    )
  }

  if (!counts) {
    return (
      <div className="mx-auto max-w-7xl px-4">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    )
  }

  const items = [
    { href: "/admin/categorias", label: "Categorias", count: counts.categorias, icon: Flag },
    { href: "/admin/equipes", label: "Equipes", count: counts.equipes, icon: Users },
    { href: "/admin/pilotos", label: "Pilotos", count: counts.pilotos, icon: UserCircle },
    { href: "/admin/corridas", label: "Corridas", count: counts.corridas, icon: Calendar },
    { href: "/admin/standings", label: "Standings", count: counts.standings, icon: BarChart3 },
  ]

  return (
    <div className="mx-auto w-full max-w-7xl px-4">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold uppercase tracking-tight text-foreground md:text-4xl">
          Dashboard
        </h1>
        <p className="mt-2 text-muted-foreground">
          Resumo do painel administrativo.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Link key={item.href} href={item.href}>
            <Card className="h-full border-border bg-card transition-colors hover:border-primary/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-serif text-lg font-semibold text-foreground">
                  {item.label}
                </CardTitle>
                <item.icon className="size-5 shrink-0 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="font-serif text-3xl font-bold text-foreground">
                  {item.count}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

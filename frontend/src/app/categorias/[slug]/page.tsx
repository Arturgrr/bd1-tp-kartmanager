import { notFound } from "next/navigation"
import { fetchCategoriaBySlug, fetchCorridas, fetchEquipes, fetchPilotos, fetchStandings } from "@/lib/api"
import { CategoriaDetailClient } from "./categoria-detail-client"

export default async function CategoriaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [category, corridas, pilots, teams] = await Promise.all([
    fetchCategoriaBySlug(slug),
    fetchCorridas(),
    fetchPilotos(),
    fetchEquipes(),
  ])
  if (!category) notFound()

  const categoryRaces = corridas.filter((r) => r.categoryId === slug)
  const seasons = [...new Set(categoryRaces.map((r) => r.season))].sort((a, b) => b.localeCompare(a))
  const availableSeasons = seasons.length > 0 ? seasons : ["2025"]
  const defaultSeason = availableSeasons[0] ?? "2025"
  const initialStandings = await fetchStandings(slug, defaultSeason)

  const pilotsMap = new Map(pilots.map((p) => [p.cpf, { slug: p.slug, name: p.name, number: p.number }]))
  const teamsMap = new Map(teams.map((t) => [t.slug, { name: t.name, color: t.color, slug: t.slug }]))

  return (
    <CategoriaDetailClient
      category={category}
      availableSeasons={availableSeasons}
      initialStandings={initialStandings}
      pilotsMap={pilotsMap}
      teamsMap={teamsMap}
    />
  )
}

"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { axiosInstance } from "@/lib/api/kubb/client"
import { deleteAdminStandingsPilotocpfTemporadaCategoriaslug } from "@/lib/api/kubb/client/deleteAdminStandingsPilotocpfTemporadaCategoriaslug"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Pencil, Plus, Trash2 } from "lucide-react"
import type { StandingFromAPI } from "@/lib/api"

type StandingRow = StandingFromAPI & { pilotoCpf?: string }

function standingKey(s: StandingFromAPI): string {
  return `${s.pilotId}-${s.season}-${s.categoryId}`
}

export default function AdminStandingsPage() {
  const [items, setItems] = useState<StandingRow[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteKey, setDeleteKey] = useState<{ pilotoCpf: string; temporada: string; categoriaSlug: string } | null>(null)
  const [deleting, setDeleting] = useState(false)

  function load() {
    setLoading(true)
    axiosInstance
      .get<StandingFromAPI[]>("/admin/standings")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : []
        setItems(data.map((s) => ({ ...s, pilotoCpf: s.pilotId })))
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  function confirmDelete() {
    if (!deleteKey) return
    setDeleting(true)
    deleteAdminStandingsPilotocpfTemporadaCategoriaslug(
      deleteKey.pilotoCpf,
      deleteKey.temporada,
      deleteKey.categoriaSlug,
    )
      .then(() => {
        setDeleteKey(null)
        load()
      })
      .finally(() => setDeleting(false))
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold uppercase tracking-tight text-foreground md:text-4xl">
            Standings
          </h1>
          <p className="mt-2 text-muted-foreground">
            Classificacao piloto/temporada/categoria.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/standings/novo">
            <Plus className="size-4" />
            Novo
          </Link>
        </Button>
      </div>
      <Card className="mt-6 border-border bg-card">
        <CardHeader>
          <CardTitle className="font-serif text-lg">Lista</CardTitle>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <p className="text-muted-foreground">Nenhum registro.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Piloto</TableHead>
                  <TableHead>Temporada</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Equipe</TableHead>
                  <TableHead>Pos.</TableHead>
                  <TableHead>Pontos</TableHead>
                  <TableHead>Vitorias</TableHead>
                  <TableHead>Podios</TableHead>
                  <TableHead className="text-right">Acoes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((s) => (
                  <TableRow key={standingKey(s)}>
                    <TableCell className="font-medium">{s.pilotId}</TableCell>
                    <TableCell>{s.season}</TableCell>
                    <TableCell>{s.categoryId}</TableCell>
                    <TableCell>{s.teamId}</TableCell>
                    <TableCell>{s.position}</TableCell>
                    <TableCell>{s.points}</TableCell>
                    <TableCell>{s.wins}</TableCell>
                    <TableCell>{s.podiums}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" asChild>
                          <Link href={`/admin/standings/${encodeURIComponent(s.pilotId)}/${encodeURIComponent(s.season)}/${encodeURIComponent(s.categoryId)}`}>
                            <Pencil className="size-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            setDeleteKey({
                              pilotoCpf: s.pilotId,
                              temporada: s.season,
                              categoriaSlug: s.categoryId,
                            })
                          }
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <AlertDialog open={!!deleteKey} onOpenChange={() => !deleting && setDeleteKey(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir registro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acao nao pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                confirmDelete()
              }}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { axiosInstance } from "@/lib/api/kubb/client"
import { deleteAdminCorridasSlugResultadosPosicao } from "@/lib/api/kubb/client/deleteAdminCorridasSlugResultadosPosicao"
import { getCorridasSlug } from "@/lib/api/kubb/client/getCorridasSlug"
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
import type { CorridaFromAPI } from "@/lib/api"
import type { RaceResultFromAPI } from "@/lib/api"

export default function AdminCorridasSlugResultadosPage() {
  const params = useParams()
  const slug = params.slug as string
  const [corrida, setCorrida] = useState<CorridaFromAPI | null>(null)
  const [items, setItems] = useState<RaceResultFromAPI[]>([])
  const [loading, setLoading] = useState(true)
  const [deletePosicao, setDeletePosicao] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  function load() {
    setLoading(true)
    Promise.all([
      getCorridasSlug(slug).then((c) => setCorrida(c as CorridaFromAPI)).catch(() => setCorrida(null)),
      axiosInstance.get<RaceResultFromAPI[]>(`/admin/corridas/${slug}/resultados`).then((res) => setItems(Array.isArray(res.data) ? res.data : [])).catch(() => setItems([])),
    ]).finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [slug])

  function confirmDelete() {
    if (deletePosicao === null) return
    setDeleting(true)
    deleteAdminCorridasSlugResultadosPosicao(slug, String(deletePosicao))
      .then(() => {
        setDeletePosicao(null)
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

  if (!corrida) {
    return (
      <div className="mx-auto max-w-7xl">
        <p className="text-muted-foreground">Corrida nao encontrada.</p>
        <Button variant="link" asChild>
          <Link href="/admin/corridas">Voltar</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link href="/admin/corridas">
          Voltar
        </Link>
      </Button>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold uppercase tracking-tight text-foreground md:text-4xl">
            Resultados — {corrida.name}
          </h1>
          <p className="mt-2 text-muted-foreground">
            Gerencie os resultados desta corrida.
          </p>
        </div>
        <Button asChild>
          <Link href={`/admin/corridas/${slug}/resultados/novo`}>
            <Plus className="size-4" />
            Novo resultado
          </Link>
        </Button>
      </div>
      <Card className="mt-6 border-border bg-card">
        <CardHeader>
          <CardTitle className="font-serif text-lg">Lista</CardTitle>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <p className="text-muted-foreground">Nenhum resultado cadastrado.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Posicao</TableHead>
                  <TableHead>Piloto (CPF)</TableHead>
                  <TableHead>Equipe</TableHead>
                  <TableHead>Melhor volta</TableHead>
                  <TableHead>Tempo total</TableHead>
                  <TableHead>Pontos</TableHead>
                  <TableHead className="text-right">Acoes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((r) => (
                  <TableRow key={r.position}>
                    <TableCell className="font-medium">{r.position}</TableCell>
                    <TableCell>{r.pilotId}</TableCell>
                    <TableCell>{r.teamId}</TableCell>
                    <TableCell>{r.bestLap}</TableCell>
                    <TableCell>{r.totalTime}</TableCell>
                    <TableCell>{r.points}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" asChild>
                          <Link href={`/admin/corridas/${slug}/resultados/${r.position}`}>
                            <Pencil className="size-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setDeletePosicao(r.position)}
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
      <AlertDialog open={deletePosicao !== null} onOpenChange={() => !deleting && setDeletePosicao(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir resultado?</AlertDialogTitle>
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

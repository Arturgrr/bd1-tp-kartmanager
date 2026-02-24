"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { axiosInstance } from "@/lib/api/kubb/client"
import { deleteAdminCorridasSlug } from "@/lib/api/kubb/client/deleteAdminCorridasSlug"
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
import { Pencil, Plus, Trash2, Trophy } from "lucide-react"
import type { CorridaFromAPI } from "@/lib/api"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function AdminCorridasPage() {
  const [items, setItems] = useState<CorridaFromAPI[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteSlug, setDeleteSlug] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  function load() {
    setLoading(true)
    axiosInstance
      .get<CorridaFromAPI[]>("/admin/corridas")
      .then((res) => setItems(Array.isArray(res.data) ? res.data : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  function confirmDelete() {
    if (!deleteSlug) return
    setDeleting(true)
    deleteAdminCorridasSlug(deleteSlug)
      .then(() => {
        setDeleteSlug(null)
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
            Corridas
          </h1>
          <p className="mt-2 text-muted-foreground">
            Listagem e gestao de corridas.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/corridas/nova">
            <Plus className="size-4" />
            Nova corrida
          </Link>
        </Button>
      </div>
      <Card className="mt-6 border-border bg-card">
        <CardHeader>
          <CardTitle className="font-serif text-lg">Lista</CardTitle>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <p className="text-muted-foreground">Nenhuma corrida cadastrada.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Pista</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Temporada</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Acoes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell>{c.slug}</TableCell>
                    <TableCell>
                      {c.date ? format(new Date(c.date), "dd/MM/yyyy", { locale: ptBR }) : ""}
                    </TableCell>
                    <TableCell>{c.track}</TableCell>
                    <TableCell>{c.categoryId}</TableCell>
                    <TableCell>{c.season}</TableCell>
                    <TableCell>{c.status}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" asChild>
                          <Link href={`/admin/corridas/${c.slug}/resultados`}>
                            <Trophy className="size-4" />
                          </Link>
                        </Button>
                        <Button variant="outline" size="icon" asChild>
                          <Link href={`/admin/corridas/${c.slug}`}>
                            <Pencil className="size-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setDeleteSlug(c.slug)}
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
      <AlertDialog open={!!deleteSlug} onOpenChange={() => !deleting && setDeleteSlug(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir corrida?</AlertDialogTitle>
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

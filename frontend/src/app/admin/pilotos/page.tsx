"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { axiosInstance } from "@/lib/api/kubb/client"
import { deleteAdminPilotosSlug } from "@/lib/api/kubb/client/deleteAdminPilotosSlug"
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
import type { PilotoFromAPI } from "@/lib/api"

export default function AdminPilotosPage() {
  const [items, setItems] = useState<PilotoFromAPI[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteSlug, setDeleteSlug] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  function load() {
    setLoading(true)
    axiosInstance
      .get<PilotoFromAPI[]>("/admin/pilotos")
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
    deleteAdminPilotosSlug(deleteSlug)
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
            Pilotos
          </h1>
          <p className="mt-2 text-muted-foreground">
            Listagem e gestao de pilotos.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/pilotos/novo">
            <Plus className="size-4" />
            Novo piloto
          </Link>
        </Button>
      </div>
      <Card className="mt-6 border-border bg-card">
        <CardHeader>
          <CardTitle className="font-serif text-lg">Lista</CardTitle>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <p className="text-muted-foreground">Nenhum piloto cadastrado.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Numero</TableHead>
                  <TableHead>Equipe</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-right">Acoes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((p) => (
                  <TableRow key={p.cpf}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell>{p.slug}</TableCell>
                    <TableCell>{p.number}</TableCell>
                    <TableCell>{p.teamSlug}</TableCell>
                    <TableCell>{p.categorySlug}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" asChild>
                          <Link href={`/admin/pilotos/${p.slug}`}>
                            <Pencil className="size-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setDeleteSlug(p.slug)}
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
            <AlertDialogTitle>Excluir piloto?</AlertDialogTitle>
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

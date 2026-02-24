"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { axiosInstance } from "@/lib/api/kubb/client"
import { deleteAdminEquipesSlug } from "@/lib/api/kubb/client/deleteAdminEquipesSlug"
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
import type { EquipeFromAPI } from "@/lib/api"

export default function AdminEquipesPage() {
  const [items, setItems] = useState<EquipeFromAPI[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteSlug, setDeleteSlug] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  function load() {
    setLoading(true)
    axiosInstance
      .get<EquipeFromAPI[]>("/admin/equipes")
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
    deleteAdminEquipesSlug(deleteSlug)
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
            Equipes
          </h1>
          <p className="mt-2 text-muted-foreground">
            Listagem e gestao de equipes.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/equipes/nova">
            <Plus className="size-4" />
            Nova equipe
          </Link>
        </Button>
      </div>
      <Card className="mt-6 border-border bg-card">
        <CardHeader>
          <CardTitle className="font-serif text-lg">Lista</CardTitle>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <p className="text-muted-foreground">Nenhuma equipe cadastrada.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Cor</TableHead>
                  <TableHead>Cidade</TableHead>
                  <TableHead>Fundacao</TableHead>
                  <TableHead className="text-right">Acoes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((eq) => (
                  <TableRow key={eq.id}>
                    <TableCell className="font-medium">{eq.name}</TableCell>
                    <TableCell>{eq.slug}</TableCell>
                    <TableCell>
                      <span
                        className="inline-block size-4 rounded border border-border"
                        style={{ backgroundColor: eq.color }}
                      />
                      <span className="ml-2">{eq.color}</span>
                    </TableCell>
                    <TableCell>{eq.city}</TableCell>
                    <TableCell>{eq.foundedYear}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" asChild>
                          <Link href={`/admin/equipes/${eq.slug}`}>
                            <Pencil className="size-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setDeleteSlug(eq.slug)}
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
            <AlertDialogTitle>Excluir equipe?</AlertDialogTitle>
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

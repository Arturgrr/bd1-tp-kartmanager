"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { getCategorias } from "@/lib/api/kubb/client/getCategorias"
import { getCorridasSlug } from "@/lib/api/kubb/client/getCorridasSlug"
import { putAdminCorridasSlug } from "@/lib/api/kubb/client/putAdminCorridasSlug"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import type { CategoriaFromAPI, CorridaFromAPI } from "@/lib/api"

const schema = z.object({
  name: z.string().min(1, "Nome obrigatorio"),
  date: z.string().min(1, "Data obrigatoria"),
  track: z.string().min(1, "Pista obrigatoria"),
  categorySlug: z.string().min(1, "Selecione a categoria"),
  season: z.string().min(1, "Temporada obrigatoria"),
  status: z.string().min(1, "Status obrigatorio"),
})

type FormValues = z.infer<typeof schema>

const statusOptions = [
  { value: "scheduled", label: "Agendada" },
  { value: "completed", label: "Realizada" },
  { value: "cancelled", label: "Cancelada" },
]

export default function AdminCorridasSlugPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const [loading, setLoading] = useState(true)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [categorias, setCategorias] = useState<CategoriaFromAPI[]>([])

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      date: "",
      track: "",
      categorySlug: "",
      season: "",
      status: "scheduled",
    },
  })

  useEffect(() => {
    Promise.all([getCorridasSlug(slug), getCategorias()])
      .then(([cor, cat]) => {
        const c = cor as CorridaFromAPI
        form.reset({
          name: c.name ?? "",
          date: c.date ? c.date.slice(0, 10) : "",
          track: c.track ?? "",
          categorySlug: c.categoryId ?? "",
          season: c.season ?? "",
          status: c.status ?? "scheduled",
        })
        setCategorias((cat ?? []) as CategoriaFromAPI[])
      })
      .catch(() => router.push("/admin/corridas"))
      .finally(() => setLoading(false))
  }, [slug, form, router])

  function onSubmit(values: FormValues) {
    setSubmitError(null)
    putAdminCorridasSlug(slug, {
      name: values.name,
      date: values.date,
      track: values.track,
      categorySlug: values.categorySlug,
      season: values.season,
      status: values.status,
    } as Parameters<typeof putAdminCorridasSlug>[1])
      .then(() => router.push("/admin/corridas"))
      .catch((err: { data?: { problems?: { field: string; message: string }[] } }) => {
        if (err.data?.problems?.length) {
          setSubmitError(err.data.problems.map((p) => `${p.field}: ${p.message}`).join(". "))
        } else {
          setSubmitError("Erro ao atualizar corrida.")
        }
      })
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link href="/admin/corridas">
          <ArrowLeft className="size-4" />
          Voltar
        </Link>
      </Button>
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="font-serif text-xl font-bold uppercase text-foreground">
            Editar corrida — {slug}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="track"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pista</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categorySlug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categorias.map((cat) => (
                          <SelectItem key={cat.slug} value={cat.slug}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="season"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Temporada</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {statusOptions.map((s) => (
                          <SelectItem key={s.value} value={s.value}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {submitError && (
                <p className="text-sm text-destructive">{submitError}</p>
              )}
              <div className="flex gap-2">
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Salvando..." : "Salvar"}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/admin/corridas">Cancelar</Link>
                </Button>
                <Button type="button" variant="secondary" asChild>
                  <Link href={`/admin/corridas/${slug}/resultados`}>
                    Resultados
                  </Link>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

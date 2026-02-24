"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { getCategoriasSlug } from "@/lib/api/kubb/client/getCategoriasSlug"
import { putAdminCategoriasSlug } from "@/lib/api/kubb/client/putAdminCategoriasSlug"
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import type { CategoriaFromAPI } from "@/lib/api"

const schema = z.object({
  name: z.string().min(1, "Nome obrigatorio"),
  minAge: z.coerce.number().int().min(0, "Min >= 0"),
  maxAge: z.coerce.number().int().min(0, "Max >= 0"),
  description: z.string().min(1, "Descricao obrigatoria"),
}).refine((d) => d.maxAge >= d.minAge, { message: "Max deve ser >= min", path: ["maxAge"] })

type FormValues = z.infer<typeof schema>

export default function AdminCategoriasSlugPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const [loading, setLoading] = useState(true)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", minAge: 0, maxAge: 99, description: "" },
  })

  useEffect(() => {
    getCategoriasSlug(slug)
      .then((d) => {
        const cat = d as CategoriaFromAPI
        form.reset({
          name: cat.name ?? "",
          minAge: cat.minAge ?? 0,
          maxAge: cat.maxAge ?? 99,
          description: cat.description ?? "",
        })
      })
      .catch(() => router.push("/admin/categorias"))
      .finally(() => setLoading(false))
  }, [slug, form, router])

  function onSubmit(values: FormValues) {
    setSubmitError(null)
    putAdminCategoriasSlug(slug, {
      name: values.name,
      minAge: values.minAge,
      maxAge: values.maxAge,
      description: values.description,
    } as Parameters<typeof putAdminCategoriasSlug>[1])
      .then(() => router.push("/admin/categorias"))
      .catch((err: { status?: number; data?: { problems?: { field: string; message: string }[] } }) => {
        if (err.data?.problems?.length) {
          setSubmitError(err.data.problems.map((p) => `${p.field}: ${p.message}`).join(". "))
        } else {
          setSubmitError("Erro ao atualizar categoria.")
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
        <Link href="/admin/categorias">
          <ArrowLeft className="size-4" />
          Voltar
        </Link>
      </Button>
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="font-serif text-xl font-bold uppercase text-foreground">
            Editar categoria — {slug}
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
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="minAge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Idade minima</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="maxAge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Idade maxima</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descricao</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
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
                  <Link href="/admin/categorias">Cancelar</Link>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

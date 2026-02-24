"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { getEquipesSlug } from "@/lib/api/kubb/client/getEquipesSlug"
import { putAdminEquipesSlug } from "@/lib/api/kubb/client/putAdminEquipesSlug"
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
import type { EquipeFromAPI } from "@/lib/api"

const schema = z.object({
  name: z.string().min(1, "Nome obrigatorio"),
  color: z.string().min(1, "Cor obrigatoria"),
  foundedYear: z.coerce.number().int().min(1, "Ano deve ser positivo"),
  city: z.string().min(1, "Cidade obrigatoria"),
})

type FormValues = z.infer<typeof schema>

export default function AdminEquipesSlugPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const [loading, setLoading] = useState(true)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", color: "#000000", foundedYear: 2020, city: "" },
  })

  useEffect(() => {
    getEquipesSlug(slug)
      .then((d) => {
        const eq = d as EquipeFromAPI
        form.reset({
          name: eq.name ?? "",
          color: eq.color ?? "#000000",
          foundedYear: eq.foundedYear ?? 2020,
          city: eq.city ?? "",
        })
      })
      .catch(() => router.push("/admin/equipes"))
      .finally(() => setLoading(false))
  }, [slug, form, router])

  function onSubmit(values: FormValues) {
    setSubmitError(null)
    putAdminEquipesSlug(slug, {
      name: values.name,
      color: values.color,
      foundedYear: values.foundedYear,
      city: values.city,
    } as Parameters<typeof putAdminEquipesSlug>[1])
      .then(() => router.push("/admin/equipes"))
      .catch((err: { data?: { problems?: { field: string; message: string }[] } }) => {
        if (err.data?.problems?.length) {
          setSubmitError(err.data.problems.map((p) => `${p.field}: ${p.message}`).join(". "))
        } else {
          setSubmitError("Erro ao atualizar equipe.")
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
        <Link href="/admin/equipes">
          <ArrowLeft className="size-4" />
          Voltar
        </Link>
      </Button>
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="font-serif text-xl font-bold uppercase text-foreground">
            Editar equipe — {slug}
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
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cor</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input type="color" className="h-9 w-14 p-1" {...field} />
                        <Input className="flex-1" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="foundedYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ano de fundacao</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade</FormLabel>
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
                  <Link href="/admin/equipes">Cancelar</Link>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

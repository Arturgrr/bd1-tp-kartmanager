"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { getCategorias } from "@/lib/api/kubb/client/getCategorias"
import { getEquipes } from "@/lib/api/kubb/client/getEquipes"
import { getPilotosSlug } from "@/lib/api/kubb/client/getPilotosSlug"
import { putAdminPilotosSlug } from "@/lib/api/kubb/client/putAdminPilotosSlug"
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
import type { CategoriaFromAPI, EquipeFromAPI, PilotoFromAPI } from "@/lib/api"

const schema = z.object({
  name: z.string().min(1, "Nome obrigatorio"),
  slug: z.string().min(1, "Slug obrigatorio"),
  number: z.coerce.number().int().min(0, "Numero >= 0"),
  birthYear: z.coerce.number().int().min(1900, "Ano valido"),
  city: z.string().min(1, "Cidade obrigatoria"),
  teamSlug: z.string().min(1, "Selecione a equipe"),
  categorySlug: z.string().min(1, "Selecione a categoria"),
})

type FormValues = z.infer<typeof schema>

export default function AdminPilotosSlugPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const [loading, setLoading] = useState(true)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [equipes, setEquipes] = useState<EquipeFromAPI[]>([])
  const [categorias, setCategorias] = useState<CategoriaFromAPI[]>([])

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      slug: "",
      number: 0,
      birthYear: 2000,
      city: "",
      teamSlug: "",
      categorySlug: "",
    },
  })

  useEffect(() => {
    Promise.all([getPilotosSlug(slug), getEquipes(), getCategorias()])
      .then(([pil, eq, cat]) => {
        const p = pil as PilotoFromAPI
        form.reset({
          name: p.name ?? "",
          slug: p.slug ?? "",
          number: p.number ?? 0,
          birthYear: p.birthYear ?? 2000,
          city: p.city ?? "",
          teamSlug: p.teamSlug ?? "",
          categorySlug: p.categorySlug ?? "",
        })
        setEquipes((eq ?? []) as EquipeFromAPI[])
        setCategorias((cat ?? []) as CategoriaFromAPI[])
      })
      .catch(() => router.push("/admin/pilotos"))
      .finally(() => setLoading(false))
  }, [slug, form, router])

  function onSubmit(values: FormValues) {
    setSubmitError(null)
    putAdminPilotosSlug(slug, {
      name: values.name,
      slug: values.slug,
      number: values.number,
      birthYear: values.birthYear,
      city: values.city,
      teamSlug: values.teamSlug,
      categorySlug: values.categorySlug,
    } as Parameters<typeof putAdminPilotosSlug>[1])
      .then(() => router.push("/admin/pilotos"))
      .catch((err: { data?: { problems?: { field: string; message: string }[] } }) => {
        if (err.data?.problems?.length) {
          setSubmitError(err.data.problems.map((p) => `${p.field}: ${p.message}`).join(". "))
        } else {
          setSubmitError("Erro ao atualizar piloto.")
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
        <Link href="/admin/pilotos">
          <ArrowLeft className="size-4" />
          Voltar
        </Link>
      </Button>
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="font-serif text-xl font-bold uppercase text-foreground">
            Editar piloto — {slug}
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
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
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
                  name="number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numero</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="birthYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ano nascimento</FormLabel>
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
              <FormField
                control={form.control}
                name="teamSlug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Equipe</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione a equipe" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {equipes.map((eq) => (
                          <SelectItem key={eq.slug} value={eq.slug}>
                            {eq.name}
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
              {submitError && (
                <p className="text-sm text-destructive">{submitError}</p>
              )}
              <div className="flex gap-2">
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Salvando..." : "Salvar"}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/admin/pilotos">Cancelar</Link>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

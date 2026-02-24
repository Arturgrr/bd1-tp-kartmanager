"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { getCategorias } from "@/lib/api/kubb/client/getCategorias"
import { getEquipes } from "@/lib/api/kubb/client/getEquipes"
import { postAdminPilotos } from "@/lib/api/kubb/client/postAdminPilotos"
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
import type { CategoriaFromAPI, EquipeFromAPI } from "@/lib/api"

const schema = z.object({
  cpf: z.string().length(11, "CPF deve ter 11 digitos"),
  name: z.string().min(1, "Nome obrigatorio"),
  slug: z.string().min(1, "Slug obrigatorio"),
  number: z.coerce.number().int().min(0, "Numero >= 0"),
  birthYear: z.coerce.number().int().min(1900, "Ano valido"),
  city: z.string().min(1, "Cidade obrigatoria"),
  teamSlug: z.string().min(1, "Selecione a equipe"),
  categorySlug: z.string().min(1, "Selecione a categoria"),
})

type FormValues = z.infer<typeof schema>

export default function AdminPilotosNovoPage() {
  const router = useRouter()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [equipes, setEquipes] = useState<EquipeFromAPI[]>([])
  const [categorias, setCategorias] = useState<CategoriaFromAPI[]>([])

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      cpf: "",
      name: "",
      slug: "",
      number: 0,
      birthYear: new Date().getFullYear() - 15,
      city: "",
      teamSlug: "",
      categorySlug: "",
    },
  })

  useEffect(() => {
    Promise.all([getEquipes(), getCategorias()])
      .then(([eq, cat]) => {
        setEquipes((eq ?? []) as EquipeFromAPI[])
        setCategorias((cat ?? []) as CategoriaFromAPI[])
      })
      .catch(() => {})
  }, [])

  function onSubmit(values: FormValues) {
    setSubmitError(null)
    postAdminPilotos({
      cpf: values.cpf,
      name: values.name,
      slug: values.slug,
      number: values.number,
      birthYear: values.birthYear,
      city: values.city,
      teamSlug: values.teamSlug,
      categorySlug: values.categorySlug,
    } as Parameters<typeof postAdminPilotos>[0])
      .then(() => router.push("/admin/pilotos"))
      .catch((err: { data?: { problems?: { field: string; message: string }[] } }) => {
        if (err.data?.problems?.length) {
          setSubmitError(err.data.problems.map((p) => `${p.field}: ${p.message}`).join(". "))
        } else {
          setSubmitError("Erro ao criar piloto.")
        }
      })
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
            Novo piloto
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="cpf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF (11 digitos)</FormLabel>
                    <FormControl>
                      <Input {...field} maxLength={11} placeholder="00000000000" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                      <Input {...field} placeholder="ex: joao-silva" />
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
                  {form.formState.isSubmitting ? "Salvando..." : "Criar"}
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

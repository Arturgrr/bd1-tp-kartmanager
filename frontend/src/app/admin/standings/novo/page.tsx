"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { getCategorias } from "@/lib/api/kubb/client/getCategorias"
import { getEquipes } from "@/lib/api/kubb/client/getEquipes"
import { getPilotos } from "@/lib/api/kubb/client/getPilotos"
import { postAdminStandings } from "@/lib/api/kubb/client/postAdminStandings"
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
  pilotoCpf: z.string().min(1, "Selecione o piloto"),
  temporada: z.string().min(1, "Temporada obrigatoria"),
  categoriaSlug: z.string().min(1, "Selecione a categoria"),
  equipeSlug: z.string().min(1, "Selecione a equipe"),
  pontos: z.coerce.number().int().min(0, "Pontos >= 0"),
  vitorias: z.coerce.number().int().min(0, "Vitorias >= 0"),
  podios: z.coerce.number().int().min(0, "Podios >= 0"),
  melhorVolta: z.string(),
  posicao: z.coerce.number().int().min(1, "Posicao >= 1"),
})

type FormValues = z.infer<typeof schema>

export default function AdminStandingsNovoPage() {
  const router = useRouter()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [pilotos, setPilotos] = useState<PilotoFromAPI[]>([])
  const [categorias, setCategorias] = useState<CategoriaFromAPI[]>([])
  const [equipes, setEquipes] = useState<EquipeFromAPI[]>([])

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      pilotoCpf: "",
      temporada: new Date().getFullYear().toString(),
      categoriaSlug: "",
      equipeSlug: "",
      pontos: 0,
      vitorias: 0,
      podios: 0,
      melhorVolta: "",
      posicao: 1,
    },
  })

  useEffect(() => {
    Promise.all([getPilotos(), getCategorias(), getEquipes()])
      .then(([pil, cat, eq]) => {
        setPilotos((pil ?? []) as PilotoFromAPI[])
        setCategorias((cat ?? []) as CategoriaFromAPI[])
        setEquipes((eq ?? []) as EquipeFromAPI[])
      })
      .catch(() => {})
  }, [])

  function onSubmit(values: FormValues) {
    setSubmitError(null)
    postAdminStandings({
      pilotoCpf: values.pilotoCpf,
      temporada: values.temporada,
      categoriaSlug: values.categoriaSlug,
      equipeSlug: values.equipeSlug,
      pontos: values.pontos,
      vitorias: values.vitorias,
      podios: values.podios,
      melhorVolta: values.melhorVolta,
      posicao: values.posicao,
    } as Parameters<typeof postAdminStandings>[0])
      .then(() => router.push("/admin/standings"))
      .catch((err: { data?: { problems?: { field: string; message: string }[] } }) => {
        if (err.data?.problems?.length) {
          setSubmitError(err.data.problems.map((p) => `${p.field}: ${p.message}`).join(". "))
        } else {
          setSubmitError("Erro ao criar.")
        }
      })
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link href="/admin/standings">
          <ArrowLeft className="size-4" />
          Voltar
        </Link>
      </Button>
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="font-serif text-xl font-bold uppercase text-foreground">
            Novo standing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="pilotoCpf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Piloto</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione o piloto" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {pilotos.map((p) => (
                          <SelectItem key={p.cpf} value={p.cpf}>
                            {p.name} ({p.cpf})
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
                name="temporada"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Temporada</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="ex: 2025" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categoriaSlug"
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
                name="equipeSlug"
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
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="posicao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Posicao</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pontos"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pontos</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="vitorias"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vitorias</FormLabel>
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
                name="podios"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Podios</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="melhorVolta"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Melhor volta</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="ex: 1:23.456" />
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
                  {form.formState.isSubmitting ? "Salvando..." : "Criar"}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/admin/standings">Cancelar</Link>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

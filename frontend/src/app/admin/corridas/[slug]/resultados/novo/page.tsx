"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { getEquipes } from "@/lib/api/kubb/client/getEquipes"
import { getPilotos } from "@/lib/api/kubb/client/getPilotos"
import { getCorridasSlug } from "@/lib/api/kubb/client/getCorridasSlug"
import { postAdminCorridasSlugResultados } from "@/lib/api/kubb/client/postAdminCorridasSlugResultados"
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
import type { CorridaFromAPI, EquipeFromAPI, PilotoFromAPI } from "@/lib/api"

const schema = z.object({
  posicao: z.coerce.number().int().min(1, "Posicao >= 1"),
  pilotoCpf: z.string().min(1, "Selecione o piloto"),
  equipeSlug: z.string().min(1, "Selecione a equipe"),
  melhorVolta: z.string(),
  tempoTotal: z.string().min(1, "Tempo total obrigatorio"),
  pontos: z.coerce.number().int().min(0, "Pontos >= 0"),
})

type FormValues = z.infer<typeof schema>

export default function AdminCorridasSlugResultadosNovoPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const [corrida, setCorrida] = useState<CorridaFromAPI | null>(null)
  const [pilotos, setPilotos] = useState<PilotoFromAPI[]>([])
  const [equipes, setEquipes] = useState<EquipeFromAPI[]>([])
  const [submitError, setSubmitError] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      posicao: 1,
      pilotoCpf: "",
      equipeSlug: "",
      melhorVolta: "",
      tempoTotal: "",
      pontos: 0,
    },
  })

  useEffect(() => {
    getCorridasSlug(slug)
      .then((c) => setCorrida(c as CorridaFromAPI))
      .catch(() => {})
    Promise.all([getPilotos(), getEquipes()])
      .then(([pil, eq]) => {
        setPilotos((pil ?? []) as PilotoFromAPI[])
        setEquipes((eq ?? []) as EquipeFromAPI[])
      })
      .catch(() => {})
  }, [slug])

  function onSubmit(values: FormValues) {
    setSubmitError(null)
    postAdminCorridasSlugResultados(slug, {
      posicao: values.posicao,
      pilotoCpf: values.pilotoCpf,
      equipeSlug: values.equipeSlug,
      melhorVolta: values.melhorVolta,
      tempoTotal: values.tempoTotal,
      pontos: values.pontos,
    } as Parameters<typeof postAdminCorridasSlugResultados>[1])
      .then(() => router.push(`/admin/corridas/${slug}/resultados`))
      .catch((err: { data?: { problems?: { field: string; message: string }[] } }) => {
        if (err.data?.problems?.length) {
          setSubmitError(err.data.problems.map((p) => `${p.field}: ${p.message}`).join(". "))
        } else {
          setSubmitError("Erro ao criar resultado.")
        }
      })
  }

  if (!corrida) {
    return (
      <div className="mx-auto max-w-2xl">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link href={`/admin/corridas/${slug}/resultados`}>
          <ArrowLeft className="size-4" />
          Voltar
        </Link>
      </Button>
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="font-serif text-xl font-bold uppercase text-foreground">
            Novo resultado — {corrida.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              <FormField
                control={form.control}
                name="tempoTotal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tempo total</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="ex: 15:00.000" />
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
              {submitError && (
                <p className="text-sm text-destructive">{submitError}</p>
              )}
              <div className="flex gap-2">
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Salvando..." : "Criar"}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href={`/admin/corridas/${slug}/resultados`}>Cancelar</Link>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

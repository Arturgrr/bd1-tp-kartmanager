"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { postAdminEquipes } from "@/lib/api/kubb/client/postAdminEquipes"
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

const schema = z.object({
  name: z.string().min(1, "Nome obrigatorio"),
  slug: z.string().min(1, "Slug obrigatorio"),
  color: z.string().min(1, "Cor obrigatoria"),
  foundedYear: z.coerce.number().int().min(1, "Ano deve ser positivo"),
  city: z.string().min(1, "Cidade obrigatoria"),
})

type FormValues = z.infer<typeof schema>

export default function AdminEquipesNovaPage() {
  const router = useRouter()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", slug: "", color: "#000000", foundedYear: new Date().getFullYear(), city: "" },
  })

  function onSubmit(values: FormValues) {
    setSubmitError(null)
    postAdminEquipes({
      name: values.name,
      slug: values.slug,
      color: values.color,
      foundedYear: values.foundedYear,
      city: values.city,
    } as Parameters<typeof postAdminEquipes>[0])
      .then(() => router.push("/admin/equipes"))
      .catch((err: { data?: { problems?: { field: string; message: string }[] } }) => {
        if (err.data?.problems?.length) {
          setSubmitError(err.data.problems.map((p) => `${p.field}: ${p.message}`).join(". "))
        } else {
          setSubmitError("Erro ao criar equipe.")
        }
      })
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
            Nova equipe
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
                      <Input {...field} placeholder="ex: equipe-a" />
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
                        <Input className="flex-1" {...field} placeholder="#hex" />
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
                  {form.formState.isSubmitting ? "Salvando..." : "Criar"}
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

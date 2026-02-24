import Link from "next/link"
import { Flag } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                <Flag className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-serif text-lg font-bold tracking-wider text-foreground">
                UFOPKART
              </span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Organizando corridas de kart com paixao e profissionalismo.
            </p>
          </div>
          <div>
            <h4 className="mb-3 font-serif text-sm font-semibold uppercase tracking-wider text-foreground">Navegacao</h4>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              <li><Link href="/pilotos" className="transition-colors hover:text-primary">Pilotos</Link></li>
              <li><Link href="/equipes" className="transition-colors hover:text-primary">Equipes</Link></li>
              <li><Link href="/categorias" className="transition-colors hover:text-primary">Categorias</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-serif text-sm font-semibold uppercase tracking-wider text-foreground">Corridas</h4>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              <li><Link href="/calendario" className="transition-colors hover:text-primary">Calendario</Link></li>
              <li><Link href="/resultados" className="transition-colors hover:text-primary">Resultados</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-serif text-sm font-semibold uppercase tracking-wider text-foreground">Contato</h4>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              <li>contato@ufopkart.com.br</li>
              <li>Uberlandia, MG - Brasil</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          UFOPKART {new Date().getFullYear()}. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  )
}

import type { Metadata, Viewport } from "next"
import { Barlow, Barlow_Condensed } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { LayoutShell } from "@/components/layout-shell"
import "./globals.css"

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-barlow",
})

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-barlow-condensed",
})

export const metadata: Metadata = {
  title: {
    default: "UFOPKART - Organizacao de Corridas de Kart",
    template: "%s | UFOPKART",
  },
  description:
    "Acompanhe pilotos, equipes, categorias e resultados das corridas de kart organizadas pela UFOPKART.",
}

export const viewport: Viewport = {
  themeColor: "#1a1a2e",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${barlow.variable} ${barlowCondensed.variable} font-sans antialiased`}
      >
        <LayoutShell>{children}</LayoutShell>
        <Analytics />
      </body>
    </html>
  )
}

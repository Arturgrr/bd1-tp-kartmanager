"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { axiosInstance } from "@/lib/api/kubb/client"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  LayoutDashboard,
  Flag,
  Users,
  UserCircle,
  Calendar,
  Trophy,
  BarChart3,
  LogOut,
} from "lucide-react"

const adminNavItems = [
  { href: "/admin", label: "Inicio", icon: LayoutDashboard },
  { href: "/admin/categorias", label: "Categorias", icon: Flag },
  { href: "/admin/equipes", label: "Equipes", icon: Users },
  { href: "/admin/pilotos", label: "Pilotos", icon: UserCircle },
  { href: "/admin/corridas", label: "Corridas", icon: Calendar },
  { href: "/admin/standings", label: "Standings", icon: BarChart3 },
]

export function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [authChecked, setAuthChecked] = useState(false)
  const [authorized, setAuthorized] = useState(false)

  const isLoginPage = pathname === "/admin/login"

  useEffect(() => {
    if (isLoginPage) {
      setAuthChecked(true)
      setAuthorized(false)
      return
    }
    let cancelled = false
    axiosInstance
      .get("/admin/categorias")
      .then(() => {
        if (!cancelled) {
          setAuthorized(true)
          setAuthChecked(true)
        }
      })
      .catch((err: { response?: { status?: number } }) => {
        if (!cancelled && err.response?.status === 401) {
          router.replace("/admin/login")
        }
        if (!cancelled) setAuthChecked(true)
      })
    return () => {
      cancelled = true
    }
  }, [isLoginPage, router])

  if (isLoginPage) {
    return <>{children}</>
  }

  if (!authChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    )
  }

  if (!authorized) {
    return null
  }

  return (
    <SidebarProvider>
      <Sidebar variant="inset" collapsible="icon">
        <SidebarHeader className="border-b border-sidebar-border">
          <div className="flex items-center gap-2 px-2 py-2">
            <SidebarTrigger className="size-7" />
            <span className="font-serif text-lg font-bold tracking-wider text-sidebar-foreground group-data-[collapsible=icon]:hidden">
              Admin
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
              Menu
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminNavItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={pathname === item.href}>
                      <Link href={item.href}>
                        <item.icon className="size-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="border-t border-sidebar-border">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/admin/login">
                  <LogOut className="size-4" />
                  <span>Sair</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b border-border bg-background px-4">
          <SidebarTrigger className="md:hidden" />
          <div className="flex flex-1 items-center justify-end">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/login" className="flex items-center gap-2">
                <LogOut className="size-4" />
                Sair
              </Link>
            </Button>
          </div>
        </header>
        <div className="flex-1 p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}

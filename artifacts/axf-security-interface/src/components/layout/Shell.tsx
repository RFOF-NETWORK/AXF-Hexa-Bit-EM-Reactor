import { useGetMe, getGetMeQueryKey, useLogout } from "@workspace/api-client-react"
import { useQueryClient } from "@tanstack/react-query"
import { Link, useLocation } from "wouter"
import { Button } from "@/components/ui/core"
import { Settings, LogOut, Terminal, Activity } from "lucide-react"

export function Shell({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading, isError } = useGetMe({ query: { retry: false, queryKey: getGetMeQueryKey() } })
  const [, setLocation] = useLocation()
  const logout = useLogout()
  const queryClient = useQueryClient()

  if (isLoading) return <div className="min-h-screen bg-background text-foreground flex items-center justify-center font-mono uppercase text-sm animate-pulse">Initializing Interface...</div>
  if (isError || !user) {
    setLocation("/login")
    return null
  }

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <aside className="w-full md:w-64 border-r border-b md:border-b-0 border-border bg-card flex flex-col z-10 shadow-xl md:shadow-none">
        <div className="p-6 border-b border-border flex items-center gap-3">
          <Terminal className="w-8 h-8 text-primary" />
          <div className="font-bold text-xl tracking-tight uppercase leading-none">
            AXF<br/><span className="text-muted-foreground text-xs font-mono">Interface</span>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-3 text-sm font-mono font-bold uppercase hover:bg-secondary hover:text-secondary-foreground transition-colors group">
            <Activity className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            Dashboard
          </Link>
          <Link href="/settings" className="flex items-center gap-3 px-3 py-3 text-sm font-mono font-bold uppercase hover:bg-secondary hover:text-secondary-foreground transition-colors group">
            <Settings className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            Settings
          </Link>
        </nav>
        <div className="p-4 border-t border-border bg-secondary/30">
          <div className="mb-4">
            <div className="text-xs text-muted-foreground font-mono uppercase mb-1">Operator</div>
            <div className="font-mono font-bold text-sm truncate">{user.username}</div>
          </div>
          <Button 
            variant="outline" 
            className="w-full justify-start gap-2"
            onClick={() => logout.mutate(undefined, { 
              onSuccess: () => {
                queryClient.clear()
                setLocation("/login")
              } 
            })}
            disabled={logout.isPending}
          >
            <LogOut className="w-4 h-4" />
            End Session
          </Button>
        </div>
      </aside>
      
      <main className="flex-1 flex flex-col h-[100dvh] overflow-hidden relative">
        <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>
        <div className="flex-1 overflow-auto p-4 md:p-8 relative z-10">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}

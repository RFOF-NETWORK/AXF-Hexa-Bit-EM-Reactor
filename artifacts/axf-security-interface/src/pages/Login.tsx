import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useLogin, getGetMeQueryKey } from "@workspace/api-client-react"
import { useLocation } from "wouter"
import { Button, Input, Card, Label } from "@/components/ui/core"
import { Terminal, Lock } from "lucide-react"
import { toast } from "sonner"

export function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [, setLocation] = useLocation()
  
  const queryClient = useQueryClient()
  const login = useLogin()

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login.mutate(
      { data: { username, password } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() })
          toast.success("Authentication successful")
          setLocation("/dashboard")
        },
        onError: () => {
          toast.error("Authentication failed. Invalid credentials.")
        }
      }
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      <Card className="w-full max-w-md p-8 relative z-10 border-2 shadow-2xl">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-primary flex items-center justify-center text-primary-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]">
            <Terminal className="w-8 h-8" />
          </div>
        </div>
        <div className="text-center mb-8 space-y-2">
          <h1 className="text-3xl font-bold uppercase tracking-tight">AXF Interface</h1>
          <p className="text-sm font-mono text-muted-foreground uppercase">Restricted Access // RFOF-NETWORK</p>
        </div>
        
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <Label htmlFor="username">Operator ID</Label>
            <Input 
              id="username" 
              autoComplete="off"
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              className="font-mono text-base"
            />
          </div>
          <div>
            <Label htmlFor="password">Passphrase</Label>
            <Input 
              id="password" 
              type="password" 
              autoComplete="off"
              value={password} 
              onChange={e => setPassword(e.target.value)}
              className="font-mono text-base"
            />
          </div>
          <Button type="submit" className="w-full gap-2 text-base h-12 mt-4" disabled={login.isPending || !username || !password}>
            {login.isPending ? (
              <span className="animate-pulse">Authenticating...</span>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Initialize Session
              </>
            )}
          </Button>
        </form>
      </Card>
    </div>
  )
}

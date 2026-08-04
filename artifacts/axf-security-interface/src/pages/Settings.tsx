import { useState } from "react"
import { useChangePassword, useDeleteAccount } from "@workspace/api-client-react"
import { useQueryClient } from "@tanstack/react-query"
import { useLocation } from "wouter"
import { Card, Button, Input, Label } from "@/components/ui/core"
import { Settings as SettingsIcon, AlertTriangle, Key } from "lucide-react"
import { toast } from "sonner"

export function Settings() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [, setLocation] = useLocation()
  const queryClient = useQueryClient()

  const changePassword = useChangePassword()
  const deleteAccount = useDeleteAccount()

  const onPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.")
      return
    }
    changePassword.mutate(
      { data: { currentPassword, newPassword } },
      {
        onSuccess: () => {
          toast.success("Passphrase updated successfully.")
          setCurrentPassword("")
          setNewPassword("")
          setConfirmPassword("")
        },
        onError: () => {
          toast.error("Failed to update passphrase. Verify current passphrase.")
        }
      }
    )
  }

  const onDeleteAccount = () => {
    if (window.confirm("CRITICAL WARNING: This will permanently purge the operator account and all associated configuration. Proceed?")) {
      deleteAccount.mutate(undefined, {
        onSuccess: () => {
          queryClient.clear()
          toast.success("Account purged.")
          setLocation("/login")
        },
        onError: () => {
          toast.error("Failed to purge account.")
        }
      })
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-3xl pb-16">
      <div className="border-b-2 border-primary pb-4">
        <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tight flex items-center gap-3">
          <SettingsIcon className="w-8 h-8 text-primary" />
          Operator Settings
        </h1>
        <div className="text-sm font-mono text-muted-foreground mt-2 uppercase">
          Configuration & Access Control
        </div>
      </div>

      <Card className="p-6 md:p-8 border-t-4 border-t-primary">
        <h2 className="text-xl font-bold uppercase tracking-tight mb-8 flex items-center gap-2">
          <Key className="w-5 h-5 text-primary" />
          Update Passphrase
        </h2>
        <form onSubmit={onPasswordSubmit} className="space-y-6 max-w-md">
          <div>
            <Label htmlFor="current">Current Passphrase</Label>
            <Input 
              id="current" 
              type="password" 
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="new">New Passphrase</Label>
            <Input 
              id="new" 
              type="password" 
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="confirm">Confirm Passphrase</Label>
            <Input 
              id="confirm" 
              type="password" 
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="mt-2" disabled={changePassword.isPending || !currentPassword || !newPassword || !confirmPassword}>
            {changePassword.isPending ? "Executing..." : "Commit Update"}
          </Button>
        </form>
      </Card>

      <Card className="p-6 md:p-8 border-t-4 border-t-destructive bg-destructive/5 border-x-destructive/20 border-b-destructive/20">
        <h2 className="text-xl font-bold text-destructive uppercase tracking-tight mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Danger Zone
        </h2>
        <p className="text-sm font-mono text-muted-foreground mb-8 uppercase leading-relaxed max-w-2xl border-l-2 border-destructive/50 pl-4">
          Warning: Purging the account is irreversible. All access and active monitoring configurations will be destroyed immediately.
        </p>
        <Button variant="destructive" onClick={onDeleteAccount} disabled={deleteAccount.isPending} className="shadow-[4px_4px_0px_0px_rgba(255,0,0,0.2)]">
          {deleteAccount.isPending ? "Purging..." : "Purge Account"}
        </Button>
      </Card>

    </div>
  )
}

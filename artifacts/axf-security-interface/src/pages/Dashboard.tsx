import { 
  useGetScanSummary, getGetScanSummaryQueryKey,
  useGetRepos, getGetReposQueryKey,
  useGetAlerts, getGetAlertsQueryKey,
  useGetSessionReports, getGetSessionReportsQueryKey
} from "@workspace/api-client-react"
import { Card, Badge } from "@/components/ui/core"
import { 
  ShieldAlert, Activity, Server, Radio, 
  AlertTriangle, FileTerminal, Clock 
} from "lucide-react"

function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-12 w-64 bg-muted"></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <Card key={i} className="h-24 bg-muted" />)}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <Card className="h-64 bg-muted" />
          <Card className="h-64 bg-muted" />
        </div>
        <Card className="h-[32rem] bg-muted" />
      </div>
    </div>
  )
}

export function Dashboard() {
  const { data: summary, isLoading: summaryLoading } = useGetScanSummary({ query: { queryKey: getGetScanSummaryQueryKey() } })
  const { data: repos, isLoading: reposLoading } = useGetRepos({ query: { queryKey: getGetReposQueryKey() } })
  const { data: alerts, isLoading: alertsLoading } = useGetAlerts({ query: { queryKey: getGetAlertsQueryKey() } })
  const { data: sessions, isLoading: sessionsLoading } = useGetSessionReports({ query: { queryKey: getGetSessionReportsQueryKey() } })

  if (summaryLoading || reposLoading || alertsLoading || sessionsLoading) return <DashboardSkeleton />

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-16">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-2 border-primary pb-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tight flex items-center gap-3">
            <Activity className="w-8 h-8 text-accent" />
            System Overview
          </h1>
          <div className="text-sm font-mono text-muted-foreground mt-2 uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_8px_currentColor]"></span>
            Live Feed Active // RFOF-NETWORK
          </div>
        </div>
        <div className="text-right text-sm font-mono uppercase bg-secondary px-4 py-2 border border-border">
          <div className="text-muted-foreground text-xs mb-1">Last Diagnostic</div>
          <div className="font-bold">{summary?.lastScan ? new Date(summary.lastScan).toLocaleString() : 'N/A'}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border-l-4 border-l-primary flex flex-col justify-between hover:bg-secondary/50 transition-colors">
          <div className="text-muted-foreground font-mono text-xs uppercase mb-3 flex items-center gap-2">
            <Server className="w-4 h-4" /> Targets
          </div>
          <div className="text-4xl font-bold">{summary?.totalRepos || 0}</div>
        </Card>
        <Card className="p-5 border-l-4 border-l-destructive flex flex-col justify-between hover:bg-secondary/50 transition-colors">
          <div className="text-muted-foreground font-mono text-xs uppercase mb-3 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" /> Critical
          </div>
          <div className="text-4xl font-bold text-destructive">{summary?.criticalCount || 0}</div>
        </Card>
        <Card className="p-5 border-l-4 border-l-[#eab308] flex flex-col justify-between hover:bg-secondary/50 transition-colors">
          <div className="text-muted-foreground font-mono text-xs uppercase mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> High
          </div>
          <div className="text-4xl font-bold text-[#eab308]">{summary?.highCount || 0}</div>
        </Card>
        <Card className="p-5 border-l-4 border-l-accent flex flex-col justify-between hover:bg-secondary/50 transition-colors">
          <div className="text-muted-foreground font-mono text-xs uppercase mb-3 flex items-center gap-2">
            <Radio className="w-4 h-4" /> Low / Med
          </div>
          <div className="text-4xl font-bold text-accent">{(summary?.lowCount || 0) + (summary?.mediumCount || 0)}</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-8">
          
          <section>
            <h2 className="text-xl font-bold uppercase tracking-tight border-b border-border pb-2 mb-4 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-destructive" />
              Active Threats
            </h2>
            <div className="space-y-3">
              {alerts?.length === 0 && (
                <div className="p-8 border border-dashed border-border text-center text-muted-foreground font-mono text-sm uppercase bg-card">
                  No active threats detected. Network secure.
                </div>
              )}
              {alerts?.map(alert => (
                <Card key={alert.id} className="p-4 flex flex-col md:flex-row gap-4 items-start md:items-center group hover:border-primary transition-colors">
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={
                        alert.severity === 'CRITICAL' ? 'destructive' :
                        alert.severity === 'HIGH' ? 'warning' : 'secondary'
                      }>{alert.severity}</Badge>
                      <span className="font-mono text-sm font-bold bg-muted px-2 py-0.5">{alert.repoName}</span>
                      {alert.cve && <Badge variant="outline" className="border-muted-foreground text-muted-foreground">{alert.cve}</Badge>}
                    </div>
                    <div className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">{alert.title}</div>
                    <div className="text-sm text-muted-foreground max-w-2xl">{alert.description}</div>
                  </div>
                  <div className="text-xs font-mono text-muted-foreground flex items-center gap-1 bg-secondary px-2 py-1 border border-border whitespace-nowrap">
                    <Clock className="w-3 h-3" />
                    {new Date(alert.createdAt).toLocaleDateString()}
                  </div>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold uppercase tracking-tight border-b border-border pb-2 mb-4 flex items-center gap-2">
              <Server className="w-5 h-5 text-primary" />
              Target Network Status
            </h2>
            <div className="border border-border bg-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm font-mono whitespace-nowrap">
                  <thead className="bg-secondary text-secondary-foreground border-b border-border uppercase text-xs">
                    <tr>
                      <th className="p-3 font-bold">Target / Repository</th>
                      <th className="p-3 font-bold">Status</th>
                      <th className="p-3 font-bold">Alerts</th>
                      <th className="p-3 font-bold">Last Scanned</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {repos?.map(repo => (
                      <tr key={repo.id} className="hover:bg-muted/50 transition-colors">
                        <td className="p-3 font-bold text-primary">{repo.name}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-none ${repo.status === 'SECURE' ? 'bg-accent' : 'bg-destructive'}`} />
                            {repo.status}
                          </div>
                        </td>
                        <td className="p-3">
                          {repo.alertCount > 0 ? (
                            <span className="text-destructive font-bold inline-flex items-center gap-1">
                              {repo.alertCount} <AlertTriangle className="w-3 h-3" />
                            </span>
                          ) : (
                            <span className="text-muted-foreground">0</span>
                          )}
                        </td>
                        <td className="p-3 text-muted-foreground">{new Date(repo.lastChecked).toLocaleString()}</td>
                      </tr>
                    ))}
                    {repos?.length === 0 && (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-muted-foreground uppercase">
                          No targets configured.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-bold uppercase tracking-tight border-b border-border pb-2 mb-4 flex items-center gap-2">
              <FileTerminal className="w-5 h-5 text-primary" />
              Session Logs
            </h2>
            <div className="space-y-3">
              {sessions?.map((session, idx) => (
                <Card key={idx} className="p-4 hover:border-primary transition-colors cursor-pointer group bg-card">
                  <div className="flex justify-between items-start mb-3">
                    <Badge variant="outline" className="border-primary text-primary">{session.version}</Badge>
                    <span className="text-xs font-mono text-muted-foreground">{new Date(session.date).toLocaleDateString()}</span>
                  </div>
                  <div className="font-bold group-hover:text-primary transition-colors text-lg leading-tight">{session.title}</div>
                  <div className="text-xs font-mono text-muted-foreground mt-3 pt-3 border-t border-border truncate">
                    <span className="text-primary mr-2">❯</span>
                    {session.path}
                  </div>
                </Card>
              ))}
              {sessions?.length === 0 && (
                <div className="p-4 border border-dashed border-border text-center text-muted-foreground font-mono text-sm uppercase bg-card">
                  No session logs available.
                </div>
              )}
            </div>
          </section>
        </div>

      </div>
    </div>
  )
}

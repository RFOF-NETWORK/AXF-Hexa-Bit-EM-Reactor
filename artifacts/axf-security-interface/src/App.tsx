import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch, Router as WouterRouter, Redirect } from 'wouter';
import { Toaster } from 'sonner';

import { Login } from '@/pages/Login';
import { Dashboard } from '@/pages/Dashboard';
import { Settings } from '@/pages/Settings';
import { Shell } from '@/components/layout/Shell';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function NotFound() {
  return (
    <div className="min-h-[50vh] w-full flex items-center justify-center font-mono uppercase">
      <div className="text-center space-y-4 border border-destructive p-12 bg-destructive/5">
        <h1 className="text-4xl font-bold text-destructive flex items-center gap-4 justify-center">
          <span className="animate-pulse">⚠️</span>
          404 // NOT FOUND
          <span className="animate-pulse">⚠️</span>
        </h1>
        <p className="text-muted-foreground">The requested sector does not exist or access is denied.</p>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route>
        <Shell>
          <Switch>
            <Route path="/" component={() => <Redirect href="/dashboard" />} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/settings" component={Settings} />
            <Route component={NotFound} />
          </Switch>
        </Shell>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL?.replace(/\/$/, '') || ''}>
        <Router />
      </WouterRouter>
      <Toaster 
        theme="dark" 
        position="bottom-right" 
        richColors 
        toastOptions={{
          style: {
            borderRadius: '0px',
            fontFamily: '"Space Mono", monospace',
            textTransform: 'uppercase',
            border: '1px solid var(--border)',
          }
        }}
      />
    </QueryClientProvider>
  );
}

export default App;

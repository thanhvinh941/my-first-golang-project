import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom';
import './index.css'
import { router } from './router.tsx';
import { useLoadingStore } from './store/useLoadingStore.tsx';
import { Loader2 } from 'lucide-react';
import AppBootstrap from './app-bootstrap.tsx';

function AppLoading() {
  const appLoading = useLoadingStore((s) => s.appLoading);
  if (!appLoading) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-background">
      <Loader2 className="h-10 w-10 animate-spin" />
    </div>
  );
}


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppLoading />
    <AppBootstrap>
      <RouterProvider router={router} />
    </AppBootstrap>
  </StrictMode>,
)

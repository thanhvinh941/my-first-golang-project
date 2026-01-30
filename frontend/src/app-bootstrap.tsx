import { useEffect } from "react";
import { useLoadingStore } from "./store/useLoadingStore";

export default function AppBootstrap({ children }: { children: React.ReactNode }) {
  const setAppLoading = useLoadingStore((s) => s.setAppLoading);

  useEffect(() => {
    async function initApp() {
      // ví dụ: check auth, load config, theme...
      await new Promise((r) => setTimeout(r, 1500)); // fake init
      setAppLoading(false);
    }

    initApp();
  }, []);

  return <>{children}</>;
}

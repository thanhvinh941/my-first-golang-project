import { useLoadingStore } from "@/store/useLoadingStore";
import { Loader2 } from "lucide-react";

export default function PageLoading() {
  const pageLoading = useLoadingStore((s) => s.pageLoading);
  if (!pageLoading) return null;

  return (
    <div className="absolute inset-0 z-40 bg-background/60 flex items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin" />
    </div>
  );
}

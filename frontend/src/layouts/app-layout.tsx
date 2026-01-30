
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import PageLoadingListener from "./page-loading-listener";
import PageLoading from "./page-loading";

export default function AppLayout() {
  return (
    <SidebarProvider defaultOpen>
      <PageLoadingListener />

      <div className="p-2 w-full">
        <div className="flex gap-2">
          <AppSidebar />

          <main className="relative flex-1 w-full">
            <SidebarTrigger />

            {/* PAGE LOADING BỌC MAIN */}
            <PageLoading />

            <section className="p-4 w-full">
              <Outlet />
            </section>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}


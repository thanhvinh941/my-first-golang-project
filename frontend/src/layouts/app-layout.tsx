
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

export default function AppLayout() {

  return (
    
    <SidebarProvider defaultOpen={true}>
      <div className="p-2 w-full">
        <div className="flex gap-2">
          <AppSidebar />
          <main className="flex-1 w-full">
            <SidebarTrigger />
            <section className="p-4 w-full">
              <Outlet />
            </section>
          </main>
        </div>
      </div>
    </SidebarProvider>
    
  );
}

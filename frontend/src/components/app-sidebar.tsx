
// src/components/app-sidebar.tsx
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { BadgeDollarSign, BadgePercent, Home, Inbox, MonitorCogIcon, Star } from "lucide-react";
import { NavLink } from "react-router-dom"; // hoặc Link nếu không cần active state

const items = [
  { title: "Home",     to: "/",          icon: Home },
  { title: "Symbol",   to: "/symbol",    icon: Inbox },
  { title: "Favourites", to: "/favourites",  icon: Star },
  { title: "ETF",   to: "/etf",    icon: BadgeDollarSign },
  { title: "Warrant", to: "/cw",  icon: BadgePercent },
  { title: "Moniter", to: "/moniter",  icon: MonitorCogIcon },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {/* asChild để NavLink trở thành phần tử gốc */}
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        [
                          "flex items-center gap-2",
                          isActive
                            ? "text-primary"
                            : "text-muted-foreground hover:text-foreground",
                        ].join(" ")
                      }
                      end={item.to === "/"} // Home match chính xác
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

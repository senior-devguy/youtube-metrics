import { NavLink } from "react-router-dom";
import { LayoutDashboard, Youtube, ShoppingBag, Activity } from "lucide-react";

import { cn } from "@/lib/utils";
import { ModeToggle } from "./ModeToggle";

type NavItem = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
};

const navItems: NavItem[] = [
  { to: "/", label: "Overview", icon: LayoutDashboard },
  { to: "/youtube", label: "YouTube", icon: Youtube },
  { to: "/store", label: "Web Store", icon: ShoppingBag },
];

export function Sidebar() {
  return (
    <aside className="hidden md:flex h-screen w-[272px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar-background text-sidebar-foreground">
      <div className="flex h-16 items-center gap-2 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Activity className="h-5 w-5" strokeWidth={2} />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold tracking-tight">Pulse</span>
          <span className="text-xs text-sidebar-muted">Creator analytics</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto sidebar-scrollbar px-3 py-2">
        <div className="px-3 pt-3 pb-2 text-xs font-medium uppercase tracking-wider text-sidebar-muted">
          Dashboards
        </div>
        <ul className="space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 cursor-pointer",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50",
                  )
                }
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-sidebar-border p-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="h-8 w-8 shrink-0 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground">
            AB
          </div>
          <div className="min-w-0 leading-tight">
            <div className="text-sm font-medium truncate">Arnold Bekker</div>
            <div className="text-xs text-sidebar-muted truncate">Owner</div>
          </div>
        </div>
        <ModeToggle />
      </div>
    </aside>
  );
}

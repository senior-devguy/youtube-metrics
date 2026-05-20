import { Outlet } from "react-router-dom";

import { Sidebar } from "./Sidebar";

export function AppShell() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 h-screen overflow-auto">
        <div className="mx-auto max-w-[1600px] w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

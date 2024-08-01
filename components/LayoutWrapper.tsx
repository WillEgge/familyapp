"use client";

import { useState } from "react";
import { SideNav } from "@/components/SideNav";
import { SideNavToggle } from "@/components/SideNavToggle";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className={`flex ${isSidebarOpen ? "sidebar-open" : ""}`}>
      <SideNavToggle isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <SideNav isOpen={isSidebarOpen} closeSidebar={closeSidebar} />
      <div className="flex-1 layout-content">
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}

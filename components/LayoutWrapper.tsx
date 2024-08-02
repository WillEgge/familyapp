"use client";

import { useState, useEffect } from "react";
import { SideNav } from "@/components/SideNav";
import { SideNavToggle } from "@/components/SideNavToggle";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  useEffect(() => {
    document.body.classList.toggle("overlay-active", isSidebarOpen);
    return () => {
      document.body.classList.remove("overlay-active");
    };
  }, [isSidebarOpen]);

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

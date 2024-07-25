"use client";

import { SideNav } from "@/components/SideNav";
import { SideNavToggle } from "@/components/SideNavToggle";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <SideNavToggle />
      <SideNav />
      <div className="flex-1 layout-content">
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}

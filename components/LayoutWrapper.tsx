"use client";

import { SideNav } from "@/components/SideNav";
import { SideNavToggle } from "@/components/SideNavToggle";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <SideNav />
      <div className="flex-1">
        <header className="p-4 flex items-center justify-between">
          <SideNavToggle />
          {/* Add other header content here */}
        </header>
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export function SideNavToggle() {
  const toggleSidebar = () => {
    document.body.classList.toggle('sidebar-open');
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleSidebar}
      aria-label="Toggle side navigation"
      className="fixed top-4 left-4 z-50"
    >
      <Menu className="h-6 w-6 sidebar-closed-icon" />
      <X className="h-6 w-6 sidebar-open-icon hidden" />
    </Button>
  );
}
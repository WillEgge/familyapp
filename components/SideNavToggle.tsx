"use client";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export function SideNavToggle() {
  const toggleSidebar = () => {
    document.body.classList.toggle("sidebar-open");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleSidebar}
      aria-label="Toggle side navigation"
    >
      <Menu className="h-6 w-6" />
    </Button>
  );
}

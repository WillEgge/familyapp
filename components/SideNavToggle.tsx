"use client";

import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

interface SideNavToggleProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export function SideNavToggle({ isOpen, toggleSidebar }: SideNavToggleProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleSidebar}
      aria-label="Toggle side navigation"
      className="fixed top-4 left-4 z-50"
    >
      {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
    </Button>
  );
}

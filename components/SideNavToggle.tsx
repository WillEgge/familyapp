"use client";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface SideNavToggleProps {
  onToggle: () => void;
}

export function SideNavToggle({ onToggle }: SideNavToggleProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="lg:hidden"
      onClick={onToggle}
      aria-label="Toggle side navigation"
    >
      <Menu className="h-6 w-6" />
    </Button>
  );
}

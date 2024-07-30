"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { signOut } from "@/app/signin/actions";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/utils/supabase/client";

export function SideNav() {
  const pathname = usePathname();
  const supabase = createClient();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/tasks", label: "Tasks" },
    { href: "/calendar", label: "Calendar" },
  ];

  const handleSignOut = async () => {
    await signOut();
    window.location.reload();
  };

  return (
    <nav className="fixed left-0 top-0 z-40 h-screen w-64 bg-gray-100 p-4 transition-transform duration-300 ease-in-out transform -translate-x-full sidebar-nav">
      <div className="mt-14">
        {" "}
        {/* Add top margin to account for the toggle button */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage src="/path-to-avatar-image.jpg" alt="User" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Link href="/profile" className="w-full">
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Button
                variant="ghost"
                className="w-full justify-start p-0"
                onClick={handleSignOut}
              >
                Log out
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <ul className="space-y-2">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={cn(
                "block p-2 rounded-md hover:bg-gray-200",
                pathname === item.href && "bg-indigo-100 text-indigo-600"
              )}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

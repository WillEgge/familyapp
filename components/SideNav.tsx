"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { signOut } from "@/app/(public)/signin/actions";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/utils/supabase/client";
import { X } from "lucide-react";
import Overlay from "./Overlay";
import { useEffect, useState } from "react";

interface SideNavProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

interface AvatarData {
  initials: string;
  backgroundColor: string;
}

export function SideNav({ isOpen, closeSidebar }: SideNavProps) {
  const pathname = usePathname();
  const supabase = createClient();
  const [avatarData, setAvatarData] = useState<AvatarData | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [isPrimaryMember, setIsPrimaryMember] = useState<boolean>(false);

  const navItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/tasks", label: "Tasks" },
    { href: "/calendar", label: "Calendar" },
  ];

  const handleSignOut = async () => {
    await signOut();
    window.location.reload();
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: memberData } = await supabase
          .from("member")
          .select("first_name, last_name, is_primary")
          .eq("email", user.email)
          .single();

        if (memberData) {
          setUserName(`${memberData.first_name} ${memberData.last_name}`);
          setIsPrimaryMember(memberData.is_primary);
          const response = await fetch(
            `/api/avatar?firstName=${memberData.first_name}&lastName=${memberData.last_name}&email=${user.email}`
          );
          const avatarData: AvatarData = await response.json();
          setAvatarData(avatarData);
        }
      }
    };

    fetchUserData();
  }, []);

  return (
    <>
      <nav
        className={`fixed left-0 top-0 z-50 h-screen w-64 bg-gray-100 p-4 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-0">
                  <Avatar className="h-8 w-8">
                    {avatarData && (
                      <AvatarFallback
                        style={{ backgroundColor: avatarData.backgroundColor }}
                      >
                        {avatarData.initials}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link
                    href="/profile"
                    className="w-full"
                    onClick={closeSidebar}
                  >
                    Profile
                  </Link>
                </DropdownMenuItem>
                {isPrimaryMember && (
                  <DropdownMenuItem asChild>
                    <Link
                      href="/add-member"
                      className="w-full"
                      onClick={closeSidebar}
                    >
                      Add Member
                    </Link>
                  </DropdownMenuItem>
                )}
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
            {userName && (
              <span className="ml-2 text-sm font-medium text-gray-600">
                {userName}
              </span>
            )}
          </div>
          <button
            onClick={closeSidebar}
            className="text-gray-600 hover:text-indigo-600"
          >
            <X size={20} />
          </button>
        </div>
        <ul className="space-y-2 mt-4">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "block p-2 rounded-md hover:bg-gray-200",
                  pathname === item.href && "bg-indigo-100 text-indigo-600"
                )}
                onClick={closeSidebar}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <Overlay isVisible={isOpen} onClick={closeSidebar} />
    </>
  );
}
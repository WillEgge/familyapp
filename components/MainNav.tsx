"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

interface MainNavProps {
  isLoggedIn: boolean;
}

export function MainNav({ isLoggedIn }: MainNavProps) {
  const pathname = usePathname()

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink className={cn(
              navigationMenuTriggerStyle(),
              pathname === "/" && "text-indigo-600"
            )}>
              Home
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        {isLoggedIn && (
          <NavigationMenuItem>
            <NavigationMenuTrigger className={cn(
              (pathname === "/tasks" || pathname === "/calendar" || pathname === "/messaging") && "text-indigo-600"
            )}>Features</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <a
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                      href="/"
                    >
                      <div className="mb-2 mt-4 text-lg font-medium">
                        FamilyHub
                      </div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        Manage your family tasks and activities all in one place.
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
                <ListItem href="/tasks" title="Tasks" active={pathname === "/tasks"}>
                  Organize and track family tasks
                </ListItem>
                <ListItem href="/calendar" title="Calendar" active={pathname === "/calendar"}>
                  Plan and view family events
                </ListItem>
                <ListItem href="/messaging" title="Messaging" active={pathname === "/messaging"}>
                  Communicate with family members
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        )}
        <NavigationMenuItem>
          <Link href="/about" legacyBehavior passHref>
            <NavigationMenuLink className={cn(
              navigationMenuTriggerStyle(),
              pathname === "/about" && "text-indigo-600"
            )}>
              About
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { active?: boolean }
>(({ className, title, children, active, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            active && "text-indigo-600",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
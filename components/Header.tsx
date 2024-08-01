"use client";

import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Menu } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-6 flex items-center justify-between">
        <Link href="/">
          <span className="text-3xl font-bold text-indigo-600">FamilyHub</span>
        </Link>
        <nav className="hidden md:block">
          <DesktopMenu />
        </nav>
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-600 hover:text-indigo-600"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>
      {isOpen && <MobileMenu />}
    </header>
  );
}

function DesktopMenu() {
  return (
    <ul className="flex items-center space-x-8">
      <li>
        <Link href="/about" className="text-gray-600 hover:text-indigo-600">
          About
        </Link>
      </li>
      <li>
        <Link href="/faq" className="text-gray-600 hover:text-indigo-600">
          FAQ
        </Link>
      </li>
      <Separator orientation="vertical" className="h-6 mx-4" />
      <li>
        <Link
          href="/signin"
          className="text-indigo-600 hover:text-indigo-800 font-semibold"
        >
          Sign In
        </Link>
      </li>
      <li>
        <Link
          href="/signup"
          className="bg-indigo-600 text-white hover:bg-indigo-700 py-2 px-4 rounded-md font-semibold"
        >
          Sign Up
        </Link>
      </li>
    </ul>
  );
}

function MobileMenu() {
  return (
    <div className="md:hidden bg-white shadow-md p-4">
      <ul className="space-y-4">
        <li>
          <Link href="/about" className="text-gray-600 hover:text-indigo-600">
            About
          </Link>
        </li>
        <li>
          <Link href="/faq" className="text-gray-600 hover:text-indigo-600">
            FAQ
          </Link>
        </li>
        <Separator className="my-4" />
        <li>
          <Link
            href="/signin"
            className="text-indigo-600 hover:text-indigo-800 font-semibold"
          >
            Sign In
          </Link>
        </li>
        <li>
          <Link
            href="/signup"
            className="bg-indigo-600 text-white hover:bg-indigo-700 py-2 px-4 rounded-md font-semibold inline-block"
          >
            Sign Up
          </Link>
        </li>
      </ul>
    </div>
  );
}

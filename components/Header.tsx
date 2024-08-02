"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import dynamic from 'next/dynamic';

const Separator = dynamic(() => import("@/components/ui/separator").then(mod => mod.Separator), {
  ssr: false
});

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-6 flex items-center justify-between">
        <Link href="/" onClick={closeMenu}>
          <span className="text-3xl font-bold text-indigo-600">FamilyHub</span>
        </Link>
        <nav className="hidden md:block">
          <DesktopMenu closeMenu={closeMenu} />
        </nav>
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-gray-600 hover:text-indigo-600"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>
      {isOpen && <MobileMenu closeMenu={closeMenu} />}
    </header>
  );
}

interface MenuProps {
  closeMenu: () => void;
}

const DesktopMenu = ({ closeMenu }: MenuProps) => (
  <ul className="flex items-center space-x-8">
    <MenuItems closeMenu={closeMenu} />
  </ul>
);

const MobileMenu = ({ closeMenu }: MenuProps) => (
  <div className="md:hidden bg-white shadow-md p-4">
    <ul className="space-y-4">
      <MenuItems closeMenu={closeMenu} />
    </ul>
  </div>
);

const MenuItems = ({ closeMenu }: MenuProps) => (
  <>
    <li>
      <Link href="/about" onClick={closeMenu} className="text-gray-600 hover:text-indigo-600">
        About
      </Link>
    </li>
    <li>
      <Link href="/faq" onClick={closeMenu} className="text-gray-600 hover:text-indigo-600">
        FAQ
      </Link>
    </li>
    <li className="hidden md:block">
      <Separator orientation="vertical" className="h-6" />
    </li>
    <li>
      <Link
        href="/signin"
        onClick={closeMenu}
        className="text-indigo-600 hover:text-indigo-800 font-semibold"
      >
        Sign In
      </Link>
    </li>
    <li>
      <Link
        href="/signup"
        onClick={closeMenu}
        className="bg-indigo-600 text-white hover:bg-indigo-700 py-2 px-4 rounded-md font-semibold"
      >
        Sign Up
      </Link>
    </li>
  </>
);
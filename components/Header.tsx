import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function Header() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If user is logged in, don't render the header
  if (user) return null;

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-6 flex items-center justify-between">
        <Link href="/">
          <span className="text-3xl font-bold text-indigo-600">FamilyHub</span>
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/faq">FAQ</Link>
            </li>
            <li>
              <Link href="/signin">Sign In</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

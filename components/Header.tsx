import { signOut } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function Header() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/">
            <span className="text-3xl font-bold text-indigo-600">
              FamilyHub
            </span>
          </Link>
        </div>
        <nav className="flex items-center space-x-8">
          <Link href="/tasks">
            <span className="text-gray-600 hover:text-indigo-600">Tasks</span>
          </Link>
          <Link href="/addchild">
            <span className="text-gray-600 hover:text-indigo-600">
              Add Child
            </span>
          </Link>
          {user !== null ? (
            <form className="flex flex-col items-center" action={signOut}>
              <button className="ml-8 inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded">
                {user.email}
              </button>
              <span className="text-center mt-1 text-xs text-gray-400">
                Click to sign out
              </span>
            </form>
          ) : (
            <Link href="/login">
              <Button>Sign In</Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

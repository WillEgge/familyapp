import { signOut } from "@/app/signin/actions";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { MainNav } from "@/components/MainNav";

export default async function Header() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoggedIn = !!user;

  let isPrimaryMember = false;
  if (user) {
    const { data: memberData, error } = await supabase
      .from('member')
      .select('is_primary')
      .eq('email', user.email)
      .single();

    if (error) {
      console.error("Error fetching member data:", error);
    } else {
      isPrimaryMember = memberData.is_primary;
    }
  }

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/">
            <span className="text-3xl font-bold text-indigo-600">
              FamilyHub
            </span>
          </Link>
          <MainNav isLoggedIn={isLoggedIn} isPrimaryMember={isPrimaryMember} />
        </div>
        <div>
          {isLoggedIn ? (
            <form className="flex flex-col items-center" action={signOut}>
              <Button>{user.email}</Button>
              <span className="text-center mt-1 text-xs text-gray-400">
                Click to sign out
              </span>
            </form>
          ) : (
            <Link href="/signin">
              <Button>Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

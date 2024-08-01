import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import ClientSideHeader from "./ClientSideHeader";

export default async function Header() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If user is logged in, don't render the header
  if (user) return null;

  return <ClientSideHeader />;
}

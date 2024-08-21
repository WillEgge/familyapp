import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { createClient } from "@/utils/supabase/server";
import { Toaster } from "@/components/ui/sonner";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en" className={GeistSans.className}>
      <body className="bg-background text-foreground">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import Header from "@/components/Header";
import { LayoutWrapper } from "@/components/LayoutWrapper";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import { createClient } from "@/utils/supabase/server";

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
        {user ? (
          <LayoutWrapper>{children}</LayoutWrapper>
        ) : (
          <>
            <Header />
            <main className="p-4">{children}</main>
          </>
        )}
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}

import { LayoutWrapper } from "@/components/LayoutWrapper";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LayoutWrapper>{children}</LayoutWrapper>;
}
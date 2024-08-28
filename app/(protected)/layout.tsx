"use client";

import { LayoutWrapper } from "@/components/LayoutWrapper";
import VersionInfo from "@/components/VersionInfo";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LayoutWrapper>{children}</LayoutWrapper>
      <VersionInfo />
    </>
  );
}
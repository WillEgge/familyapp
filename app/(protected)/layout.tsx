"use client";

import { useEffect, useState } from "react";
import VersionInfo from "@/components/VersionInfo";
import { LayoutWrapper } from "@/components/LayoutWrapper";

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
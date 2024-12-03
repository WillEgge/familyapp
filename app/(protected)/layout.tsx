"use client";

import { useEffect, useState } from "react";
import VersionInfo from "@/components/VersionInfo";
import { LayoutWrapper } from "@/components/LayoutWrapper";
import { BoardProvider } from "@/utils/BoardProvider";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BoardProvider>
      <LayoutWrapper>{children}</LayoutWrapper>
      <VersionInfo />
    </BoardProvider>
  );
}
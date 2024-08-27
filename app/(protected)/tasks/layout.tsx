"use client";

import { LayoutWrapper } from "@/components/LayoutWrapper";

export default function TasksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LayoutWrapper>{children}</LayoutWrapper>;
}
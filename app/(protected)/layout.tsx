"use client";

import { DndProvider } from "react-dnd";
import { TouchBackend } from "react-dnd-touch-backend";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useEffect, useState } from "react";
import VersionInfo from "@/components/VersionInfo";
import { LayoutWrapper } from "@/components/LayoutWrapper";

const touchBackendOptions = {
  enableMouseEvents: true,
  delayTouchStart: 100,
};

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  return (
    <DndProvider
      backend={isTouchDevice ? TouchBackend : HTML5Backend}
      options={isTouchDevice ? touchBackendOptions : undefined}
    >
      <LayoutWrapper>{children}</LayoutWrapper>
      <VersionInfo />
    </DndProvider>
  );
}
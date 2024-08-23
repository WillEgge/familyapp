"use client";

import { DndProvider } from "react-dnd";
import { TouchBackend } from "react-dnd-touch-backend";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useEffect, useState } from "react";
import VersionInfo from "@/components/VersionInfo";

const touchBackendOptions = {
  enableMouseEvents: true,
  delayTouchStart: 100, // in milliseconds
};

export default function TasksLayout({
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
      {children}
      <VersionInfo />
    </DndProvider>
  );
}
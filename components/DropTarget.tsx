"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { useBoard } from "@/utils/BoardProvider";
import { Task } from "@/types/task";

interface DropTargetProps {
  column: "todo" | "done";
  position: number;
}

const DropTarget: React.FC<DropTargetProps> = ({ column, position }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isAdjacent, setIsAdjacent] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const { moveTask } = useBoard();

  const getDropTargetConfig = useCallback(
    () => ({
      element: ref.current as HTMLElement,
      getDropEffect: () => "move" as const,
      getData: () => ({
        column,
        position,
      }),
      onDragEnter: (args: any) => {
        const sourceTask = args.data as Task;
        if (sourceTask) {
          const isSameColumn =
            (sourceTask.is_open ? "todo" : "done") === column;
          const isAdjacentPosition =
            isSameColumn && Math.abs(sourceTask.order - position) <= 1;

          if (!isSameColumn || !isAdjacentPosition) {
            setIsHovering(true);
          } else {
            setIsHovering(false);
          }

          setIsAdjacent(isAdjacentPosition);
        }
      },
      onDragLeave: () => {
        setIsHovering(false);
        setIsAdjacent(false);
      },
      onDrop: (args: any) => {
        const sourceTask = args.data as Task;

        if (sourceTask && sourceTask.task_id) {
          const isSameColumn =
            (sourceTask.is_open ? "todo" : "done") === column;
          const isAdjacentPosition =
            isSameColumn && Math.abs(sourceTask.order - position) <= 1;

          if (!isAdjacentPosition) {
            moveTask(sourceTask.task_id, column, position);
          }
        }
        setIsHovering(false);
      },
    }),
    [column, position, moveTask]
  );

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const unsubscribe = dropTargetForElements(getDropTargetConfig());
    return () => unsubscribe();
  }, [getDropTargetConfig]);

  return (
    <div
      ref={ref}
      className={`h-2 my-1 transition-colors ${
        isHovering && !isAdjacent ? "bg-green-200" : "bg-transparent"
      }`}
    />
  );
};

export default DropTarget;
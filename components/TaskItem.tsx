"use client";

import React, { useRef, useEffect, useState } from "react";
import { draggable, dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, RepeatIcon } from "lucide-react";
import { Task } from "@/types/task";
import { formatDueDate } from "@/utils/dateUtils";
import { isToday, isTomorrow, isPast, parseISO } from "date-fns";
import { effect } from "zod";

interface TaskItemProps {
  task: Task;
  index: number;
  onEdit: (task: Task) => void;
  onDelete: (id: string | number) => void;
  onToggleStatus: (id: string | number) => void;
}

export function TaskItem({
  task,
  index,
  onEdit,
  onDelete,
  onToggleStatus,
}: TaskItemProps) {
  const getDueDateColor = (dueDate: string): string => {
    const date = parseISO(dueDate);
    if (isToday(date)) return "text-gray-500 bg-gray-100";
    if (isTomorrow(date) || date > new Date())
      return "text-blue-500 bg-blue-100";
    if (isPast(date)) return "text-red-500 bg-red-100";
    return "text-gray-500 bg-gray-100";
  };

  const formattedDate = task.due_date ? formatDueDate(task.due_date) : "";
  const dueDateColor = task.due_date ? getDueDateColor(task.due_date) : "";

  const draggableRef = useRef<HTMLDivElement>(null);

  // test start

  useEffect(() => {
    const element = draggableRef.current;
    if (!element) {
      return;
    }
    return draggable({
      element,
      // onDragStart(): void {
      //   console.log("drag start");
      // },
      // onDrop(): void {
      //   console.log("drop");
      // },
    });
  }, []);

  // test end

  useEffect(() => {
    if (draggableRef.current) {
      const cleanup = draggable({
        element: draggableRef.current,
        id: `task-${task.task_id}`,
        data: { index, taskId: task.task_id },
      });
      return cleanup;
    }
  }, [task.task_id, index]);

  return (
    <div
      ref={draggableRef}
      className="bg-white p-4 rounded shadow mb-2 transition-all duration-300 ease-in-out cursor-move"
      onDoubleClick={() => onEdit(task)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Checkbox
            checked={!task.is_open}
            onCheckedChange={() => onToggleStatus(task.task_id)}
          />
          <div>
            <div className="flex items-center">
              <h3
                className={`text-lg font-medium ${
                  !task.is_open ? "text-gray-500 line-through" : ""
                }`}
              >
                {task.title}
              </h3>
              {task.due_date && (
                <span
                  className={`ml-2 text-sm ${
                    !task.is_open ? "text-gray-400" : dueDateColor
                  } px-2 py-1 rounded`}
                >
                  {formattedDate}
                  {task.recurrence && task.recurrence !== "none" && (
                    <RepeatIcon className="inline-block ml-1 w-4 h-4" />
                  )}
                </span>
              )}
            </div>
            {task.description && (
              <p
                className={`text-sm text-gray-600 ${
                  !task.is_open ? "text-gray-400" : ""
                }`}
              >
                {task.description}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Trash2
            className={`h-6 w-6 cursor-pointer ${
              !task.is_open
                ? "text-gray-400"
                : "text-red-500 hover:text-red-700"
            }`}
            onClick={() => onDelete(task.task_id)}
          />
        </div>
      </div>
    </div>
  );
}
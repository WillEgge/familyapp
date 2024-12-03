"use client";

import React, { useRef, useEffect } from "react";
import { Task } from "@/types/task";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, RepeatIcon } from "lucide-react";
import { formatDueDate } from "@/utils/dateUtils";
import { isToday, isTomorrow, isPast, parseISO } from "date-fns";

interface TaskItemProps {
  task: Task;
  index: number;
  onMove: (
    taskId: number,
    targetColumn: "todo" | "done",
    targetPosition: number
  ) => Promise<void>;
  onDelete: (taskId: number) => Promise<void>;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  index,
  onMove,
  onDelete,
}) => {
  const draggableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = draggableRef.current;
    if (!element) return;

    // Implement drag-and-drop logic here or use a library
    // For simplicity, this example does not include the full implementation

    return () => {
      // Cleanup drag-and-drop listeners if any
    };
  }, [task, index, onMove]);

  const getDueDateColor = (dueDate: string): string => {
    const date = parseISO(dueDate);
    if (isToday(date)) return "text-gray-500 bg-gray-100";
    if (isTomorrow(date)) return "text-blue-500 bg-blue-100";
    if (isPast(date)) return "text-red-500 bg-red-100";
    return "text-gray-500 bg-gray-100";
  };

  const formattedDate = task.due_date ? formatDueDate(task.due_date) : "";
  const dueDateColor = task.due_date ? getDueDateColor(task.due_date) : "";

  return (
    <div
      ref={draggableRef}
      className="bg-white p-4 rounded-md shadow cursor-grab"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", JSON.stringify(task));
      }}
      onDragEnd={(e) => {
        // Handle drag end if necessary
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Checkbox
            checked={!task.is_open}
            onCheckedChange={() =>
              onMove(task.task_id, task.is_open ? "done" : "todo", 0)
            } // Adjust targetPosition as needed
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
};

export default TaskItem;
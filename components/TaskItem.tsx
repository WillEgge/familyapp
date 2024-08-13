import React, { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, RepeatIcon } from "lucide-react";
import { RoughNotation } from "react-rough-notation";
import { Task } from "@/types/task";
import { formatDueDate } from "@/utils/dateUtils";
import { isBefore } from "date-fns";

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string | number) => void;
  onToggleStatus: (id: string | number) => void;
}

export function TaskItem({
  task,
  onEdit,
  onDelete,
  onToggleStatus,
}: TaskItemProps) {
  const [showStrikethrough, setShowStrikethrough] = useState(!task.is_open);
  const isPastDue =
    task.due_date &&
    isBefore(new Date(task.due_date), new Date()) &&
    task.is_open;

  useEffect(() => {
    setShowStrikethrough(!task.is_open);
  }, [task.is_open]);

  return (
    <div
      className="bg-white p-4 rounded shadow mb-2 transition-all duration-300 ease-in-out"
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
              <RoughNotation
                type="strike-through"
                show={showStrikethrough}
                color="red"
              >
                <h3
                  className={`text-2xl font-medium ${
                    !task.is_open ? "text-gray-500" : ""
                  }`}
                >
                  {task.title}
                </h3>
              </RoughNotation>
              {task.due_date && (
                <span
                  className={`ml-2 text-sm ${
                    !task.is_open
                      ? "text-gray-400"
                      : isPastDue
                      ? "text-red-500 bg-red-100"
                      : "text-blue-500 bg-blue-100"
                  } px-2 py-1 rounded`}
                >
                  {formatDueDate(task.due_date)}
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
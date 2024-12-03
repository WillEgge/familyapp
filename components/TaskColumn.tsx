"use client";

import React from "react";
import { Task } from "@/types/task";
import TaskList from "@/components/TaskList";
import DropTarget from "@/components/DropTarget";

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  onMove: (
    taskId: number,
    targetColumn: "todo" | "done",
    targetPosition: number
  ) => Promise<void>;
  onDelete: (taskId: number) => Promise<void>;
}

const TaskColumn: React.FC<TaskColumnProps> = ({
  title,
  tasks,
  onMove,
  onDelete,
}) => {
  const columnType = title.toLowerCase() as "todo" | "done";

  return (
    <div className="flex-1 bg-gray-50 p-4 rounded-md shadow">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div>
      <TaskList
        tasks={tasks}
        onMove={onMove}
        onDelete={onDelete}
        column={columnType}
      />
    </div>
    </div>
  );
};

export default TaskColumn;
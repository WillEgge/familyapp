"use client";

import React from "react";
import { Task } from "@/types/task";
import TaskList from "@/components/TaskList";

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  onDelete: (taskId: string | number) => Promise<void>;
  onToggleStatus: (taskId: string | number) => Promise<void>;
}

const TaskColumn: React.FC<TaskColumnProps> = ({
  title,
  tasks,
  onDelete,
  onToggleStatus,
}) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <TaskList
        tasks={tasks}
        onDelete={onDelete}
        onToggleStatus={onToggleStatus}
      />
    </div>
  );
};

export default TaskColumn;
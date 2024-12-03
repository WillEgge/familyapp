"use client";

import React from "react";
import { Task } from "@/types/task";
import TaskItem from "@/components/TaskItem";

interface TaskListProps {
  tasks: Task[];
  onMove: (
    taskId: number,
    targetColumn: "todo" | "done",
    targetPosition: number
  ) => Promise<void>;
  onDelete: (taskId: number) => Promise<void>;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onMove, onDelete }) => {
  return (
    <div className="space-y-2">
      {tasks.length > 0 ? (
        tasks.map((task, index) => (
          <TaskItem
            key={task.task_id}
            task={task}
            index={index}
            onMove={onMove}
            onDelete={onDelete}
          />
        ))
      ) : (
        <p className="text-center text-gray-500">No tasks available.</p>
      )}
    </div>
  );
};

export default TaskList;
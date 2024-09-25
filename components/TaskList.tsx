"use client";

import React from "react";
import { Task } from "@/types/task";
import { TaskItem } from "@/components/TaskItem";

interface TaskListProps {
  tasks: Task[];
  onDelete: (taskId: string | number) => Promise<void>;
  onToggleStatus: (taskId: string | number) => Promise<void>;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onDelete,
  onToggleStatus,
}) => {
  return (
    <div>
      {tasks && tasks.length > 0 ? (
        tasks.map((task, index) => (
          <TaskItem
            key={`${task.task_id}-${task.is_open}`}
            task={task}
            index={index}
            onEdit={() => {}} 
            onDelete={onDelete}
            onToggleStatus={onToggleStatus}
          />
        ))
      ) : (
        <p>No tasks available.</p>
      )}
    </div>
  );
};

export default TaskList;
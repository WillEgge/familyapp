"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";

interface Task {
  task_id: string | number;
  task_description: string;
  due_date: string;
  priority: string;
  is_open: boolean;
}

interface TaskListProps {
  tasks: Task[];
  memberId: number;
}

export default function TaskList({ tasks, memberId }: TaskListProps) {
  const [localTasks, setLocalTasks] = useState(tasks);
  const supabase = createClient();

  const toggleTaskStatus = async (taskId: string | number) => {
    const { data, error } = await supabase
      .from("task")
      .update({
        is_open: !localTasks.find((t) => t.task_id === taskId)?.is_open,
      })
      .eq("task_id", taskId)
      .select();

    if (error) {
      console.error("Error updating task:", error);
    } else if (data) {
      setLocalTasks(
        localTasks.map((task) =>
          task.task_id === taskId ? { ...task, is_open: !task.is_open } : task
        )
      );
    }
  };

  return (
    <ul className="space-y-2">
      {localTasks.map((task) => (
        <li
          key={task.task_id}
          className="flex items-center justify-between bg-white p-4 rounded shadow"
        >
          <div>
            <h3 className="text-lg font-medium">{task.task_description}</h3>
            <p>Due: {new Date(task.due_date).toLocaleDateString()}</p>
            <p>Priority: {task.priority}</p>
          </div>
          <Button
            onClick={() => toggleTaskStatus(task.task_id)}
            variant={task.is_open ? "outline" : "default"}
          >
            {task.is_open ? "Mark Complete" : "Reopen"}
          </Button>
        </li>
      ))}
    </ul>
  );
}

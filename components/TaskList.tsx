"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil, Trash2, X } from "lucide-react";

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
  onTasksChanged?: () => void;
}

export default function TaskList({
  tasks,
  memberId,
  onTasksChanged,
}: TaskListProps) {
  const [localTasks, setLocalTasks] = useState(tasks);
  const [editingTask, setEditingTask] = useState<string | number | null>(null);
  const [editedDescription, setEditedDescription] = useState("");
  const [editedDueDate, setEditedDueDate] = useState("");
  const [editedPriority, setEditedPriority] = useState("");
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
      onTasksChanged?.();
    }
  };

  const startEditing = (task: Task) => {
    setEditingTask(task.task_id);
    setEditedDescription(task.task_description);
    setEditedDueDate(task.due_date);
    setEditedPriority(task.priority);
  };

  const cancelEditing = () => {
    setEditingTask(null);
  };

  const saveEdit = async (taskId: string | number) => {
    const { data, error } = await supabase
      .from("task")
      .update({
        task_description: editedDescription,
        due_date: editedDueDate,
        priority: editedPriority,
      })
      .eq("task_id", taskId)
      .select();

    if (error) {
      console.error("Error updating task:", error);
    } else if (data) {
      setLocalTasks(
        localTasks.map((task) =>
          task.task_id === taskId
            ? {
                ...task,
                task_description: editedDescription,
                due_date: editedDueDate,
                priority: editedPriority,
              }
            : task
        )
      );
      setEditingTask(null);
      onTasksChanged?.();
    }
  };

  const deleteTask = async (taskId: string | number) => {
    const { error } = await supabase
      .from("task")
      .delete()
      .eq("task_id", taskId);

    if (error) {
      console.error("Error deleting task:", error);
    } else {
      setLocalTasks(localTasks.filter((task) => task.task_id !== taskId));
      onTasksChanged?.();
    }
  };

  return (
    <ul className="space-y-4">
      {localTasks.map((task) => (
        <li key={task.task_id} className="bg-white p-4 rounded shadow">
          {editingTask === task.task_id ? (
            <div className="space-y-2">
              <Input
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                className="w-full"
                placeholder="Task description"
              />
              <Input
                type="date"
                value={editedDueDate}
                onChange={(e) => setEditedDueDate(e.target.value)}
                className="w-full"
              />
              <Select value={editedPriority} onValueChange={setEditedPriority}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Low</SelectItem>
                  <SelectItem value="2">Medium</SelectItem>
                  <SelectItem value="3">High</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex justify-end space-x-2">
                <Button onClick={() => saveEdit(task.task_id)}>Save</Button>
                <Button variant="outline" onClick={cancelEditing}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium">{task.task_description}</h3>
                <p>Due: {new Date(task.due_date).toLocaleDateString()}</p>
                <p>
                  Priority:{" "}
                  {task.priority === "1"
                    ? "Low"
                    : task.priority === "2"
                    ? "Medium"
                    : "High"}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => startEditing(task)}
                  variant="outline"
                  size="icon"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => toggleTaskStatus(task.task_id)}
                  variant={task.is_open ? "outline" : "default"}
                >
                  {task.is_open ? "Mark Complete" : "Reopen"}
                </Button>
                <Button
                  onClick={() => deleteTask(task.task_id)}
                  variant="destructive"
                  size="icon"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

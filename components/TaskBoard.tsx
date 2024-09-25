"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Task } from "@/types/task";
import TaskColumn from "@/components/TaskColumn";
import AddTaskForm from "@/components/AddTaskForm";
import { toast } from "sonner";

interface TaskBoardProps {
  initialTasks: Task[];
  memberId: number;
}

const TaskBoard: React.FC<TaskBoardProps> = ({ initialTasks, memberId }) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks || []);
  const [todoTasks, setTodoTasks] = useState<Task[]>([]);
  const [doneTasks, setDoneTasks] = useState<Task[]>([]);
  const [lastDeletedTask, setLastDeletedTask] = useState<Task | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if (Array.isArray(tasks)) {
      const todo = tasks
        .filter((task) => task.is_open)
        .sort((a, b) => a.order - b.order);
      const done = tasks
        .filter((task) => !task.is_open)
        .sort((a, b) => a.order - b.order);
      setTodoTasks(todo);
      setDoneTasks(done);
    }
  }, [tasks]);

  const handleTaskAdded = (newTask: Task) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const deleteTask = async (taskId: string | number) => {
    const taskToDelete = tasks.find((task) => task.task_id === taskId);
    if (taskToDelete) {
      setLastDeletedTask(taskToDelete);
    }

    const { error } = await supabase
      .from("task")
      .delete()
      .eq("task_id", taskId);

    if (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
    } else {
      setTasks((prevTasks) =>
        prevTasks.filter((task) => task.task_id !== taskId)
      );
      toast.success("Task deleted successfully", {
        action: {
          label: "Undo",
          onClick: () => undoDelete(),
        },
      });
    }
  };

  const undoDelete = async () => {
    if (lastDeletedTask) {
      const { data, error } = await supabase
        .from("task")
        .insert([lastDeletedTask])
        .select();

      if (error) {
        console.error("Error restoring task:", error);
        toast.error("Failed to restore task");
      } else if (data) {
        setTasks((prevTasks) => [...prevTasks, data[0]]);
        setLastDeletedTask(null);
        toast.success("Task restored successfully");
      }
    }
  };

  const toggleTaskStatus = async (taskId: string | number) => {
    const taskToToggle = tasks.find((task) => task.task_id === taskId);
    if (taskToToggle) {
      const newStatus = !taskToToggle.is_open;
      const { data, error } = await supabase
        .from("task")
        .update({ is_open: newStatus })
        .eq("task_id", taskId)
        .select();

      if (error) {
        console.error("Error toggling task status:", error);
        toast.error("Failed to update task status");
      } else if (data) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.task_id === taskId ? { ...task, is_open: newStatus } : task
          )
        );
        toast.success(`Task marked as ${newStatus ? "todo" : "done"}`);
      }
    }
  };

  return (
    <div>
      <AddTaskForm memberId={memberId} onTaskAdded={handleTaskAdded} />
      {todoTasks.length > 0 && (
        <TaskColumn
          title="Todo"
          tasks={todoTasks}
          onDelete={deleteTask}
          onToggleStatus={toggleTaskStatus}
        />
      )}
      {doneTasks.length > 0 && (
        <TaskColumn
          title="Done"
          tasks={doneTasks}
          onDelete={deleteTask}
          onToggleStatus={toggleTaskStatus}
        />
      )}
      {todoTasks.length === 0 && doneTasks.length === 0 && (
        <p className="text-center text-gray-500 mt-8">No tasks available.</p>
      )}
    </div>
  );
};

export default TaskBoard;

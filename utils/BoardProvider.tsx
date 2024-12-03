"use client";

import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
  useEffect,
} from "react";
import { Task } from "@/types/task";
import { createClient as createSupabaseClient } from "@/utils/supabase/client";
import { toast } from "sonner";

// Define the context type
interface BoardContextType {
  todoTasks: Task[];
  doneTasks: Task[];
  moveTask: (
    taskId: number,
    targetColumn: "todo" | "done",
    targetPosition: number
  ) => Promise<void>;
  addTask: (newTask: Omit<Task, "task_id">) => Promise<Task | null>;
  deleteTask: (taskId: number) => Promise<void>;
}

// Create the context with default values
const BoardContext = createContext<BoardContextType>({
  todoTasks: [],
  doneTasks: [],
  moveTask: async () => {},
  addTask: async () => null,
  deleteTask: async () => {},
});

// Provider component
export const BoardProvider = ({ children }: { children: ReactNode }) => {
  const [todoTasks, setTodoTasks] = useState<Task[]>([]);
  const [doneTasks, setDoneTasks] = useState<Task[]>([]);
  const supabase = createSupabaseClient();
  const { toast: showToast } = { toast };

  // Fetch tasks from Supabase
  const fetchTasks = useCallback(async () => {
    const { data, error } = await supabase
      .from("task")
      .select("*")
      .order("order", { ascending: true });

    if (error) {
      console.error("Error fetching tasks:", error);
      showToast.error("Failed to fetch tasks. Please try again.");
    } else if (data) {
      const todo = data
        .filter((task) => task.is_open)
        .sort((a, b) => a.order - b.order);
      const done = data
        .filter((task) => !task.is_open)
        .sort((a, b) => a.order - b.order);
      setTodoTasks(todo as Task[]);
      setDoneTasks(done as Task[]);
    }
  }, [supabase, showToast]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Move task between columns or within the same column
  const moveTask = useCallback(
    async (
      taskId: number,
      targetColumn: "todo" | "done",
      targetPosition: number
    ) => {
      try {
        // Fetch the task to be moved
        const { data: task, error: fetchError } = await supabase
          .from("task")
          .select("*")
          .eq("task_id", taskId)
          .single();

        if (fetchError || !task) {
          throw new Error("Task not found");
        }

        const isMovingToTodo = targetColumn === "todo";

        // Update the task's is_open and order in Supabase
        const { error: updateError } = await supabase
          .from("task")
          .update({
            is_open: isMovingToTodo,
            order: targetPosition,
          })
          .eq("task_id", taskId);

        if (updateError) {
          throw updateError;
        }

        // Re-fetch tasks to ensure state consistency
        await fetchTasks();

        showToast.success("Task moved successfully.");
      } catch (error: any) {
        console.error("Error moving task:", error);
        showToast.error("Failed to move task. Please try again.");
      }
    },
    [supabase, fetchTasks, showToast]
  );

  // Add a new task
  const addTask = useCallback(
    async (newTask: Omit<Task, "task_id">) => {
      try {
        const { data, error } = await supabase
          .from("task")
          .insert(newTask)
          .select()
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          // Update the state based on the task's is_open status
          if (data.is_open) {
            setTodoTasks((prev) =>
              [...prev, data as Task].sort((a, b) => a.order - b.order)
            );
          } else {
            setDoneTasks((prev) =>
              [...prev, data as Task].sort((a, b) => a.order - b.order)
            );
          }
          showToast.success("Task added successfully.");
          return data as Task;
        }
      } catch (error) {
        console.error("Error adding task:", error);
        showToast.error("Failed to add task.");
        return null;
      }
    },
    [supabase, showToast]
  );

  // Delete a task
  const deleteTask = useCallback(
    async (taskId: number) => {
      try {
        const { error } = await supabase
          .from("task")
          .delete()
          .eq("task_id", taskId);

        if (error) {
          throw error;
        }

        // Update the state by removing the deleted task
        setTodoTasks((prev) => prev.filter((task) => task.task_id !== taskId));
        setDoneTasks((prev) => prev.filter((task) => task.task_id !== taskId));

        showToast.success("Task deleted successfully.");
      } catch (error) {
        console.error("Error deleting task:", error);
        showToast.error("Failed to delete task.");
      }
    },
    [supabase, showToast]
  );

  return (
    <BoardContext.Provider
      value={{
        todoTasks,
        doneTasks,
        moveTask,
        addTask,
        deleteTask,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};

// Custom hook to use the BoardContext
export const useBoard = () => useContext(BoardContext);
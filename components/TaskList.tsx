"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Task } from "@/types/task";
import { TaskItem } from "@/components/TaskItem";
import { EditTaskForm } from "@/components/EditTaskForm";
import { toast } from "sonner";

interface TaskListProps {
  tasks: Task[];
  memberId: number;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks: initialTasks,
  memberId,
}) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [todoTasks, setTodoTasks] = useState<Task[]>([]);
  const [doneTasks, setDoneTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<string | number | null>(null);
  const [editedDescription, setEditedDescription] = useState("");
  const [editedDueDate, setEditedDueDate] = useState("");
  const [editedPriority, setEditedPriority] = useState<number>(2);
  const [editedTaskDescription, setEditedTaskDescription] = useState("");
  const supabase = createClient();

  useEffect(() => {
    const todo = tasks.filter((task) => task.is_open);
    const done = tasks.filter((task) => !task.is_open);
    setTodoTasks(todo);
    setDoneTasks(done);
  }, [tasks]);

  const toggleTaskStatus = async (taskId: string | number) => {
    const task = tasks.find((t) => t.task_id === taskId);
    if (!task) return;

    const newStatus = !task.is_open;

    const { data, error } = await supabase
      .from("task")
      .update({
        is_open: newStatus,
      })
      .eq("task_id", taskId)
      .select();

    if (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task status");
    } else if (data) {
      setTasks(
        tasks.map((t) =>
          t.task_id === taskId ? { ...t, is_open: newStatus } : t
        )
      );

      if (!newStatus && task.recurrence && task.recurrence !== "none") {
        const newDueDate = calculateNextDueDate(task.due_date, task.recurrence);
        const newTask: Partial<Task> = {
          title: task.title,
          description: task.description,
          due_date: newDueDate,
          priority: task.priority,
          is_open: true,
          assignee_id: task.assignee_id,
          recurrence: task.recurrence,
          order: task.order,
        };

        const { data: newTaskData, error: newTaskError } = await supabase
          .from("task")
          .insert([newTask])
          .select();

        if (newTaskError) {
          console.error("Error creating recurring task:", newTaskError);
          toast.error("Failed to create recurring task");
        } else if (newTaskData) {
          setTasks((prevTasks) => [...prevTasks, newTaskData[0] as Task]);
          toast.success("Recurring task created");
        }
      }
    }
  };

  const calculateNextDueDate = (
    currentDueDate: string,
    recurrence: string
  ): string => {
    const date = new Date(currentDueDate);
    switch (recurrence) {
      case "daily":
        date.setDate(date.getDate() + 1);
        break;
      case "weekly":
        date.setDate(date.getDate() + 7);
        break;
      case "monthly":
        date.setMonth(date.getMonth() + 1);
        break;
      case "yearly":
        date.setFullYear(date.getFullYear() + 1);
        break;
      default:
        return currentDueDate;
    }
    return date.toISOString().split("T")[0];
  };

  const startEditing = (task: Task) => {
    setEditingTask(task.task_id);
    setEditedDescription(task.title);
    setEditedDueDate(task.due_date);
    setEditedPriority(task.priority);
    setEditedTaskDescription(task.description || "");
  };

  const cancelEditing = () => {
    setEditingTask(null);
  };

  const saveEdit = async (taskId: string | number) => {
    const { data, error } = await supabase
      .from("task")
      .update({
        title: editedDescription,
        due_date: editedDueDate,
        priority: editedPriority,
        description: editedTaskDescription,
      })
      .eq("task_id", taskId)
      .select();

    if (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
    } else if (data) {
      setTasks(
        tasks.map((task) =>
          task.task_id === taskId
            ? {
                ...task,
                title: editedDescription,
                due_date: editedDueDate,
                priority: editedPriority,
                description: editedTaskDescription,
              }
            : task
        )
      );
      setEditingTask(null);
      toast.success("Task updated successfully");
    }
  };

  const deleteTask = async (taskId: string | number) => {
    const { error } = await supabase
      .from("task")
      .delete()
      .eq("task_id", taskId);

    if (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
    } else {
      setTasks(tasks.filter((task) => task.task_id !== taskId));
      toast.success("Task deleted successfully");
    }
  };

  const moveTask = (dragIndex: number, hoverIndex: number) => {
    const draggedTask = tasks[dragIndex];
    const newTasks = [...tasks];
    newTasks.splice(dragIndex, 1);
    newTasks.splice(hoverIndex, 0, draggedTask);
    setTasks(newTasks);
  };

  const updateTaskOrder = async () => {
    const updates = tasks.map((task, index) => ({
      task_id: task.task_id,
      order: index,
    }));

    for (const update of updates) {
      const { error } = await supabase
        .from("task")
        .update({ order: update.order })
        .eq("task_id", update.task_id);

      if (error) {
        console.error("Error updating task order:", error);
        toast.error("Failed to update task order");
      }
    }
  };

  useEffect(() => {
    updateTaskOrder();
  }, [tasks]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        {todoTasks.length > 0 && (
          <>
            <h2 className="text-xl font-bold mb-4">Todo</h2>
            {todoTasks.map((task, index) => (
              <TaskItem
                key={task.task_id}
                task={task}
                onEdit={startEditing}
                onDelete={deleteTask}
                onToggleStatus={toggleTaskStatus}
              />
            ))}
          </>
        )}
        {doneTasks.length > 0 && (
          <>
            <h2 className="text-xl font-bold mt-8 mb-4">Done</h2>
            {doneTasks.map((task, index) => (
              <TaskItem
                key={task.task_id}
                task={task}
                onEdit={startEditing}
                onDelete={deleteTask}
                onToggleStatus={toggleTaskStatus}
              />
            ))}
          </>
        )}
        {todoTasks.length === 0 && doneTasks.length === 0 && (
          <p className="text-center text-gray-500 mt-8">No tasks available.</p>
        )}
        {editingTask !== null && (
          <EditTaskForm
            editedDescription={editedDescription}
            editedTaskDescription={editedTaskDescription}
            editedDueDate={editedDueDate}
            editedPriority={editedPriority}
            onDescriptionChange={(e) => setEditedDescription(e.target.value)}
            onTaskDescriptionChange={(e) =>
              setEditedTaskDescription(e.target.value)
            }
            onDueDateChange={(e) => setEditedDueDate(e.target.value)}
            onPriorityChange={(e) => setEditedPriority(Number(e.target.value))}
            onSave={() => saveEdit(editingTask)}
            onCancel={cancelEditing}
          />
        )}
      </div>
    </DndProvider>
  );
};

export default TaskList;

"use client";

import React, { useState, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { Task } from "@/types/task";
import { TaskItem } from "@/components/TaskItem";
import { EditTaskForm } from "@/components/EditTaskForm";
import { toast } from "sonner";
import AddTaskForm from "@/components/AddTaskForm";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { DropTargetRecord } from "@atlaskit/pragmatic-drag-and-drop/types";

interface TaskListProps {
  initialTasks: Task[];
  memberId: number;
}

const TaskList: React.FC<TaskListProps> = ({ initialTasks, memberId }) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks || []);
  const [todoTasks, setTodoTasks] = useState<Task[]>([]);
  const [doneTasks, setDoneTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<string | number | null>(null);
  const [editedDescription, setEditedDescription] = useState("");
  const [editedDueDate, setEditedDueDate] = useState("");
  const [editedPriority, setEditedPriority] = useState<number>(2);
  const [editedTaskDescription, setEditedTaskDescription] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [lastDeletedTask, setLastDeletedTask] = useState<Task | null>(null);
  const supabase = createClient();

  const todoListRef = useRef<HTMLDivElement>(null);
  const doneListRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    //useEffect start
    const cleanup = monitorForElements({
      onDrop: async (event) => {
       
        // if (!event.source || !event.target) {
        //   return;
        // }

        const sourceElement = event.source.data?.element as
          | HTMLElement
          | undefined;
        const targetElement = event.target.data?.element as
          | HTMLElement
          | undefined;

        if (sourceElement && targetElement) {
          const sourceIndex = Array.from(
            sourceElement.parentElement?.children || []
          ).indexOf(sourceElement);
          const targetIndex = Array.from(
            targetElement.parentElement?.children || []
          ).indexOf(targetElement);
          const isOpen = targetElement.closest("#todo-list") !== null;

          await moveTask(sourceIndex, targetIndex, isOpen);
        }
      },
    });

    return cleanup;
    //useEffect end
  }, []);

  const moveTask = async (
    fromIndex: number,
    toIndex: number,
    isOpen: boolean
  ) => {
    const taskList = isOpen ? todoTasks : doneTasks;
    const reorderedTasks = [...taskList];
    const [movedTask] = reorderedTasks.splice(fromIndex, 1);
    reorderedTasks.splice(toIndex, 0, movedTask);

    if (isOpen) {
      setTodoTasks(reorderedTasks);
    } else {
      setDoneTasks(reorderedTasks);
    }

    const updates = reorderedTasks.map((task, index) => ({
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

    setRefreshTrigger((prev) => prev + 1);
  };

  const handleTaskAdded = (newTask: Task) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const startEditing = (task: Task) => {
    setEditingTask(task.task_id);
    setEditedDescription(task.title);
    setEditedTaskDescription(task.description || "");
    setEditedDueDate(task.due_date || "");
    setEditedPriority(task.priority || 2);
  };

  const saveEdit = async (taskId: string | number) => {
    const { data, error } = await supabase
      .from("task")
      .update({
        title: editedDescription,
        description: editedTaskDescription,
        due_date: editedDueDate,
        priority: editedPriority,
      })
      .eq("task_id", taskId)
      .select();

    if (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
    } else if (data) {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.task_id === taskId ? { ...task, ...data[0] } : task
        )
      );
      setEditingTask(null);
      toast.success("Task updated successfully");
    }
  };

  const cancelEditing = () => {
    setEditingTask(null);
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
      <div id="todo-list" ref={todoListRef}>
        {todoTasks.length > 0 && (
          <>
            <h2 className="text-xl font-bold mb-4">Todo</h2>
            {todoTasks.map((task, index) => (
              <TaskItem
                key={`${task.task_id}-${task.is_open}`}
                task={task}
                index={index}
                onEdit={startEditing}
                onDelete={deleteTask}
                onToggleStatus={toggleTaskStatus}
              />
            ))}
          </>
        )}
      </div>
      <div id="done-list" ref={doneListRef}>
        {doneTasks.length > 0 && (
          <>
            <h2 className="text-xl font-bold mt-8 mb-4">Done</h2>
            {doneTasks.map((task, index) => (
              <TaskItem
                key={`${task.task_id}-${task.is_open}`}
                task={task}
                index={index}
                onEdit={startEditing}
                onDelete={deleteTask}
                onToggleStatus={toggleTaskStatus}
              />
            ))}
          </>
        )}
      </div>
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
  );
};

export default TaskList;

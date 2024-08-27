"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Task } from "@/types/task";
import { TaskItem } from "@/components/TaskItem";
import { EditTaskForm } from "@/components/EditTaskForm";
import { toast } from "sonner";
import AddTaskForm from "@/components/AddTaskForm";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { calculateNextDueDate } from "@/utils/dateUtils";

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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
    if (refreshTrigger > 0) {
      const timer = setTimeout(() => {
        setRefreshTrigger(0);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [refreshTrigger]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = todoTasks.findIndex(
        (task) => task.task_id === active.id
      );
      const newIndex = todoTasks.findIndex((task) => task.task_id === over?.id);

      const newTasks = arrayMove(todoTasks, oldIndex, newIndex);
      setTodoTasks(newTasks);

      const updates = newTasks.map((task, index) => ({
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
    }
  };

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
      setRefreshTrigger((prev) => prev + 1);

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
          setRefreshTrigger((prev) => prev + 1);
          toast.success("Recurring task created");
        }
      }
    }
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
      setRefreshTrigger((prev) => prev + 1);
      toast.success("Task updated successfully");
    }
  };

  const deleteTask = async (taskId: string | number) => {
    const taskToDelete = tasks.find((task) => task.task_id === taskId);
    if (!taskToDelete) return;

    const { error } = await supabase
      .from("task")
      .delete()
      .eq("task_id", taskId);

    if (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
    } else {
      setTasks(tasks.filter((task) => task.task_id !== taskId));
      setRefreshTrigger((prev) => prev + 1);
      setLastDeletedTask(taskToDelete);
      toast.success("Task deleted successfully", {
        action: {
          label: "Undo",
          onClick: () => undoDelete(taskToDelete),
        },
      });
    }
  };

  const undoDelete = async (deletedTask: Task) => {
    const { data, error } = await supabase
      .from("task")
      .insert([deletedTask])
      .select();

    if (error) {
      console.error("Error undoing task deletion:", error);
      toast.error("Failed to undo task deletion");
    } else if (data) {
      setTasks((prevTasks) => [...prevTasks, data[0] as Task]);
      setRefreshTrigger((prev) => prev + 1);
      toast.success("Task restored successfully");
    }
  };

  const handleTaskAdded = (newTask: Task) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div key={refreshTrigger}>
        <AddTaskForm memberId={memberId} onTaskAdded={handleTaskAdded} />
        {todoTasks.length > 0 && (
          <>
            <h2 className="text-xl font-bold mb-4">Todo</h2>
            <SortableContext
              items={todoTasks.map((task) => task.task_id)}
              strategy={verticalListSortingStrategy}
            >
              {todoTasks.map((task) => (
                <TaskItem
                  key={task.task_id}
                  task={task}
                  onEdit={startEditing}
                  onDelete={deleteTask}
                  onToggleStatus={toggleTaskStatus}
                />
              ))}
            </SortableContext>
          </>
        )}
        {doneTasks.length > 0 && (
          <>
            <h2 className="text-xl font-bold mt-8 mb-4">Done</h2>
            {doneTasks.map((task) => (
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
    </DndContext>
  );
};

export default TaskList;
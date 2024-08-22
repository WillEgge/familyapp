"use client";

import React, { useState, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { getEmptyImage } from "react-dnd-html5-backend";
import { Task } from "@/types/task";
import { TaskItem } from "@/components/TaskItem";
import { EditTaskForm } from "@/components/EditTaskForm";
import { toast } from "sonner";
import AddTaskForm from "@/components/AddTaskForm";

interface TaskListProps {
  initialTasks: Task[];
  memberId: number;
}

interface DraggableTaskItemProps {
  task: Task;
  index: number;
  moveTask: (dragIndex: number, hoverIndex: number, isOpen: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string | number) => void;
  onToggleStatus: (id: string | number) => void;
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

  const moveTask = async (
    dragIndex: number,
    hoverIndex: number,
    isOpen: boolean
  ) => {
    const taskList = isOpen ? todoTasks : doneTasks;
    const reorderedTasks = [...taskList];
    const [movedTask] = reorderedTasks.splice(dragIndex, 1);
    reorderedTasks.splice(hoverIndex, 0, movedTask);

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

  const isTouchDevice = () => {
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
  };

  return (
    <DndProvider backend={isTouchDevice() ? TouchBackend : HTML5Backend}>
      <div key={refreshTrigger}>
        <AddTaskForm memberId={memberId} onTaskAdded={handleTaskAdded} />
        {todoTasks.length > 0 && (
          <>
            <h2 className="text-xl font-bold mb-4">Todo</h2>
            {todoTasks.map((task, index) => (
              <DraggableTaskItem
                key={`${task.task_id}-${task.is_open}`}
                task={task}
                index={index}
                moveTask={moveTask}
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
              <DraggableTaskItem
                key={`${task.task_id}-${task.is_open}`}
                task={task}
                index={index}
                moveTask={moveTask}
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

const DraggableTaskItem: React.FC<DraggableTaskItemProps> = ({
  task,
  index,
  moveTask,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ handlerId }, drop] = useDrop({
    accept: task.is_open ? "TODO_TASK" : "DONE_TASK",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(
      item: { id: string | number; index: number; isOpen: boolean },
      monitor
    ) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      moveTask(dragIndex, hoverIndex, item.isOpen);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag, preview] = useDrag({
    type: task.is_open ? "TODO_TASK" : "DONE_TASK",
    item: () => {
      return { id: task.task_id, index, isOpen: task.is_open };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{ opacity: isDragging ? 0.5 : 1, touchAction: "none" }}
      data-handler-id={handlerId}
    >
      <TaskItem
        key={`${task.task_id}-${task.is_open}`}
        task={task}
        onEdit={onEdit}
        onDelete={onDelete}
        onToggleStatus={onToggleStatus}
      />
    </div>
  );
};

export default TaskList;

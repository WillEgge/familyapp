"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil, Trash2, X } from "lucide-react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { RoughNotation } from "react-rough-notation";
import { Task } from "@/types/task";

interface TaskListProps {
  tasks: Task[];
  memberId: number;
}

const TaskItem = ({
  task,
  index,
  onEdit,
  onDelete,
  onToggleStatus,
  moveTask,
}: {
  task: Task;
  index: number;
  onEdit: (task: Task) => void;
  onDelete: (id: string | number) => void;
  onToggleStatus: (id: string | number) => void;
  moveTask: (dragIndex: number, hoverIndex: number) => void;
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: { id: task.task_id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "TASK",
    hover(item: { id: string | number; index: number }, monitor) {
      if (!drag) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      moveTask(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`bg-white p-4 rounded shadow mb-2 ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Checkbox
            checked={!task.is_open}
            onCheckedChange={() => onToggleStatus(task.task_id)}
          />
          <RoughNotation type="strike-through" show={!task.is_open} color="red">
            <h3 className="text-2xl font-medium">{task.task_description}</h3>
          </RoughNotation>
        </div>
        <div className="flex items-center space-x-2">
          <Pencil
            className="h-6 w-6 cursor-pointer text-gray-500 hover:text-gray-700"
            onClick={() => onEdit(task)}
          />
          <Trash2
            className="h-6 w-6 cursor-pointer text-red-500 hover:text-red-700"
            onClick={() => onDelete(task.task_id)}
          />
        </div>
      </div>
    </div>
  );
};

const TaskList = ({ tasks: initialTasks, memberId }: TaskListProps) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [editingTask, setEditingTask] = useState<string | number | null>(null);
  const [editedDescription, setEditedDescription] = useState("");
  const [editedDueDate, setEditedDueDate] = useState("");
  const [editedPriority, setEditedPriority] = useState<
    "low" | "medium" | "high"
  >("low");
  const supabase = createClient();

  const toggleTaskStatus = async (taskId: string | number) => {
    const { data, error } = await supabase
      .from("task")
      .update({
        is_open: !tasks.find((t) => t.task_id === taskId)?.is_open,
      })
      .eq("task_id", taskId)
      .select();

    if (error) {
      console.error("Error updating task:", error);
    } else if (data) {
      setTasks(
        tasks.map((task) =>
          task.task_id === taskId ? { ...task, is_open: !task.is_open } : task
        )
      );
    }
  };

  const startEditing = (task: Task) => {
    setEditingTask(task.task_id);
    setEditedDescription(task.task_description);
    setEditedDueDate(task.due_date);
    setEditedPriority(
      task.priority === 1 ? "low" : task.priority === 2 ? "medium" : "high"
    );
  };

  const cancelEditing = () => {
    setEditingTask(null);
  };

  const saveEdit = async (taskId: string | number) => {
    const priorityValue =
      editedPriority === "low" ? 1 : editedPriority === "medium" ? 2 : 3;
    const { data, error } = await supabase
      .from("task")
      .update({
        task_description: editedDescription,
        due_date: editedDueDate,
        priority: priorityValue,
      })
      .eq("task_id", taskId)
      .select();

    if (error) {
      console.error("Error updating task:", error);
    } else if (data) {
      setTasks(
        tasks.map((task) =>
          task.task_id === taskId
            ? {
                ...task,
                task_description: editedDescription,
                due_date: editedDueDate,
                priority: priorityValue,
              }
            : task
        )
      );
      setEditingTask(null);
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
      setTasks(tasks.filter((task) => task.task_id !== taskId));
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

    const { error } = await supabase.from("task").upsert(updates);
    if (error) {
      console.error("Error updating task order:", error);
    }
  };

  useEffect(() => {
    updateTaskOrder();
  }, [tasks]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        {tasks.map((task, index) => (
          <TaskItem
            key={task.task_id}
            task={task}
            index={index}
            onEdit={startEditing}
            onDelete={deleteTask}
            onToggleStatus={toggleTaskStatus}
            moveTask={moveTask}
          />
        ))}
        {editingTask !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg w-96">
              <h2 className="text-xl font-bold mb-4">Edit Task</h2>
              <Input
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                className="w-full mb-2"
                placeholder="Task description"
              />
              <Input
                type="date"
                value={editedDueDate}
                onChange={(e) => setEditedDueDate(e.target.value)}
                className="w-full mb-2"
              />
              <Select
                value={editedPriority}
                onValueChange={(value: "low" | "medium" | "high") =>
                  setEditedPriority(value)
                }
              >
                <SelectTrigger className="w-full mb-2">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex justify-end space-x-2 mt-4">
                <button onClick={() => saveEdit(editingTask)}>Save</button>
                <button onClick={cancelEditing}>
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  );
};

export default TaskList;
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
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

interface Task {
  task_id: string | number;
  task_description: string;
  due_date: string;
  priority: number;
  is_open: boolean;
}

interface TaskListProps {
  tasks: Task[];
  memberId: number;
}

const priorityLabels = {
  1: "low",
  2: "medium",
  3: "high",
};

const priorityMapping = {
  low: 1,
  medium: 2,
  high: 3,
};

const PrioritySection = ({
  priority,
  tasks,
  onDrop,
  children,
}: {
  priority: "low" | "medium" | "high";
  tasks: Task[];
  onDrop: (id: string | number, priority: "low" | "medium" | "high") => void;
  children: React.ReactNode;
}) => {
  const [, drop] = useDrop({
    accept: "TASK",
    drop: (item: { id: string | number }) => onDrop(item.id, priority),
  });

  return (
    <div ref={drop} className="bg-gray-100 p-4 rounded-md mb-4">
      <h3 className="text-lg font-semibold mb-2">
        {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
      </h3>
      {children}
    </div>
  );
};

const TaskItem = ({
  task,
  onEdit,
  onDelete,
  onToggleStatus,
}: {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string | number) => void;
  onToggleStatus: (id: string | number) => void;
}) => {
  const [, drag] = useDrag({
    type: "TASK",
    item: { id: task.task_id },
  });

  return (
    <div ref={drag} className="bg-white p-4 rounded shadow mb-2">
      <h3 className="text-lg font-medium">{task.task_description}</h3>
      <p>Due: {new Date(task.due_date).toLocaleDateString()}</p>
      <div className="flex items-center space-x-2 mt-2">
        <Button onClick={() => onEdit(task)} variant="outline" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          onClick={() => onToggleStatus(task.task_id)}
          variant={task.is_open ? "outline" : "default"}
        >
          {task.is_open ? "Mark Complete" : "Reopen"}
        </Button>
        <Button
          onClick={() => onDelete(task.task_id)}
          variant="destructive"
          size="icon"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

const TaskList = ({ tasks: initialTasks, memberId }: TaskListProps) => {
  const [tasks, setTasks] = useState(initialTasks);
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
      priorityLabels[task.priority as keyof typeof priorityLabels]
    );
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
        priority: priorityMapping[editedPriority],
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
                priority: priorityMapping[editedPriority],
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

  const handleDrop = async (
    taskId: string | number,
    newPriority: "low" | "medium" | "high"
  ) => {
    const { data, error } = await supabase
      .from("task")
      .update({ priority: priorityMapping[newPriority] })
      .eq("task_id", taskId)
      .select();

    if (error) {
      console.error("Error updating task priority:", error);
    } else if (data) {
      setTasks(
        tasks.map((task) =>
          task.task_id === taskId
            ? { ...task, priority: priorityMapping[newPriority] }
            : task
        )
      );
    }
  };

  const renderTasks = (priority: "low" | "medium" | "high") => {
    return tasks
      .filter(
        (task) =>
          priorityLabels[task.priority as keyof typeof priorityLabels] ===
          priority
      )
      .map((task) => (
        <TaskItem
          key={task.task_id}
          task={task}
          onEdit={startEditing}
          onDelete={deleteTask}
          onToggleStatus={toggleTaskStatus}
        />
      ));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <PrioritySection priority="high" tasks={tasks} onDrop={handleDrop}>
          {renderTasks("high")}
        </PrioritySection>
        <PrioritySection priority="medium" tasks={tasks} onDrop={handleDrop}>
          {renderTasks("medium")}
        </PrioritySection>
        <PrioritySection priority="low" tasks={tasks} onDrop={handleDrop}>
          {renderTasks("low")}
        </PrioritySection>
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
                <Button onClick={() => saveEdit(editingTask)}>Save</Button>
                <Button variant="outline" onClick={cancelEditing}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  );
};

export default TaskList;

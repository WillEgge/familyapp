"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, RepeatIcon } from "lucide-react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { RoughNotation } from "react-rough-notation";
import { Task } from "@/types/task";
import { addDays, addWeeks, addMonths, addYears } from "date-fns";

interface TaskListProps {
  tasks: Task[];
  memberId: number;
}

interface TaskItemProps {
  task: Task;
  index: number;
  onEdit: (task: Task) => void;
  onDelete: (id: string | number) => void;
  onToggleStatus: (id: string | number) => void;
  moveTask: (dragIndex: number, hoverIndex: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  index,
  onEdit,
  onDelete,
  onToggleStatus,
  moveTask,
}) => {
  const [isMoving, setIsMoving] = useState(false);
  const [showStrikethrough, setShowStrikethrough] = useState(!task.is_open);

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

  useEffect(() => {
    setIsMoving(true);
    const timer = setTimeout(() => {
      setIsMoving(false);
      setShowStrikethrough(!task.is_open);
    }, 300);

    return () => clearTimeout(timer);
  }, [task.is_open]);

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`bg-white p-4 rounded shadow mb-2 ${
        isDragging ? "opacity-50" : ""
      } transition-all duration-300 ease-in-out`}
      onDoubleClick={() => onEdit(task)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Checkbox
            checked={!task.is_open}
            onCheckedChange={() => onToggleStatus(task.task_id)}
          />
          <div>
            <div className="flex items-center">
              <RoughNotation
                type="strike-through"
                show={!isMoving && showStrikethrough}
                color="red"
              >
                <h3
                  className={`text-2xl font-medium ${
                    !task.is_open ? "text-gray-500" : ""
                  }`}
                >
                  {task.title}
                </h3>
              </RoughNotation>
              {task.due_date && (
                <span
                  className={`ml-2 text-sm ${
                    !task.is_open
                      ? "text-gray-400"
                      : "text-blue-500 bg-blue-100 px-2 py-1 rounded"
                  }`}
                >
                  {new Date(task.due_date).toLocaleDateString()}
                  {task.recurrence && task.recurrence !== "none" && (
                    <RepeatIcon className="inline-block ml-1 w-4 h-4" />
                  )}
                </span>
              )}
            </div>
            {task.description && (
              <p
                className={`text-sm text-gray-600 ${
                  !task.is_open ? "text-gray-400" : ""
                }`}
              >
                {task.description}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Trash2
            className={`h-6 w-6 cursor-pointer ${
              !task.is_open
                ? "text-gray-400"
                : "text-red-500 hover:text-red-700"
            }`}
            onClick={() => onDelete(task.task_id)}
          />
        </div>
      </div>
    </div>
  );
};

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
    } else if (data) {
      setTasks(
        tasks.map((t) =>
          t.task_id === taskId ? { ...t, is_open: newStatus } : t
        )
      );

      // Create a new recurring task only when marking as complete
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
        } else if (newTaskData) {
          setTasks((prevTasks) => [...prevTasks, newTaskData[0]]);
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
        return addDays(date, 1).toISOString();
      case "weekly":
        return addWeeks(date, 1).toISOString();
      case "monthly":
        return addMonths(date, 1).toISOString();
      case "yearly":
        return addYears(date, 1).toISOString();
      default:
        return currentDueDate;
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

    for (const update of updates) {
      const { error } = await supabase
        .from("task")
        .update({ order: update.order })
        .eq("task_id", update.task_id);

      if (error) {
        console.error("Error updating task order:", error);
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
                index={index}
                onEdit={startEditing}
                onDelete={deleteTask}
                onToggleStatus={toggleTaskStatus}
                moveTask={moveTask}
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
                index={index}
                onEdit={startEditing}
                onDelete={deleteTask}
                onToggleStatus={toggleTaskStatus}
                moveTask={moveTask}
              />
            ))}
          </>
        )}
        {todoTasks.length === 0 && doneTasks.length === 0 && (
          <p className="text-center text-gray-500 mt-8">No tasks available.</p>
        )}
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
                value={editedTaskDescription}
                onChange={(e) => setEditedTaskDescription(e.target.value)}
                className="w-full mb-2"
                placeholder="Task details (optional)"
              />
              <Input
                type="date"
                value={editedDueDate}
                onChange={(e) => setEditedDueDate(e.target.value)}
                className="w-full mb-2"
              />
              <Input
                type="number"
                min="1"
                max="3"
                value={editedPriority}
                onChange={(e) => setEditedPriority(Number(e.target.value))}
                className="w-full mb-2"
                placeholder="Priority (1-3)"
              />
              <div className="flex justify-end space-x-2 mt-4">
                <Button onClick={() => saveEdit(editingTask)}>Save</Button>
                <Button onClick={cancelEditing} variant="outline">
                  Cancel
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
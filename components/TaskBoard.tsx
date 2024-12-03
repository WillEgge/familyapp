"use client";

import React from "react";
import TaskColumn from "@/components/TaskColumn";
import AddTaskForm from "@/components/AddTaskForm";
import { useBoard } from "@/utils/BoardProvider";

interface TaskBoardProps {
  memberId: number;
}

const TaskBoard: React.FC<TaskBoardProps> = ({ memberId }) => {
  const { todoTasks, doneTasks, moveTask, addTask, deleteTask } = useBoard();

  return (
    <div>
      <AddTaskForm memberId={memberId} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TaskColumn
          title="Todo"
          tasks={todoTasks}
          onMove={moveTask}
          onDelete={deleteTask}
        />
        <TaskColumn
          title="Done"
          tasks={doneTasks}
          onMove={moveTask}
          onDelete={deleteTask}
        />
      </div>
    </div>
  );
};

export default TaskBoard;
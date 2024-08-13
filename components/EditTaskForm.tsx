import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface EditTaskFormProps {
  editedDescription: string;
  editedTaskDescription: string;
  editedDueDate: string;
  editedPriority: number;
  onDescriptionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTaskDescriptionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDueDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPriorityChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function EditTaskForm({
  editedDescription,
  editedTaskDescription,
  editedDueDate,
  editedPriority,
  onDescriptionChange,
  onTaskDescriptionChange,
  onDueDateChange,
  onPriorityChange,
  onSave,
  onCancel,
}: EditTaskFormProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Edit Task</h2>
        <Input
          value={editedDescription}
          onChange={onDescriptionChange}
          className="w-full mb-2"
          placeholder="Task description"
        />
        <Input
          value={editedTaskDescription}
          onChange={onTaskDescriptionChange}
          className="w-full mb-2"
          placeholder="Task details (optional)"
        />
        <Input
          type="date"
          value={editedDueDate}
          onChange={onDueDateChange}
          className="w-full mb-2"
        />
        <Input
          type="number"
          min="1"
          max="3"
          value={editedPriority}
          onChange={onPriorityChange}
          className="w-full mb-2"
          placeholder="Priority (1-3)"
        />
        <div className="flex justify-end space-x-2 mt-4">
          <Button onClick={onSave}>Save</Button>
          <Button onClick={onCancel} variant="outline">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
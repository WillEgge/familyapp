"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
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
import { toast } from "sonner";

interface AddTaskFormProps {
  memberId: number;
}

interface Task {
  task_id: string | number;
  task_description: string;
  due_date: string;
  priority: number;
  is_open: boolean;
  assignee_id: number;
}

const priorityMapping = {
  low: 1,
  medium: 2,
  high: 3,
};

export default function AddTaskForm({ memberId }: AddTaskFormProps) {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      description: "",
      dueDate: "",
      priority: "low",
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClient();

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    const { error } = await supabase.from("task").insert([
      {
        task_description: data.description,
        assignee_id: memberId,
        due_date: data.dueDate,
        priority:
          priorityMapping[data.priority as keyof typeof priorityMapping],
        is_open: true,
      },
    ]);

    if (error) {
      console.error("Error adding task:", error);
      toast.error("Failed to add task. Please try again.");
    } else {
      reset();
      toast.success("Task added successfully!");
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-8">
      <Controller
        name="description"
        control={control}
        rules={{ required: "Description is required" }}
        render={({ field }) => (
          <Input {...field} placeholder="Task description" />
        )}
      />

      <Controller
        name="dueDate"
        control={control}
        rules={{ required: "Due date is required" }}
        render={({ field }) => <Input {...field} type="date" />}
      />

      <Controller
        name="priority"
        control={control}
        rules={{ required: "Priority is required" }}
        render={({ field }) => (
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        )}
      />

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Adding..." : "Add Task"}
      </Button>
    </form>
  );
}
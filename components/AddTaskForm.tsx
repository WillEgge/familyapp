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
  members: { member_id: number; first_name: string; last_name: string }[];
}

export default function AddTaskForm({ members }: AddTaskFormProps) {
  const { control, handleSubmit, reset } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClient();

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    const { error } = await supabase.from("task").insert([
      {
        task_description: data.description,
        assignee_id: parseInt(data.assignee),
        due_date: data.dueDate,
        priority: parseInt(data.priority),
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Controller
        name="description"
        control={control}
        defaultValue=""
        rules={{ required: "Description is required" }}
        render={({ field }) => (
          <Input {...field} placeholder="Task description" />
        )}
      />

      <Controller
        name="assignee"
        control={control}
        rules={{ required: "Assignee is required" }}
        render={({ field }) => (
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <SelectTrigger>
              <SelectValue placeholder="Select assignee" />
            </SelectTrigger>
            <SelectContent>
              {members.map((member) => (
                <SelectItem key={member.member_id} value={member.member_id.toString()}>
                  {member.first_name} {member.last_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />

      <Controller
        name="dueDate"
        control={control}
        rules={{ required: "Due date is required" }}
        render={({ field }) => (
          <Input {...field} type="date" />
        )}
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
              <SelectItem value="1">Low</SelectItem>
              <SelectItem value="2">Medium</SelectItem>
              <SelectItem value="3">High</SelectItem>
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
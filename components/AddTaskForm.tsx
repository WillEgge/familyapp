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
import { Task } from "@/types/task";

interface AddTaskFormProps {
  members?: Array<{ member_id: number; first_name: string; last_name: string }>;
  memberId?: number;
  hidePriority?: boolean;
}

const priorityMapping = {
  low: 1,
  medium: 2,
  high: 3,
};

export default function AddTaskForm({
  members,
  memberId,
  hidePriority = false,
}: AddTaskFormProps) {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      taskDescription: "",
      description: "",
      dueDate: "",
      priority: "low",
      assignee: memberId ? memberId.toString() : "",
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClient();

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    const { data: existingTasks, error: fetchError } = await supabase
      .from("task")
      .select('"order"')
      .order('"order"', { ascending: false })
      .limit(1);

    if (fetchError) {
      console.error("Error fetching existing tasks:", fetchError);
      toast.error("Failed to add task. Please try again.");
      setIsSubmitting(false);
      return;
    }

    const newOrder =
      existingTasks && existingTasks.length > 0
        ? existingTasks[0].order + 1
        : 0;

    const newTask: Partial<Task> = {
      task_description: data.taskDescription,
      assignee_id: parseInt(data.assignee),
      due_date: data.dueDate,
      priority: hidePriority
        ? 2
        : priorityMapping[data.priority as keyof typeof priorityMapping],
      is_open: true,
      order: newOrder,
    };

    // Only include description if it's not empty
    if (data.description && data.description.trim() !== "") {
      newTask.description = data.description;
    }

    const { error } = await supabase.from("task").insert([newTask]);

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
        name="taskDescription"
        control={control}
        rules={{ required: "Task description is required" }}
        render={({ field }) => (
          <Input {...field} placeholder="Task description" />
        )}
      />

      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <Input {...field} placeholder="Task details (optional)" />
        )}
      />

      <Controller
        name="dueDate"
        control={control}
        rules={{ required: "Due date is required" }}
        render={({ field }) => <Input {...field} type="date" />}
      />

      {!hidePriority && (
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
      )}

      {!memberId && members && (
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
                  <SelectItem
                    key={member.member_id}
                    value={member.member_id.toString()}
                  >
                    {member.first_name} {member.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      )}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Adding..." : "Add Task"}
      </Button>
    </form>
  );
}
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Task } from "@/types/task";
import { PrioritySelect } from "@/components/PrioritySelect";
import { RecurrenceSelect } from "@/components/RecurrenceSelect";
import { AssigneeSelect } from "@/components/AssigneeSelect";

interface AddTaskFormProps {
  members?: Array<{ member_id: number; first_name: string; last_name: string }>;
  memberId?: number;
  hidePriority?: boolean;
  onTaskAdded: (newTask: Task) => void;
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
  onTaskAdded,
}: AddTaskFormProps) {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      taskDescription: "",
      description: "",
      dueDate: "",
      priority: "medium",
      assignee: memberId ? memberId.toString() : "",
      recurrence: "none",
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
      title: data.taskDescription,
      assignee_id: parseInt(data.assignee),
      due_date: data.dueDate,
      priority: hidePriority
        ? 2
        : priorityMapping[data.priority as keyof typeof priorityMapping],
      is_open: true,
      order: newOrder,
      recurrence: data.recurrence,
    };

    if (data.description && data.description.trim() !== "") {
      newTask.description = data.description;
    }

    const { data: insertedTask, error } = await supabase
      .from("task")
      .insert([newTask])
      .select()
      .single();

    if (error) {
      console.error("Error adding task:", error);
      toast.error("Failed to add task. Please try again.");
    } else if (insertedTask) {
      reset();
      toast.success("Task added successfully!");
      onTaskAdded(insertedTask as Task);
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-8">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="taskDescription">Task Description</Label>
          <Controller
            name="taskDescription"
            control={control}
            rules={{ required: "Task description is required" }}
            render={({ field }) => (
              <Input
                id="taskDescription"
                {...field}
                placeholder="Enter task description"
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Task Details (optional)</Label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Input
                id="description"
                {...field}
                placeholder="Enter additional details"
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dueDate">Due Date</Label>
          <Controller
            name="dueDate"
            control={control}
            rules={{ required: "Due date is required" }}
            render={({ field }) => (
              <Input
                id="dueDate"
                {...field}
                type="date"
                placeholder="Select due date"
                onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) => {
                  if (!e.target.value) {
                    e.target.type = "text";
                  }
                }}
              />
            )}
          />
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
          {!hidePriority && (
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Controller
                name="priority"
                control={control}
                rules={{ required: "Priority is required" }}
                render={({ field }) => (
                  <PrioritySelect
                    id="priority"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select priority"
                  />
                )}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="recurrence">Recurrence</Label>
            <Controller
              name="recurrence"
              control={control}
              render={({ field }) => (
                <RecurrenceSelect
                  id="recurrence"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select recurrence"
                />
              )}
            />
          </div>
        </div>

        {!memberId && members && (
          <div className="space-y-2">
            <Label htmlFor="assignee">Assignee</Label>
            <Controller
              name="assignee"
              control={control}
              rules={{ required: "Assignee is required" }}
              render={({ field }) => (
                <AssigneeSelect
                  value={field.value}
                  onChange={field.onChange}
                  members={members}
                  placeholder="Select assignee"
                />
              )}
            />
          </div>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full xs:w-auto"
      >
        {isSubmitting ? "Adding..." : "Add Task"}
      </Button>
    </form>
  );
}
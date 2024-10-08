"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  addMemberSchema,
  AddMemberFormData,
} from "@/app/(protected)/add-member/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface AddMemberFormProps {
  houseId: string;
  primaryUserEmail: string;
  primaryUserLastName: string;
  onMemberAdded: (newMember: any) => void;
}

export default function AddMemberForm({
  houseId,
  primaryUserEmail,
  primaryUserLastName,
  onMemberAdded,
}: AddMemberFormProps) {
  const supabase = createClient();

  const form = useForm<AddMemberFormData>({
    resolver: zodResolver(addMemberSchema),
    defaultValues: {
      first_name: "",
    },
  });

  const onSubmit = async (data: AddMemberFormData) => {
    try {
      console.log("Starting family member creation process");

      const uniqueIdentifier =
        Date.now().toString(36) + Math.random().toString(36).substr(2);
      const generatedEmail = `${data.first_name.toLowerCase()}.${uniqueIdentifier}@family.${
        primaryUserEmail.split("@")[1]
      }`;

      // Generate a random avatar color
      const avatarColor = `#${Math.floor(Math.random() * 16777215).toString(
        16
      )}`;

      const { data: memberData, error: memberError } = await supabase
        .from("member")
        .insert({
          first_name: data.first_name,
          last_name: primaryUserLastName,
          email: generatedEmail,
          house_id: houseId,
          is_primary: false,
          avatar_color: avatarColor,
          active: true,
        })
        .select()
        .single();

      if (memberError) {
        throw memberError;
      }

      console.log("Member added successfully:", memberData);

      toast.success("Family member added successfully");
      form.reset();

      onMemberAdded(memberData);
    } catch (error: unknown) {
      console.error("Full error object:", error);
      if (error instanceof Error) {
        toast.error("Error adding family member: " + error.message);
      } else {
        toast.error("An unknown error occurred while adding family member");
      }
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 w-full max-w-md"
      >
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Adding..." : "Add Family Member"}
        </Button>
      </form>
    </Form>
  );
}
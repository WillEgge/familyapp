"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { addMemberSchema, AddMemberFormData } from "@/app/add-member/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function AddMemberForm({ houseId }: { houseId: string }) {
  const supabase = createClient();

  const form = useForm<AddMemberFormData>({
    resolver: zodResolver(addMemberSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: AddMemberFormData) => {
    try {
      console.log("Starting family member creation process");

      // First, check if the email already exists in the member table
      const { data: existingMember, error: checkError } = await supabase
        .from("member")
        .select("email")
        .eq("email", data.email)
        .single();

      if (checkError && checkError.code !== "PGRST116") {
        // PGRST116 means no rows returned, which is what we want
        console.error("Error checking existing member:", checkError);
        throw checkError;
      }

      if (existingMember) {
        throw new Error("A member with this email already exists");
      }

      // Add the new member to the member table
      const { data: memberData, error: memberError } = await supabase
        .from("member")
        .insert({
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          house_id: houseId,
          is_primary: false,
        })
        .select()
        .single();

      if (memberError) {
        console.error("Member Insert Error:", memberError);
        throw memberError;
      }

      console.log("Member added successfully:", memberData);

      // Now, create the auth user without signing them in
      const { error: authError } = await supabase.auth.admin.createUser({
        email: data.email,
        password: data.password,
        email_confirm: true,
      });

      if (authError) {
        console.error("Auth Error:", authError);
        // If there's an error creating the auth user, we should delete the member
        await supabase.from("member").delete().eq("id", memberData.id);
        throw authError;
      }

      toast.success("Family member added successfully");
      form.reset();
    } catch (error) {
      console.error("Full error object:", error);
      toast.error(
        "Error adding family member: " +
          (error.message || error.error_description || "Unknown error")
      );
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

        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input {...field} type="password" />
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

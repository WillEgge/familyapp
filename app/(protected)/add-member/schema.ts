import { z } from "zod";

export const addMemberSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
});

export type AddMemberFormData = z.infer<typeof addMemberSchema>;
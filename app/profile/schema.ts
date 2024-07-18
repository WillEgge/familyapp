import { z } from "zod";

export const profileUpdateSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
});

export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
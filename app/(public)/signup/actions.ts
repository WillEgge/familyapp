"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { signUpSchema, SignUpFormData } from "./schema";
import type { Database } from "@/types/supabase";

type SignUpResponse =
  | { success: true; redirectTo: string }
  | { success: false; error: string };

export const signUpProcess = async (
  formData: SignUpFormData
): Promise<SignUpResponse> => {
  // Input validation
  const result = signUpSchema.safeParse(formData);
  if (!result.success) {
    console.error("Input validation failed:", result.error);
    return { success: false, error: "Invalid input data" };
  }

  const supabase = createClient();

  try {
    const { error, data } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          first_name: formData.first_name,
          last_name: formData.last_name,
        },
      },
    });

    if (error) {
      console.error("Supabase auth error:", error);
      if (error.message.includes("User already registered")) {
        return {
          success: false,
          error: "This email is already registered. Please try signing in.",
        };
      }
      return {
        success: false,
        error: "An error occurred during sign up. Please try again.",
      };
    }

    if (data.user) {
      console.log("Sign up successful, user:", data.user.id);
      return { success: true, redirectTo: "/" };
    } else {
      console.error("No user data received from Supabase");
      return {
        success: false,
        error: "An unexpected error occurred. Please try again.",
      };
    }
  } catch (error) {
    console.error("Unexpected error during sign up:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    };
  }
};

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/signup");
}

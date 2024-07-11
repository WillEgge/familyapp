// app/signup/actions.ts

"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
// import { redirect } from "next/navigation";
import { signUpSchema, SignUpFormData } from "./schema";
import type { Database } from "@/utils/supabase/supabase";

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

  const supabase = createClient<Database>();

  try {
    const { error, data } = await supabase.auth.signUpWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      console.error("Supabase auth error:", error);
      switch (error.status) {
        case 400:
          return {
            success: false,
            error: "Invalid email or password. Please try again.",
          };
        case 429:
          return {
            success: false,
            error: "Too many attempts. Please try again later.",
          };
        default:
          return {
            success: false,
            error: "An error occurred during sign in. Please try again x.",
          };
      }
    }

    if (data.user) {
      console.log("Sign in successful, user:", data.user.id);
      // Instead of redirecting here, we'll return a success response
      return { success: true, redirectTo: "/" };
    } else {
      console.error("No user data received from Supabase");
      return {
        success: false,
        error: "No user data received. Please try again.",
      };
    }
  } catch (error) {
    console.error("Unexpected error during sign in:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    };
  }
};

export async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    redirect('/signup')
}
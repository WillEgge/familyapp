"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, SignInFormData } from "./schema";
import { signInProcess } from "./actions";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CustomInput } from "@/components/CustomInput";
import { useRouter } from "next/navigation";
import Link from "next/link";

type SignInFormProps = {
  searchParams: { message?: string };
};

export function SignInForm({ searchParams }: SignInFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      const result = await signInProcess(data);
      if (result.success) {
        // Use the router to redirect on the client side
        router.push(result.redirectTo);
      } else {
        setServerError(result.error);
      }
    } catch (error) {
      console.error("Sign-in error:", error);
      setServerError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">
          Sign In
        </h2>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <CustomInput
                  placeholder="you@example.com"
                  {...field}
                  type="email"
                  error={!!form.formState.errors.email}
                />
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
                <div className="relative">
                  <CustomInput
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    {...field}
                    error={!!form.formState.errors.password}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Eye className="h-4 w-4" aria-hidden="true" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full mt-4">
          {form.formState.isSubmitting ? "Signing In..." : "Sign In"}
        </Button>
        <div className="mt-4">
          <p className="text-center text-gray-600">
            If you don't have an account,{" "}
            <Link
              href="/signup"
              className="text-indigo-500 hover:text-indigo-600 font-semibold"
            >
              Sign Up
            </Link>{" "}
            now!
          </p>
        </div>
      </form>

      {serverError && (
        <p
          className="mt-4 p-4 bg-red-100 text-red-700 text-center rounded"
          role="alert"
        >
          {serverError}
        </p>
      )}

      {searchParams?.message && (
        <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
          {searchParams.message}
        </p>
      )}
    </Form>
  );
}

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, SignUpFormData } from "./schema";
import { signUpProcess } from "./actions";
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

type SignUpFormProps = {
  searchParams: { message?: string };
};

export function SignUpForm({ searchParams }: SignUpFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      const result = await signUpProcess(data);
      if (result.success) {
        router.push(result.redirectTo);
      } else {
        setServerError(result.error);
      }
    } catch (error) {
      console.error("Sign-up error:", error);
      setServerError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-200"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">
          Sign Up
        </h2>

        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <CustomInput
                  placeholder="First Name"
                  {...field}
                  type="text"
                  error={!!form.formState.errors.first_name}
                />
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
                <CustomInput
                  placeholder="Last Name"
                  {...field}
                  type="text"
                  error={!!form.formState.errors.last_name}
                />
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
          {form.formState.isSubmitting ? "Signing Up..." : "Sign Up"}
        </Button>
        <div className="mt-4">
          <p className="text-center text-gray-600">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="text-indigo-500 hover:text-indigo-600 font-semibold"
            >
              Sign In
            </Link>
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
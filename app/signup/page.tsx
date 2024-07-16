// app/signup/page.tsx

import Link from "next/link";
import { SignUpForm } from "./SignUpForm";

export default function SignUp({
  searchParams,
}: {
  searchParams: { message?: string };
}) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <SignUpForm searchParams={searchParams} />
    </div>
  );
}

// app/signin/page.tsx

import Link from "next/link";
import { SignInForm } from "./SignInForm";

export default function SignIn({
  searchParams,
}: {
  searchParams: { message?: string };
}) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <SignInForm searchParams={searchParams} />
    </div>
  );
}

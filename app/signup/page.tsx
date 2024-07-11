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
      {/* <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2"> */}
      <Link
        href="/"
        className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
      >
        {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>{" "}
        Back
      </Link>
      <SignUpForm searchParams={searchParams} />
    </div>
  );
}
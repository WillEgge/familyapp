import { SignUpForm } from "./SignUpForm";

export default function SignUp({
  searchParams,
}: {
  searchParams: { message?: string };
}) {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
      <SignUpForm searchParams={searchParams} />
    </div>
  );
}
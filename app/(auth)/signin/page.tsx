import { SignInForm } from "./SignInForm";

export default function SignIn({
  searchParams,
}: {
  searchParams: { message?: string };
}) {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
      <SignInForm searchParams={searchParams} />
    </div>
  );
}
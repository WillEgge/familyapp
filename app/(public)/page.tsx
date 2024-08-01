import type { Metadata } from "next";
import Image from "next/image";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "FamilyHub | Simplify Your Family's Task Management",
  description:
    "FamilyHub helps families organize tasks, manage schedules, and collaborate effectively. Sign up for free and start streamlining your family life today!",
};

export default async function Index() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <div className="w-full max-w-4xl flex justify-center items-center flex-col gap-8 mt-16">
        <h1 className="text-5xl font-bold text-center">Welcome to FamilyHub</h1>
        <p className="text-2xl text-center max-w-2xl">
          Simplify your family's task management and boost collaboration
        </p>
      </div>

      {!user && (
        <div className="flex justify-center items-center gap-4">
          <a
            href="/signin"
            className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
          >
            Sign In
          </a>
          <a
            href="/signup"
            className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
          >
            Sign Up
          </a>
        </div>
      )}

      <div className="w-full max-w-5xl flex flex-col gap-16">
        <section className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h2 className="text-3xl font-semibold mb-4">
              Effortless Task Management
            </h2>
            <p>
              Create, assign, and track tasks with ease. FamilyHub's intuitive
              interface makes managing household responsibilities a breeze for
              every family member.
            </p>
          </div>
          <div className="flex-1">
            <Image
              src="/task-management.png"
              alt="Task Management Interface"
              width={500}
              height={300}
              className="rounded-lg shadow-md"
            />
          </div>
        </section>

        <section className="flex flex-col md:flex-row-reverse items-center gap-8">
          <div className="flex-1">
            <h2 className="text-3xl font-semibold mb-4">
              Shared Family Calendar
            </h2>
            <p>
              Keep everyone on the same page with our shared family calendar.
              Coordinate schedules, set reminders, and never miss an important
              family event again.
            </p>
          </div>
          <div className="flex-1">
            <Image
              src="/family-calendar.png"
              alt="Shared Family Calendar"
              width={500}
              height={300}
              className="rounded-lg shadow-md"
            />
          </div>
        </section>

        <section className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h2 className="text-3xl font-semibold mb-4">Progress Tracking</h2>
            <p>
              Visualize your family's productivity with intuitive progress
              tracking. Celebrate achievements and identify areas for
              improvement together.
            </p>
          </div>
          <div className="flex-1">
            <Image
              src="/progress-tracking.png"
              alt="Progress Tracking Dashboard"
              width={500}
              height={300}
              className="rounded-lg shadow-md"
            />
          </div>
        </section>
      </div>

      <div className="mb-16">
        <a
          href="/signup"
          className="py-3 px-6 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover text-lg font-semibold"
        >
          Get Started with FamilyHub
        </a>
      </div>
    </div>
  );
}

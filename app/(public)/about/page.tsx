import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About FamilyHub | Your Family Task Management Solution",
  description:
    "Learn about FamilyHub, the all-in-one solution for managing your family's tasks, schedules, and responsibilities.",
};

export const generateStaticParams = async () => {
  return [];
};

export const revalidate = 3600;

export default function About() {
  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <div className="w-full max-w-4xl flex justify-center items-center flex-col gap-8 mt-16">
        <h1 className="text-4xl font-bold">About FamilyHub</h1>
        <p className="text-xl text-center max-w-2xl">
          FamilyHub is your go-to platform for seamless family task management
          and coordination.
        </p>
      </div>

      <div className="w-full max-w-4xl flex flex-col gap-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p>
            At FamilyHub, we believe in empowering families to work together
            efficiently and harmoniously. Our mission is to simplify household
            management, enhance communication, and foster a sense of shared
            responsibility among family members.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Intuitive task assignment and tracking</li>
            <li>Shared family calendar for better scheduling</li>
            <li>Customizable task categories and priorities</li>
            <li>Progress tracking and completion notifications</li>
            <li>User-friendly interface for all age groups</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why Choose FamilyHub?</h2>
          <p>
            FamilyHub stands out with its focus on family collaboration, ease of
            use, and comprehensive feature set. Whether you're managing chores,
            coordinating schedules, or working towards family goals, FamilyHub
            is designed to make family life more organized and enjoyable.
          </p>
        </section>
      </div>

      <div className="mb-16">
        <a
          href="/signup"
          className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
        >
          Get Started with FamilyHub
        </a>
      </div>
    </div>
  );
}

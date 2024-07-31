import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";

export default async function CalendarPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <div className="w-full max-w-4xl flex justify-center items-center flex-col gap-8 mt-16">
        <h1 className="text-4xl font-bold">Family Calendar</h1>
        <p className="text-xl text-center max-w-2xl">
          View and manage your family's schedule here.
        </p>
      </div>

      <div className="w-full max-w-4xl">
        <Calendar
          mode="single"
          selected={new Date()}
          className="rounded-md border"
        />
      </div>

      <div className="w-full max-w-4xl">
        <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
        <ul className="space-y-2">
          <li className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-medium">Event Title</h3>
            <p>Date: [Event Date]</p>
            <p>Time: [Event Time]</p>
          </li>
          {/* Add more event items as needed */}
        </ul>
      </div>
    </div>
  );
}

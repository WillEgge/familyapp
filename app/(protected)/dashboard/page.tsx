import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/signin');
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <div className="w-full max-w-4xl flex justify-center items-center flex-col gap-8 mt-16">
        <h1 className="text-4xl font-bold">Welcome to Your Dashboard</h1>
        <p className="text-xl text-center max-w-2xl">
          Manage your family tasks and schedule from here.
        </p>
      </div>

      <div className="w-full max-w-4xl flex flex-col gap-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Quick Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-medium">Tasks</h3>
              <p>You have X tasks pending</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-medium">Upcoming Events</h3>
              <p>Next event: [Event Name]</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
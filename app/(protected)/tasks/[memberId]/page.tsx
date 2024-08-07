import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
import AddTaskForm from "@/components/AddTaskForm";

const TaskList = dynamic(() => import("@/components/TaskList"), { ssr: false });

export default async function MemberTasks({
  params,
}: {
  params: { memberId: string };
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }

  const memberId = parseInt(params.memberId);

  // Fetch member details
  const { data: member, error: memberError } = await supabase
    .from("member")
    .select("*")
    .eq("member_id", memberId)
    .single();

  if (memberError) {
    console.error("Error fetching member:", memberError);
    return <div>Error loading member information. Please try again later.</div>;
  }

  // Fetch tasks for the member
  const { data: tasks, error: tasksError } = await supabase
    .from("task")
    .select("*")
    .eq("assignee_id", memberId)
    .order("due_date");

  if (tasksError) {
    console.error("Error fetching tasks:", tasksError);
    return <div>Error loading tasks. Please try again later.</div>;
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-8 items-center">
      <div className="w-full max-w-4xl mt-16">
        <h1 className="text-4xl font-bold mb-8">
          Tasks for {member.first_name} {member.last_name}
        </h1>
        <AddTaskForm memberId={memberId} />
        <TaskList tasks={tasks} memberId={memberId} />
      </div>
    </div>
  );
}
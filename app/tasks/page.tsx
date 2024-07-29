import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Task {
  task_id: string | number;
  task_description: string;
  due_date: string;
  priority: string;
  is_open: boolean;
}

export default async function TasksPage() {
  const cookieStore = cookies();
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    console.error("Error fetching user:", userError);
    return <div>Error loading user information. Please try again later.</div>;
  }

  if (!user) {
    return <div>Please log in to view tasks.</div>;
  }

  const { data: currentMember, error: currentMemberError } = await supabase
    .from("member")
    .select("house_id")
    .eq("email", user.email)
    .single();

  if (currentMemberError) {
    console.error("Error fetching current member:", currentMemberError);
    return <div>Error loading user information. Please try again later.</div>;
  }

  const { data: members, error: membersError } = await supabase
    .from("member")
    .select("*")
    .eq("house_id", currentMember.house_id)
    .order("last_name, first_name");

  if (membersError) {
    console.error("Error fetching members:", membersError);
    return <div>Error loading members. Please try again later.</div>;
  }

  const { data: tasks, error: tasksError } = await supabase
    .from("task")
    .select("*")
    .in(
      "assignee_id",
      members.map((m) => m.member_id)
    )
    .order("due_date");

  if (tasksError) {
    console.error("Error fetching tasks:", tasksError);
    return <div>Error loading tasks. Please try again later.</div>;
  }

  const tasksByAssignee: { [key: string]: Task[] } = tasks.reduce(
    (acc, task) => {
      if (!acc[task.assignee_id]) {
        acc[task.assignee_id] = [];
      }
      acc[task.assignee_id].push(task);
      return acc;
    },
    {} as { [key: string]: Task[] }
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Family Tasks</h1>
      <Accordion type="single" collapsible className="w-full">
        {members.map((member) => (
          <AccordionItem
            key={member.member_id}
            value={member.member_id.toString()}
          >
            <AccordionTrigger className="text-xl font-semibold">
              {member.first_name} {member.last_name}
            </AccordionTrigger>
            <AccordionContent>
              {tasksByAssignee[member.member_id] &&
              tasksByAssignee[member.member_id].length > 0 ? (
                <ul className="list-disc pl-5">
                  {tasksByAssignee[member.member_id].map((task: Task) => (
                    <li key={task.task_id} className="mb-2">
                      <div>{task.task_description}</div>
                      <div className="text-sm text-gray-600">
                        Due: {new Date(task.due_date).toLocaleDateString()}
                        {" | "}
                        Priority: {task.priority}
                        {" | "}
                        Status: {task.is_open ? "Open" : "Closed"}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No tasks assigned.</p>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

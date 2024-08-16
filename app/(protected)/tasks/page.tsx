import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import dynamic from "next/dynamic";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import AddTaskForm from "@/components/AddTaskForm";
import { Task } from "@/types/task";

const TaskList = dynamic(() => import("@/components/TaskList"), { ssr: false });

interface Member {
  member_id: number;
  first_name: string;
  last_name: string;
  email: string;
  house_id: string;
}

const fetchTasks = async (members: Member[]): Promise<Task[]> => {
  const cookieStore = cookies();
  const supabase = createClient();

  const { data: tasks, error: tasksError } = await supabase
    .from("task")
    .select("*")
    .in(
      "assignee_id",
      members.map((m) => m.member_id)
    )
    .order('"order"');

  if (tasksError) {
    console.error("Error fetching tasks:", tasksError);
    return [];
  }

  return tasks as Task[];
};

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

  const tasks = await fetchTasks(members);

  const tasksByAssignee: { [key: number]: Task[] } = tasks.reduce(
    (acc, task) => {
      if (!acc[task.assignee_id]) {
        acc[task.assignee_id] = [];
      }
      acc[task.assignee_id].push(task);
      return acc;
    },
    {} as { [key: number]: Task[] }
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Family Tasks</h1>
      <AddTaskForm members={members} hidePriority={true} />
      <Accordion type="single" collapsible className="w-full mt-8">
        {members.map((member) => (
          <AccordionItem
            key={member.member_id}
            value={member.member_id.toString()}
          >
            <AccordionTrigger className="text-xl font-semibold">
              {member.first_name} {member.last_name}
            </AccordionTrigger>
            <AccordionContent>
              <div className="bg-gray-100 p-4 rounded-md">
                <TaskList
                  initialTasks={tasksByAssignee[member.member_id] || []}
                  memberId={member.member_id}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import {
  FamilyMembersList,
  FamilyMember,
} from "@/components/FamilyMembersList";

export default async function Dashboard() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }

  const { data: currentMember, error: currentMemberError } = await supabase
    .from("member")
    .select("house_id, is_primary")
    .eq("email", user.email)
    .single();

  if (currentMemberError) {
    console.error("Error fetching current member:", currentMemberError);
    return <div>Error loading user information. Please try again later.</div>;
  }

  const { data: familyMembersData, error: familyMembersError } = await supabase
    .from("member")
    .select(
      `
      *,
      tasks:task(*)
    `
    )
    .eq("house_id", currentMember.house_id)
    .eq("active", true)
    .order("first_name");

  if (familyMembersError) {
    console.error("Error fetching family members:", familyMembersError);
    return <div>Error loading family members. Please try again later.</div>;
  }

  const familyMembers: FamilyMember[] = familyMembersData.map((member: any) => {
    const todoCount = member.tasks.filter((task: any) => task.is_open).length;
    const doneCount = member.tasks.filter((task: any) => !task.is_open).length;
    return {
      ...member,
      todo_count: todoCount,
      done_count: doneCount,
    };
  });

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <div className="w-full max-w-4xl flex justify-center items-center flex-col gap-8 mt-16">
        <h1 className="text-4xl font-bold">Family Dashboard</h1>
        <FamilyMembersList
          familyMembers={familyMembers}
          isPrimaryMember={currentMember.is_primary}
        />
      </div>
    </div>
  );
}
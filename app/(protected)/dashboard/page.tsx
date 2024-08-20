import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface FamilyMember {
  member_id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar_color?: string;
  is_primary: boolean;
  active: boolean;
}

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
    .select("house_id")
    .eq("email", user.email)
    .single();

  if (currentMemberError) {
    console.error("Error fetching current member:", currentMemberError);
    return <div>Error loading user information. Please try again later.</div>;
  }

  const { data: familyMembers, error: familyMembersError } = await supabase
    .from("member")
    .select("*")
    .eq("house_id", currentMember.house_id)
    .eq("active", true)
    .order("first_name");

  if (familyMembersError) {
    console.error("Error fetching family members:", familyMembersError);
    return <div>Error loading family members. Please try again later.</div>;
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <div className="w-full max-w-4xl flex justify-center items-center flex-col gap-8 mt-16">
        <h1 className="text-4xl font-bold">Family Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {familyMembers.map((member: FamilyMember) => (
            <Link
              key={member.member_id}
              href={`/tasks/${member.member_id}`}
              className="p-4 border rounded-lg hover:bg-gray-100 transition-colors flex items-center space-x-4"
            >
              <Avatar className="h-12 w-12">
                <AvatarFallback
                  style={{ backgroundColor: member.avatar_color }}
                >
                  {member.first_name[0]}
                  {member.last_name[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">
                  {member.first_name} {member.last_name}
                </h2>
                <p className="text-gray-600">
                  {member.is_primary ? "Primary Member" : "Family Member"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
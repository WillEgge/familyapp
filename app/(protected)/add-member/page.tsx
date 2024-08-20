import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import FamilyMemberManager from "@/components/FamilyMemberManager";

interface FamilyMember {
  member_id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar_color?: string;
  is_primary: boolean;
  active: boolean;
}

export default async function AddMember() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="flex-1 flex flex-col gap-6 items-center">
        <h1 className="text-2xl font-bold">Unauthorized</h1>
        <p>
          You must be logged in as a primary member to manage family members.
        </p>
      </div>
    );
  }

  const { data: memberData } = await supabase
    .from("member")
    .select("is_primary, house_id, last_name")
    .eq("email", user.email)
    .single();

  if (!memberData) {
    return (
      <div className="flex-1 flex flex-col gap-6 items-center">
        <h1 className="text-2xl font-bold">Error</h1>
        <p>Unable to fetch member data.</p>
      </div>
    );
  }

  const { data: familyMembersData } = await supabase
    .from("member")
    .select(
      "member_id, first_name, last_name, email, avatar_color, is_primary, active"
    )
    .eq("house_id", memberData.house_id)
    .order("first_name");

  const familyMembers =
    familyMembersData?.filter((member) => !member.is_primary) || [];

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <div className="w-full max-w-4xl flex justify-center items-center flex-col gap-8">
        <h1 className="text-4xl font-bold">Manage Family Members</h1>
        <FamilyMemberManager
          initialMembers={familyMembers}
          houseId={memberData.house_id}
          primaryUserEmail={user.email ?? ""}
          primaryUserLastName={memberData.last_name}
        />
      </div>
    </div>
  );
}
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import AddMemberForm from "@/components/AddMemberForm";

export default async function AddMember() {
  const cookieStore = cookies();
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isPrimaryMember = false;
  let houseId = null;
  let primaryUserLastName = null;
  let familyMembers = [];

  if (user) {
    const { data: memberData, error: memberError } = await supabase
      .from("member")
      .select("is_primary, house_id, last_name")
      .eq("email", user.email)
      .single();

    if (memberError) {
      console.error("Error fetching member data:", memberError);
    } else {
      isPrimaryMember = memberData.is_primary;
      houseId = memberData.house_id;
      primaryUserLastName = memberData.last_name;

      // Fetch family members
      const { data: familyMembersData, error: familyMembersError } =
        await supabase
          .from("member")
          .select("first_name")
          .eq("house_id", houseId)
          .order("first_name");

      if (familyMembersError) {
        console.error("Error fetching family members:", familyMembersError);
      } else {
        familyMembers = familyMembersData;
      }
    }
  }

  if (!user || !isPrimaryMember) {
    return (
      <div className="flex-1 flex flex-col gap-6 items-center">
        <h1 className="text-2xl font-bold">Unauthorized</h1>
        <p>You must be logged in as a primary member to add family members.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-6 items-center">
      <h1 className="text-2xl font-bold">Add Family Member</h1>
      <AddMemberForm
        houseId={houseId}
        primaryUserEmail={user.email}
        primaryUserLastName={primaryUserLastName}
      />
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Current Family Members:</h2>
        <ul className="list-disc pl-5">
          {familyMembers.map((member, index) => (
            <li key={index}>{member.first_name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

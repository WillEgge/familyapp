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
    </div>
  );
}

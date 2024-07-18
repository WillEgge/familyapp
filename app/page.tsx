import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export default async function Index() {
  const cookieStore = cookies();
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let memberHouseName = null;
  if (user) {
    // Fetch the member's house information
    const { data: memberData, error: memberError } = await supabase
      .from("member")
      .select("house_id")
      .eq("email", user.email)
      .single();

    if (memberError) {
      console.error("Error fetching member data:", memberError);
    } else if (memberData?.house_id) {
      // Fetch the house name
      const { data: houseData, error: houseError } = await supabase
        .from("house")
        .select("house_name")
        .eq("house_id", memberData.house_id)
        .single();

      if (houseError) {
        console.error("Error fetching house data:", houseError);
      } else {
        memberHouseName = houseData?.house_name;
      }
    }
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <div className="w-full max-w-4xl flex justify-center items-center flex-col gap-8 mt-16">
        <h1 className="text-4xl font-bold">Welcome to FamilyApp</h1>
        {user ? (
          <div className="text-center">
            <p className="text-2xl">Hello, {user.email}!</p>
            {memberHouseName && (
              <p className="text-xl mt-2">Your house: {memberHouseName}</p>
            )}
          </div>
        ) : (
          <p className="text-2xl">
            Sign in to manage your family tasks and activities
          </p>
        )}
      </div>

      {/* Add more content for your home page here */}
    </div>
  );
}

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import ProfileForm from '@/components/ProfileForm';

export default async function Profile() {
  const cookieStore = cookies();
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  let memberData = null;
  if (user) {
    const { data, error } = await supabase
      .from('member')
      .select('first_name, last_name, is_primary, house_id')
      .eq('email', user.email)
      .single();

    if (error) {
      console.error("Error fetching member data:", error);
    } else {
      memberData = data;
    }
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <div className="w-full max-w-md mx-auto mt-10">
        <h1 className="text-2xl font-bold mb-5">Profile</h1>
        <ProfileForm user={user} initialData={memberData} />
      </div>
    </div>
  );
}
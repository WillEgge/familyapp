// components/FamilyMembersList.tsx
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export interface FamilyMember {
  member_id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar_color?: string;
  is_primary: boolean;
  active: boolean;
  todo_count: number;
  done_count: number;
}

interface FamilyMembersListProps {
  familyMembers: FamilyMember[];
}

export function FamilyMembersList({ familyMembers }: FamilyMembersListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {familyMembers.map((member) => (
        <Link
          key={member.member_id}
          href={`/tasks/${member.member_id}`}
          className="p-4 border rounded-lg hover:bg-gray-100 transition-colors flex flex-col items-center space-y-4"
        >
          <Avatar className="h-16 w-16">
            <AvatarFallback
              style={{ backgroundColor: member.avatar_color }}
              className="text-2xl"
            >
              {member.first_name[0]}
              {member.last_name[0]}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h2 className="text-xl font-semibold">
              {member.first_name} {member.last_name}
            </h2>
            <p className="text-gray-600">
              {member.is_primary ? "Primary Member" : "Family Member"}
            </p>
            <div className="mt-2">
              <span className="text-blue-500 font-medium">
                {member.todo_count} todo
              </span>
              <span className="mx-2">|</span>
              <span className="text-green-500 font-medium">
                {member.done_count} done
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
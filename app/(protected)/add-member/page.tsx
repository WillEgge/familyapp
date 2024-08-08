"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import AddMemberForm from "@/components/AddMemberForm";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";

interface FamilyMember {
  member_id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar_color?: string;
  is_primary: boolean;
}

export default function AddMember() {
  const [user, setUser] = useState<User | null>(null);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [editingMember, setEditingMember] = useState<number | null>(null);
  const [editedName, setEditedName] = useState({ first: "", last: "" });
  const [houseId, setHouseId] = useState<string>("");
  const [primaryUserLastName, setPrimaryUserLastName] = useState<string>("");
  const supabase = createClient();
  const editRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchUserAndMembers();
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event: MouseEvent) => {
    if (editRef.current && !editRef.current.contains(event.target as Node)) {
      setEditingMember(null);
    }
  };

  const fetchUserAndMembers = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);

    if (user) {
      const { data: memberData } = await supabase
        .from("member")
        .select("is_primary, house_id, last_name")
        .eq("email", user.email)
        .single();

      if (memberData) {
        setHouseId(memberData.house_id);
        setPrimaryUserLastName(memberData.last_name);

        const { data: familyMembersData } = await supabase
          .from("member")
          .select("member_id, first_name, last_name, email, avatar_color, is_primary")
          .eq("house_id", memberData.house_id)
          .order("first_name");

        setFamilyMembers(familyMembersData?.filter(member => !member.is_primary) || []);
      }
    }
  };

  const handleDoubleClick = (member: FamilyMember) => {
    setEditingMember(member.member_id);
    setEditedName({ first: member.first_name, last: member.last_name });
  };

  const handleNameChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "first" | "last"
  ) => {
    setEditedName((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleNameSubmit = async () => {
    if (editingMember === null) return;

    const { data, error } = await supabase
      .from("member")
      .update({ first_name: editedName.first, last_name: editedName.last })
      .eq("member_id", editingMember);

    if (error) {
      toast.error("Failed to update name");
    } else {
      setFamilyMembers((members) =>
        members.map((m) =>
          m.member_id === editingMember
            ? { ...m, first_name: editedName.first, last_name: editedName.last }
            : m
        )
      );
      toast.success("Name updated successfully");
    }

    setEditingMember(null);
  };

  const handleDelete = async (memberId: number) => {
    if (confirm("Are you sure you want to delete this family member?")) {
      const { error } = await supabase
        .from("member")
        .delete()
        .eq("member_id", memberId);

      if (error) {
        toast.error("Failed to delete member");
      } else {
        setFamilyMembers((members) =>
          members.filter((m) => m.member_id !== memberId)
        );
        toast.success("Member deleted successfully");
      }
    }
  };

  if (!user) {
    return (
      <div className="flex-1 flex flex-col gap-6 items-center">
        <h1 className="text-2xl font-bold">Unauthorized</h1>
        <p>You must be logged in as a primary member to add family members.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <div className="w-full max-w-4xl flex justify-center items-center flex-col gap-8">
        <h1 className="text-4xl font-bold">Add Family Member</h1>
        {user && houseId && (
          <AddMemberForm
            houseId={houseId}
            primaryUserEmail={user.email ?? ""}
            primaryUserLastName={primaryUserLastName}
            onMemberAdded={fetchUserAndMembers}
          />
        )}
      </div>
      <div className="w-full max-w-4xl">
        <h2 className="text-2xl font-semibold mb-4">Current Family Members:</h2>
        {familyMembers.length === 0 ? (
          <p>No family members found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {familyMembers.map((member) => (
              <div
                key={member.member_id}
                className="p-4 border rounded-lg hover:bg-gray-100 transition-colors flex items-center space-x-4"
                onDoubleClick={() => handleDoubleClick(member)}
              >
                <Avatar className="h-12 w-12">
                  <AvatarFallback
                    style={{
                      backgroundColor: member.avatar_color || "#000000",
                    }}
                  >
                    {member.first_name[0]}
                    {member.last_name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                  {editingMember === member.member_id ? (
                    <div ref={editRef} className="flex flex-col gap-2">
                      <Input
                        value={editedName.first}
                        onChange={(e) => handleNameChange(e, "first")}
                        placeholder="First Name"
                        autoFocus
                      />
                      <Input
                        value={editedName.last}
                        onChange={(e) => handleNameChange(e, "last")}
                        placeholder="Last Name"
                      />
                      <Button onClick={handleNameSubmit}>Save</Button>
                    </div>
                  ) : (
                    <h2 className="text-xl font-semibold">
                      {member.first_name} {member.last_name}
                    </h2>
                  )}
                  <p className="text-gray-600">Family Member</p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(member.member_id)}
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
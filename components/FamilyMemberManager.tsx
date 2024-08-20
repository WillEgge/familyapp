"use client";

import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import AddMemberForm from "@/components/AddMemberForm";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FamilyMember {
  member_id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar_color?: string;
  is_primary: boolean;
  active: boolean;
}

interface FamilyMemberManagerProps {
  initialMembers: FamilyMember[];
  houseId: string;
  primaryUserEmail: string;
  primaryUserLastName: string;
}

export default function FamilyMemberManager({
  initialMembers,
  houseId,
  primaryUserEmail,
  primaryUserLastName,
}: FamilyMemberManagerProps) {
  const [familyMembers, setFamilyMembers] =
    useState<FamilyMember[]>(initialMembers);
  const supabase = createClient();

  const handleMemberAdded = (newMember: FamilyMember) => {
    setFamilyMembers([...familyMembers, newMember]);
  };

  const toggleMemberStatus = async (memberId: number, newStatus: boolean) => {
    const { data, error } = await supabase
      .from("member")
      .update({ active: newStatus })
      .eq("member_id", memberId)
      .select();

    if (error) {
      console.error("Error updating member status:", error);
      toast.error(
        `Failed to ${newStatus ? "reactivate" : "deactivate"} family member`
      );
    } else if (data) {
      setFamilyMembers(
        familyMembers.map((member) =>
          member.member_id === memberId
            ? { ...member, active: newStatus }
            : member
        )
      );
      toast.success(
        `Family member ${
          newStatus ? "reactivated" : "deactivated"
        } successfully`
      );
    }
  };

  const updateMemberName = async (
    memberId: number,
    firstName: string,
    lastName: string
  ) => {
    const { data, error } = await supabase
      .from("member")
      .update({ first_name: firstName, last_name: lastName })
      .eq("member_id", memberId)
      .select();

    if (error) {
      console.error("Error updating member name:", error);
      toast.error("Failed to update family member name");
    } else if (data) {
      setFamilyMembers(
        familyMembers.map((member) =>
          member.member_id === memberId
            ? { ...member, first_name: firstName, last_name: lastName }
            : member
        )
      );
      toast.success("Family member name updated successfully");
    }
  };

  const deleteMember = async (memberId: number) => {
    const { error } = await supabase
      .from("member")
      .delete()
      .eq("member_id", memberId);

    if (error) {
      console.error("Error deleting member:", error);
      toast.error("Failed to delete family member");
    } else {
      setFamilyMembers(
        familyMembers.filter((member) => member.member_id !== memberId)
      );
      toast.success("Family member deleted successfully");
    }
  };

  const activeMembers = familyMembers.filter((member) => member.active);
  const inactiveMembers = familyMembers.filter((member) => !member.active);

  return (
    <div>
      <AddMemberForm
        houseId={houseId}
        primaryUserEmail={primaryUserEmail}
        primaryUserLastName={primaryUserLastName}
        onMemberAdded={handleMemberAdded}
      />

      <Tabs defaultValue="active" className="mt-8">
        <TabsList>
          <TabsTrigger value="active">Active Members</TabsTrigger>
          <TabsTrigger value="inactive">Inactive Members</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          <h2 className="text-2xl font-semibold mb-4">Active Family Members</h2>
          {activeMembers.map((member) => (
            <MemberItem
              key={member.member_id}
              member={member}
              onStatusChange={toggleMemberStatus}
              onNameChange={updateMemberName}
              onDelete={deleteMember}
              actionText="Deactivate"
              actionVariant="destructive"
            />
          ))}
        </TabsContent>
        <TabsContent value="inactive">
          <h2 className="text-2xl font-semibold mb-4">
            Inactive Family Members
          </h2>
          {inactiveMembers.map((member) => (
            <MemberItem
              key={member.member_id}
              member={member}
              onStatusChange={toggleMemberStatus}
              onNameChange={updateMemberName}
              onDelete={deleteMember}
              actionText="Reactivate"
              actionVariant="default"
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface MemberItemProps {
  member: FamilyMember;
  onStatusChange: (memberId: number, newStatus: boolean) => Promise<void>;
  onNameChange: (
    memberId: number,
    firstName: string,
    lastName: string
  ) => Promise<void>;
  onDelete: (memberId: number) => Promise<void>;
  actionText: string;
  actionVariant: "default" | "destructive";
}

function MemberItem({
  member,
  onStatusChange,
  onNameChange,
  onDelete,
  actionText,
  actionVariant,
}: MemberItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(member.first_name);
  const [lastName, setLastName] = useState(member.last_name);

  const handleDoubleClick = () => {
    if (!member.is_primary) {
      setIsEditing(true);
    }
  };

  const handleNameSubmit = () => {
    onNameChange(member.member_id, firstName, lastName);
    setIsEditing(false);
  };

  return (
    <div className="flex justify-between items-center mb-4 p-2 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-4">
        <Avatar className="h-10 w-10">
          <AvatarFallback
            style={{ backgroundColor: member.avatar_color || "#000000" }}
          >
            {member.first_name[0]}
            {member.last_name[0]}
          </AvatarFallback>
        </Avatar>
        {isEditing ? (
          <div className="flex space-x-2">
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-24"
            />
            <Input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-24"
            />
            <Button onClick={handleNameSubmit} size="sm">
              Save
            </Button>
          </div>
        ) : (
          <span className="font-medium" onDoubleClick={handleDoubleClick}>
            {member.first_name} {member.last_name}
          </span>
        )}
      </div>
      <div className="flex space-x-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant={actionVariant} size="sm">
              {actionText}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will {actionText.toLowerCase()} {member.first_name}{" "}
                {member.last_name}.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() =>
                  onStatusChange(member.member_id, actionText === "Reactivate")
                }
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        {!member.active && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete {member.first_name}{" "}
                  {member.last_name} from the family.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(member.member_id)}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
}
"use client";

import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import AddMemberForm from "@/components/AddMemberForm";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  actionText: string;
  actionVariant: "default" | "destructive";
}

function MemberItem({
  member,
  onStatusChange,
  actionText,
  actionVariant,
}: MemberItemProps) {
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
        <span className="font-medium">
          {member.first_name} {member.last_name}
        </span>
      </div>
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
              {actionText === "Deactivate" &&
                " They will be removed from the dashboard and deleted after 24 hours if not reactivated."}
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
    </div>
  );
}
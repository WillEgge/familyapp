import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AssigneeSelectProps {
  value: string;
  onChange: (value: string) => void;
  members: Array<{ member_id: number; first_name: string; last_name: string }>;
}

export function AssigneeSelect({
  value,
  onChange,
  members,
}: AssigneeSelectProps) {
  return (
    <Select onValueChange={onChange} defaultValue={value}>
      <SelectTrigger>
        <SelectValue placeholder="Select assignee" />
      </SelectTrigger>
      <SelectContent>
        {members.map((member) => (
          <SelectItem
            key={member.member_id}
            value={member.member_id.toString()}
          >
            {member.first_name} {member.last_name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
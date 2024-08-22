import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PrioritySelectProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export function PrioritySelect({
  id,
  value,
  onChange,
  placeholder,
}: PrioritySelectProps) {
  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger id={id}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="low">Low Priority</SelectItem>
        <SelectItem value="medium">Medium Priority</SelectItem>
        <SelectItem value="high">High Priority</SelectItem>
      </SelectContent>
    </Select>
  );
}
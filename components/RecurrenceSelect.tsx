import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RecurrenceSelectProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export function RecurrenceSelect({
  id,
  value,
  onChange,
  placeholder,
}: RecurrenceSelectProps) {
  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger id={id}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">No Recurrence</SelectItem>
        <SelectItem value="daily">Daily</SelectItem>
        <SelectItem value="weekly">Weekly</SelectItem>
        <SelectItem value="monthly">Monthly</SelectItem>
        <SelectItem value="yearly">Yearly</SelectItem>
      </SelectContent>
    </Select>
  );
}

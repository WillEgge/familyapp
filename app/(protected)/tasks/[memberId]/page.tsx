"use client";

import React from "react";
import TaskBoard from "@/components/TaskBoard";
import { useParams } from "next/navigation";
import { useMember } from "@/hooks/useMember"; // Ensure this hook exists or remove its usage
import { BoardProvider } from "@/utils/BoardProvider";

const TaskPage = () => {
  const params = useParams();
  const memberId = Number(params.memberId);
  const { member, isLoading, error } = useMember(memberId);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error || !member) {
    return <p>Error loading member data.</p>;
  }

  return (
    <BoardProvider>
      <div>
        <h1>
          Tasks for {member.first_name} {member.last_name}
        </h1>
        <TaskBoard />
      </div>
    </BoardProvider>
  );
};

export default TaskPage;
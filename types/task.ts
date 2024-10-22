export interface Task {
  task_id: string | number;
  title: string;
 // position: number;
  //column_id: string;
  description: string | null;
  due_date: string;
  priority: number;
  is_open: boolean;
  assignee_id: number;
  order: number;
  recurrence: "none" | "daily" | "weekly" | "monthly" | "yearly" | null;
}

// export type ColumnType = {
//   id: string;
//   title: string;
//   tasks: Task[];
// };

// export type Board = {
//   title: string;
//   columns: ColumnType[];
// };

// export type BoardContextType = {
//   board: Board;
//   moveTask: (
//     id: number,
//     targetColumnId: string,
//     targetPosition: number
//   ) => void;
// };
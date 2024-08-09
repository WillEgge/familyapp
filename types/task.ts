export interface Task {
  task_id: string | number;
  title: string;
  description: string | null;
  due_date: string;
  priority: number;
  is_open: boolean;
  assignee_id: number;
  order: number;
}

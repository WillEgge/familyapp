export interface Task {
  task_id: string | number;
  task_description: string;
  due_date: string;
  priority: number;
  is_open: boolean;
  assignee_id: number;
  order: number;
}

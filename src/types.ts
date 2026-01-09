export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string;
  due_date: string | null;
  status: "pending" | "completed";
  priority: "low" | "medium" | "high";
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export type TaskStatus = "pending" | "completed";
export type TaskPriority = "low" | "medium" | "high";

import { useState } from "react";
import { Edit2, Trash2, Calendar, AlertCircle } from "lucide-react";
import type { Task } from "../../types";
import { useAppDispatch } from "../../store/hooks";
import { deleteTask } from "../../store/tasksSlice";
import { useToast } from "../toast/useToast";

interface TaskListProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
}

export const TaskList = ({ tasks, onEditTask }: TaskListProps) => {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this task?")) {
      return;
    }

    setDeletingId(id);
    try {
      await dispatch(deleteTask(id)).unwrap();
      showToast("Task deleted successfully!", "success");
    } catch (error) {
      showToast("Failed to delete task", "error");
      console.error("Delete error:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      case "medium":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    return status === "completed"
      ? "bg-blue-100 text-blue-800 border-blue-200"
      : "bg-slate-100 text-slate-800 border-slate-200";
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No due date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isOverdue = (dueDate: string | null, status: string) => {
    if (!dueDate || status === "completed") return false;
    return new Date(dueDate) < new Date();
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
          <AlertCircle className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No tasks yet
        </h3>
        <p className="text-gray-500">
          Get started by creating your first task!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`bg-white rounded-lg border-2 p-5 hover:shadow-md transition-all ${
            task.status === "completed" ? "border-blue-200" : "border-gray-200"
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3
                  className={`text-lg font-semibold ${
                    task.status === "completed"
                      ? "text-gray-500 line-through"
                      : "text-gray-900"
                  }`}
                >
                  {task.title}
                </h3>
                <span
                  className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${getPriorityColor(
                    task.priority
                  )}`}
                >
                  {task.priority}
                </span>
              </div>

              {task.description && (
                <p className="text-gray-600 mb-3 whitespace-pre-wrap">
                  {task.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span
                    className={
                      isOverdue(task.due_date, task.status)
                        ? "text-red-600 font-medium"
                        : ""
                    }
                  >
                    {formatDate(task.due_date)}
                    {isOverdue(task.due_date, task.status) && " (Overdue)"}
                  </span>
                </div>

                <span
                  className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${getStatusColor(
                    task.status
                  )}`}
                >
                  {task.status}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onEditTask(task)}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                title="Edit task"
              >
                <Edit2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDelete(task.id)}
                disabled={deletingId === task.id}
                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Delete task"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

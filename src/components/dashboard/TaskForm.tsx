import { useState, useEffect } from "react";
import { X, Plus, Edit } from "lucide-react";
import type { Task, TaskPriority, TaskStatus } from "../../types";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { createTask, updateTask } from "../../store/tasksSlice";
import { useToast } from "../toast/useToast";

interface TaskFormProps {
  task?: Task | null;
  onClose: () => void;
}

export const TaskForm = ({ task, onClose }: TaskFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<TaskStatus>("pending");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const userId = useAppSelector((state) => state.auth.userId);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setDueDate(task.due_date || "");
      setStatus(task.status);
      setPriority(task.priority);
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      showToast("Title is required", "error");
      return;
    }

    setLoading(true);

    try {
      if (task) {
        await dispatch(
          updateTask({
            id: task.id,
            updates: {
              title: title.trim(),
              description: description.trim(),
              due_date: dueDate || null,
              status,
              priority,
            },
          })
        ).unwrap();
        showToast("Task updated successfully!", "success");
      } else {
        if (!userId) {
          showToast("User not authenticated", "error");
          return;
        }
        await dispatch(
          createTask({
            user_id: userId,
            title: title.trim(),
            description: description.trim(),
            due_date: dueDate || null,
            status,
            priority,
          })
        ).unwrap();
        showToast("Task created successfully!", "success");
      }
      onClose();
    } catch (error) {
      showToast("Failed to save task", "error");
      console.error("Task save error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-slate-900 p-2 rounded-lg">
              {task ? (
                <Edit className="w-5 h-5 text-white" />
              ) : (
                <Plus className="w-5 h-5 text-white" />
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              {task ? "Edit Task" : "New Task"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-black px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
              placeholder="Enter task title"
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full text-black px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all resize-none"
              placeholder="Enter task description"
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="dueDate"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Due Date
              </label>
              <input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full text-black px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                disabled={loading}
              />
            </div>

            <div>
              <label
                htmlFor="status"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full text-black px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                disabled={loading}
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Priority
            </label>
            <div className="flex gap-3">
              {(["low", "medium", "high"] as TaskPriority[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  disabled={loading}
                  className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all ${
                    priority === p
                      ? p === "low"
                        ? "bg-green-600 text-white"
                        : p === "medium"
                        ? "bg-amber-500 text-white"
                        : "bg-red-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              disabled={loading}
            >
              {loading ? "Saving..." : task ? "Update Task" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

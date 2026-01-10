import { useEffect, useState, useMemo } from "react";
import { Plus, LogOut, Filter, ListTodo } from "lucide-react";
import type { Task, TaskPriority, TaskStatus } from "../../types";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { clearTasks, fetchTasks, selectAllTasks } from "../../store/tasksSlice";
import { logout } from "../../store/authSlice";
import { TaskList } from "./TaskList";
import { TaskForm } from "./TaskForm";
import { useToast } from "../toast/toast";

export const Dashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filterStatus, setFilterStatus] = useState<TaskStatus | "all">("all");
  const [filterPriority, setFilterPriority] = useState<TaskPriority | "all">(
    "all"
  );
  const [sortBy, setSortBy] = useState<"date" | "priority">("date");

  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const { email, userId } = useAppSelector((state) => state.auth);
  const tasks = useAppSelector(selectAllTasks);
  const loading = useAppSelector((state) => state.tasks.loading);

  useEffect(() => {
    if (userId) {
      dispatch(fetchTasks(userId));
    }
  }, [dispatch, userId]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearTasks());
    showToast("Logged out successfully", "info");
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  const handleNewTask = () => {
    setEditingTask(null);
    setShowForm(true);
  };

  const filteredAndSortedTasks = useMemo(() => {
    let filtered = [...tasks];

    if (filterStatus !== "all") {
      filtered = filtered.filter((task) => task.status === filterStatus);
    }

    if (filterPriority !== "all") {
      filtered = filtered.filter((task) => task.priority === filterPriority);
    }

    if (sortBy === "date") {
      filtered.sort((a, b) => {
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      });
    } else {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      filtered.sort(
        (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
      );
    }

    return filtered;
  }, [tasks, filterStatus, filterPriority, sortBy]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "completed").length;
    const pending = tasks.filter((t) => t.status === "pending").length;
    const high = tasks.filter(
      (t) => t.priority === "high" && t.status === "pending"
    ).length;

    return { total, completed, pending, high };
  }, [tasks]);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-slate-900 p-2 rounded-lg">
                <ListTodo className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Task Manager
                </h1>
                <p className="text-xs text-gray-500">{email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
            <p className="text-sm font-medium text-gray-600 mb-1">
              Total Tasks
            </p>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
            <p className="text-sm font-medium text-gray-600 mb-1">Completed</p>
            <p className="text-3xl font-bold text-blue-600">
              {stats.completed}
            </p>
          </div>
          <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
            <p className="text-sm font-medium text-gray-600 mb-1">Pending</p>
            <p className="text-3xl font-bold text-amber-600">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
            <p className="text-sm font-medium text-gray-600 mb-1">
              High Priority
            </p>
            <p className="text-3xl font-bold text-red-600">{stats.high}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Filters & Sort
              </h2>
            </div>
            <button
              onClick={handleNewTask}
              className="flex items-center justify-center gap-2 px-4 py-2.5 hover:cursor-pointer bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-all shadow-sm"
            >
              <Plus className="w-5 h-5" />
              New Task
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) =>
                  setFilterStatus(e.target.value as TaskStatus | "all")
                }
                className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              >
                <option className="text-black" value="all">
                  All
                </option>
                <option className="text-black" value="pending">
                  Pending
                </option>
                <option className="text-black" value="completed">
                  Completed
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={filterPriority}
                onChange={(e) =>
                  setFilterPriority(e.target.value as TaskPriority | "all")
                }
                className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              >
                <option className="text-black" value="all">
                  All
                </option>
                <option className="text-black" value="low">
                  Low
                </option>
                <option className="text-black" value="medium">
                  Medium
                </option>
                <option className="text-black" value="high">
                  High
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "date" | "priority")
                }
                className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              >
                <option className="text-black" value="date">
                  Due Date
                </option>
                <option className="text-black" value="priority">
                  Priority
                </option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Tasks ({filteredAndSortedTasks.length})
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Loading tasks...</p>
            </div>
          ) : (
            <TaskList
              tasks={filteredAndSortedTasks}
              onEditTask={handleEditTask}
            />
          )}
        </div>
      </main>

      {showForm && <TaskForm task={editingTask} onClose={handleCloseForm} />}
    </div>
  );
};

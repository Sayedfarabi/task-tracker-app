/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { Task } from "../types";
import {
  loadTasksFromStorage,
  saveTasksToStorage,
  clearTasksStorage,
} from "../utils/storage";

interface TasksState {
  tasks: Map<string, Task>;
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  tasks: new Map<string, Task>(),
  loading: false,
  error: null,
};

// Fetch tasks for a user. Loads from localStorage.
export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (userId: string) => {
    console.log("fetchTasks called with userId:", userId);
    // Load tasks from localStorage
    const tasksFromStorage = loadTasksFromStorage();
    return tasksFromStorage;
  }
);

// Create a task locally. Accepts partial task data and returns a full Task.
export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (task: Omit<Task, "id" | "created_at" | "updated_at">) => {
    const now = new Date().toISOString();
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      created_at: now,
      updated_at: now,
    } as Task;
    return newTask;
  }
);

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ id, updates }: { id: string; updates: Partial<Task> }) => {
    const updated = { id, updates };
    return updated;
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (id: string) => {
    return id;
  }
);

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    // Direct reducers operating on the Map
    clearTasks: (state) => {
      state.tasks = new Map();
      clearTasksStorage();
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.set(action?.payload?.id, action?.payload);
      saveTasksToStorage(state?.tasks);
    },
    upsertTask: (state, action: PayloadAction<Task>) => {
      state.tasks.set(action?.payload?.id, action?.payload);
      saveTasksToStorage(state?.tasks);
    },
    updateTaskById: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<Task> }>
    ) => {
      const { id, updates } = action.payload;
      const existing = state?.tasks.get(id);
      if (existing) {
        const merged: Task = {
          ...existing,
          ...updates,
          updated_at: new Date().toISOString(),
        };
        state?.tasks.set(id, merged);
        saveTasksToStorage(state?.tasks);
      }
    },
    deleteTaskById: (state, action: PayloadAction<string>) => {
      state.tasks.delete(action?.payload);
      saveTasksToStorage(state?.tasks);
    },
    setTasksFromArray: (state, action: PayloadAction<Task[]>) => {
      state.tasks = new Map(action?.payload.map((t) => [t?.id, t]));
      saveTasksToStorage(state?.tasks);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        fetchTasks?.fulfilled,
        (state, action: PayloadAction<Task[]>) => {
          state.tasks = new Map(action?.payload.map((t) => [t?.id, t]));
          state.loading = false;
          state.error = null;
          saveTasksToStorage(state?.tasks);
        }
      )
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.error?.message ?? "Failed to fetch tasks";
      })
      .addCase(createTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.tasks.set(action?.payload?.id, action?.payload);
        saveTasksToStorage(state?.tasks);
      })
      .addCase(
        updateTask?.fulfilled,
        (
          state,
          action: PayloadAction<{ id: string; updates: Partial<Task> }>
        ) => {
          const { id, updates } = action.payload;
          const existing = state?.tasks.get(id);
          if (existing) {
            const merged: Task = {
              ...existing,
              ...updates,
              updated_at: new Date().toISOString(),
            };
            state?.tasks.set(id, merged);
            saveTasksToStorage(state?.tasks);
          }
        }
      )
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<string>) => {
        state.tasks.delete(action.payload);
        saveTasksToStorage(state.tasks);
      });
  },
});

export const {
  clearTasks,
  addTask,
  upsertTask,
  updateTaskById,
  deleteTaskById,
  setTasksFromArray,
} = tasksSlice.actions;

// Selectors for tasks
export const selectTasksMap = (state: any): Map<string, Task> =>
  state?.tasks?.tasks;
export const selectAllTasks = (state: any): Task[] =>
  Array.from(selectTasksMap(state).values());
export const selectTaskById = (state: any, id: string): Task | undefined =>
  selectTasksMap(state).get(id);

export default tasksSlice.reducer;

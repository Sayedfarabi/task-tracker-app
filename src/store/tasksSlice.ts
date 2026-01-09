/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { Task } from "../types";

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

// Fetch tasks for a user (simulated). Returns an array of Task objects.
export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (userId: string) => {
    console.log("fetchTasks called with userId:", userId);
    // Placeholder: in a real app you'd call an API here.
    // Return an empty array so reducer can set the Map accordingly.
    return [] as Task[];
  }
);

// Create a task locally (simulated). Accepts partial task data and returns a full Task.
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
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.set(action.payload.id, action.payload);
    },
    upsertTask: (state, action: PayloadAction<Task>) => {
      state.tasks.set(action.payload.id, action.payload);
    },
    updateTaskById: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<Task> }>
    ) => {
      const { id, updates } = action.payload;
      const existing = state.tasks.get(id);
      if (existing) {
        const merged: Task = {
          ...existing,
          ...updates,
          updated_at: new Date().toISOString(),
        };
        state.tasks.set(id, merged);
      }
    },
    deleteTaskById: (state, action: PayloadAction<string>) => {
      state.tasks.delete(action.payload);
    },
    setTasksFromArray: (state, action: PayloadAction<Task[]>) => {
      state.tasks = new Map(action.payload.map((t) => [t.id, t]));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.tasks = new Map(action.payload.map((t) => [t.id, t]));
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to fetch tasks";
      })
      .addCase(createTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.tasks.set(action.payload.id, action.payload);
      })
      .addCase(
        updateTask.fulfilled,
        (
          state,
          action: PayloadAction<{ id: string; updates: Partial<Task> }>
        ) => {
          const { id, updates } = action.payload;
          const existing = state.tasks.get(id);
          if (existing) {
            const merged: Task = {
              ...existing,
              ...updates,
              updated_at: new Date().toISOString(),
            };
            state.tasks.set(id, merged);
          }
        }
      )
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<string>) => {
        state.tasks.delete(action.payload);
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

// Selectors (avoid importing RootState here to prevent circular import)
export const selectTasksMap = (state: any): Map<string, Task> =>
  state.tasks.tasks;
export const selectAllTasks = (state: any): Task[] =>
  Array.from(selectTasksMap(state).values());
export const selectTaskById = (state: any, id: string): Task | undefined =>
  selectTasksMap(state).get(id);

export default tasksSlice.reducer;

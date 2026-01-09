import {
  createSlice,
  createAsyncThunk,
  //   type PayloadAction,
} from "@reduxjs/toolkit";
import type { Task } from "../types";

interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  tasks: [],
  loading: false,
  error: null,
};

export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (userId: string) => {
    console.log("fetchTasks called with userId:", userId);
  }
);

export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (task: Omit<Task, "id" | "created_at" | "updated_at">) => {
    console.log("createTask called with task:", task);
  }
);

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ id, updates }: { id: string; updates: Partial<Task> }) => {
    console.log("updateTask called with id and updates:", id, updates);
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (id: string) => {
    console.log("deleteTask called with id:", id);
  }
);

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    clearTasks: (state) => {
      state.tasks = [];
    },
  },
});

export const { clearTasks } = tasksSlice.actions;
export default tasksSlice.reducer;

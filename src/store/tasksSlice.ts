import {
  createSlice,
  createAsyncThunk,
  //   type PayloadAction,
} from "@reduxjs/toolkit";
// import { supabase } from "../lib/supabase";
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
    // const { data, error } = await supabase
    //   .from("tasks")
    //   .select("*")
    //   .eq("user_id", userId)
    //   .order("created_at", { ascending: false });

    // if (error) throw error;
    // return data as Task[];
  }
);

export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (task: Omit<Task, "id" | "created_at" | "updated_at">) => {
    console.log("createTask called with task:", task);
    // const { data, error } = await supabase
    //   .from("tasks")
    //   .insert([task])
    //   .select()
    //   .single();

    // if (error) throw error;
    // return data as Task;
  }
);

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ id, updates }: { id: string; updates: Partial<Task> }) => {
    console.log("updateTask called with id and updates:", id, updates);
    // const { data, error } = await supabase
    //   .from("tasks")
    //   .update({ ...updates, updated_at: new Date().toISOString() })
    //   .eq("id", id)
    //   .select()
    //   .single();

    // if (error) throw error;
    // return data as Task;
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (id: string) => {
    console.log("deleteTask called with id:", id);
    // const { error } = await supabase.from("tasks").delete().eq("id", id);

    // if (error) throw error;
    // return id;
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
  //   extraReducers: (builder) => {
  //     builder
  //       .addCase(fetchTasks.pending, (state) => {
  //         state.loading = true;
  //         state.error = null;
  //       })
  //       .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
  //         state.loading = false;
  //         state.tasks = action.payload;
  //       })
  //       .addCase(fetchTasks.rejected, (state, action) => {
  //         state.loading = false;
  //         state.error = action.error.message || "Failed to fetch tasks";
  //       })
  //       .addCase(createTask.fulfilled, (state, action: PayloadAction<Task>) => {
  //         state.tasks.unshift(action.payload);
  //       })
  //       .addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
  //         const index = state.tasks.findIndex(
  //           (task) => task.id === action.payload.id
  //         );
  //         if (index !== -1) {
  //           state.tasks[index] = action.payload;
  //         }
  //       })
  //       .addCase(deleteTask.fulfilled, (state, action: PayloadAction<string>) => {
  //         state.tasks = state.tasks.filter((task) => task.id !== action.payload);
  //       });
  //   },
});

export const { clearTasks } = tasksSlice.actions;
export default tasksSlice.reducer;

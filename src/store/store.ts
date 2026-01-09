import { configureStore } from "@reduxjs/toolkit";
import { enableMapSet } from "immer";
import authReducer from "./authSlice";
import tasksReducer from "./tasksSlice";

// Enable Immer support for Map and Set so Map-based state works with Immer
enableMapSet();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: tasksReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore the Map stored at tasks.tasks (Map is non-serializable by default)
        ignoredPaths: ["tasks.tasks"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

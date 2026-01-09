import type { Task } from "../types";

const TASKS_STORAGE_KEY = "flynest_tasks";

// Serialize Map<string, Task> to JSON string for localStorage
export const serializeTasksMap = (tasksMap: Map<string, Task>): string => {
  const tasksArray = Array.from(tasksMap.values());
  return JSON.stringify(tasksArray);
};

//  Deserialize JSON string from localStorage to Map<string, Task>
export const deserializeTasksMap = (jsonString: string): Map<string, Task> => {
  try {
    const tasksArray: Task[] = JSON.parse(jsonString);
    return new Map(tasksArray.map((task) => [task.id, task]));
  } catch {
    return new Map();
  }
};

//  Load tasks from localStorage
export const loadTasksFromStorage = (): Task[] => {
  try {
    const stored = localStorage.getItem(TASKS_STORAGE_KEY);
    if (!stored) return [];
    const tasksMap = deserializeTasksMap(stored);
    return Array.from(tasksMap.values());
  } catch {
    return [];
  }
};

//  Save tasks to localStorage
export const saveTasksToStorage = (tasksMap: Map<string, Task>): void => {
  try {
    const serialized = serializeTasksMap(tasksMap);
    localStorage.setItem(TASKS_STORAGE_KEY, serialized);
  } catch {
    console.error("Failed to save tasks to localStorage");
  }
};

// Clear all tasks from localStorage
export const clearTasksStorage = (): void => {
  try {
    localStorage.removeItem(TASKS_STORAGE_KEY);
  } catch {
    console.error("Failed to clear tasks from localStorage");
  }
};

import type { Task } from "../types/task.ts";

import { tasks } from "../cache.ts";

export function createTask(o: Task) {
  tasks.set(o.name, o);
  return o;
}

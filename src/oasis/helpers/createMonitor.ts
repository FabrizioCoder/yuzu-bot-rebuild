import type { Monitor } from "../types/monitor.ts";

import { monitors } from "../cache.ts";

export function createMonitor(o: Monitor) {
  monitors.set(o.name, o);
  return o;
}

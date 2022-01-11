import type { Event } from "../types/event.ts";

import { events } from "../cache.ts";

export function createEvent(o: Event) {
  events.set(o.name, o);
  return o;
}

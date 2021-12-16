import type { DiscordenoInteraction } from "../../../deps.ts";
import type {
  ButtonCollectorOptions,
  ButtonCollectorReturn,
  CollectButtonOptions,
} from "../../types/collector.ts";
import { Milliseconds } from "../constants/time.ts";
import * as cache from "../cache.ts";

export function collectButtons(
  options: CollectButtonOptions,
): Promise<ButtonCollectorReturn[]> {
  return new Promise((resolve, reject) => {
    cache.collectors.buttons.get(options.key)?.reject(
      "A new collector began before the user responded to the previous one.",
    );
    cache.collectors.buttons.set(options.key, {
      ...options,
      buttons: [] as ButtonCollectorReturn[],
      resolve,
      reject,
    });
  });
}

export async function needButton(
  userId: bigint,
  messageId: bigint,
  options: ButtonCollectorOptions & { amount?: 1 },
): Promise<ButtonCollectorReturn>;
export async function needButton(
  userId: bigint,
  messageId: bigint,
  options: ButtonCollectorOptions & { amount?: number },
): Promise<ButtonCollectorReturn[]>;
export async function needButton(
  userId: bigint,
  messageId: bigint,
): Promise<ButtonCollectorReturn>;
export async function needButton(
  userId: bigint,
  messageId: bigint,
  options?: ButtonCollectorOptions,
) {
  const buttons = await collectButtons({
    key: userId,
    messageId,
    createdAt: Date.now(),
    filter: options?.filter ??
      ((_, user) => (user ? userId === user.id : true)),
    amount: options?.amount ?? 1,
    duration: options?.duration ?? Milliseconds.MINUTE * 5,
  });

  return (options?.amount || 1) > 1 ? buttons : buttons[0];
}

export function processButtonCollectors(data: DiscordenoInteraction) {
  // All buttons will require a message
  if (!data.message) return;

  // If this message is not pending a button response, we can ignore
  const collector = cache.collectors.buttons.get(
    data.user ? data.user.id : data.message.id,
  );
  if (!collector) return;

  // This message is a response to a collector. Now running the filter function.
  if (!collector.filter(data.message, data.user)) return;

  // If the necessary amount has been collected
  if (
    collector.amount === 1 ||
    collector.amount === collector.buttons.length + 1
  ) {
    // Remove the collector
    cache.collectors.buttons.delete(data.message.id);
    // Resolve the collector
    return collector.resolve([
      ...collector.buttons,
      {
        customId: data.data?.customId ??
          "No customId provided for this button.",
        interaction: data,
        user: data.user,
      },
    ]);
  }

  // More buttons still need to be collected
  collector.buttons.push({
    customId: data.data?.customId ?? "No customId provided for this button.",
    interaction: data,
    user: data.user,
  });
}

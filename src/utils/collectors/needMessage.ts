import type { DiscordenoMessage } from "../../../deps.ts";
import type {
  CollectMessagesOptions,
  MessageCollectorOptions,
} from "../../types/collector.ts";
import { Milliseconds } from "../constants/time.ts";
import * as cache from "../cache.ts";

export function collectMessages(
  options: CollectMessagesOptions,
): Promise<DiscordenoMessage[]> {
  return new Promise((resolve, reject) => {
    cache.collectors.messages
      .get(options.key)
      ?.reject(
        "A new collector began before the user responded to the previous one.",
      );

    cache.collectors.messages.set(options.key, {
      ...options,
      messages: [],
      resolve,
      reject,
    });
  });
}

export async function needMessage(
  memberId: bigint,
  channelId: bigint,
  options: MessageCollectorOptions & { amount?: 1 },
): Promise<DiscordenoMessage>;
export async function needMessage(
  memberId: bigint,
  channelId: bigint,
  options: MessageCollectorOptions & { amount?: number },
): Promise<DiscordenoMessage[]>;
export async function needMessage(
  memberId: bigint,
  channelId: bigint,
): Promise<DiscordenoMessage>;
export async function needMessage(
  memberId: bigint,
  channelId: bigint,
  options?: MessageCollectorOptions,
) {
  const messages = await collectMessages({
    key: memberId,
    channelId,
    createdAt: Date.now(),
    filter: options?.filter ?? ((msg) => memberId === msg.authorId),
    amount: options?.amount ?? 1,
    duration: options?.duration ?? Milliseconds.MINUTE * 5,
  });

  return (options?.amount || 1) > 1 ? messages : messages[0];
}

/* https://github.com/discordeno/template/blob/main/src/types/collectors.ts */

import type { DiscordenoInteraction, DiscordenoUser, DiscordenoMessage } from "../../deps.ts";

// BASE

export interface BaseCollectorOptions {
  amount?: number;
  duration?: number;
}

export interface BaseCollectorCreateOptions extends BaseCollectorOptions {
  key: bigint;
  createdAt: number;
}

// BUTTONS

export interface CollectButtonOptions extends BaseCollectorCreateOptions {
  messageId: bigint;
  filter: (message: DiscordenoMessage, user?: DiscordenoUser) => boolean;
}

export interface ButtonCollector extends CollectButtonOptions {
  resolve: (value: ButtonCollectorReturn[] | PromiseLike<ButtonCollectorReturn[]>) => void;
  // deno-lint-ignore no-explicit-any
  reject: (reason?: any) => void;
  buttons: ButtonCollectorReturn[];
}

export interface ButtonCollectorOptions extends BaseCollectorOptions {
  filter?: (message: DiscordenoMessage, user?: DiscordenoUser) => boolean;
}

export interface ButtonCollectorReturn {
  customId: string;
  interaction: Omit<DiscordenoInteraction, "user">;
  user?: DiscordenoUser;
}

// MESSAGES

export interface CollectMessagesOptions extends BaseCollectorCreateOptions {
  channelId: bigint;
  filter: (message: DiscordenoMessage) => boolean;
}

export interface MessageCollector extends CollectMessagesOptions {
  resolve: (value: DiscordenoMessage[] | PromiseLike<DiscordenoMessage[]>) => void;
  // deno-lint-ignore no-explicit-any
  reject: (reason?: any) => void;
  messages: DiscordenoMessage[];
}

export interface MessageCollectorOptions extends BaseCollectorOptions {
  filter?: (message: DiscordenoMessage) => boolean;
  amount?: number;
  duration?: number;
}

import type { DiscordenoAttachment, DiscordenoMessage } from "discordeno";
import { Collection } from "discordeno";

export const lastMessages = new Collection<bigint, DiscordenoMessage>();
export const lastAttachments = new Collection<bigint, string[]>();
export const alreadySendedInStarboard = new Collection<bigint, DiscordenoMessage>();

import type { Document } from 'mongoose';
import mongoose from 'mongoose';

export const GuildSchema = new mongoose.Schema({
	id: String,
	language: String
});

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface IGuild extends Document {

	// the id of the guild (a Discord snowflake)
	id: string;

	// the language of the guild (defualt en-us)
	language: string;
}

export default mongoose.model<IGuild>('Guild', GuildSchema, 'guilds');
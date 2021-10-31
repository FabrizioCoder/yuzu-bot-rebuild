import type { Document } from 'mongoose';
import mongoose from 'mongoose';

export const TagSchema = new mongoose.Schema<string>({
	id: mongoose.Schema.Types.ObjectId,
	server: String,
	user: String,
	name: String,
	content: String,
	attachments: [String],
	global: Boolean,
	nsfw: Boolean
});

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface ITag extends Document {
	id: mongoose.Schema.Types.ObjectId;
	server: string;
	user: string;
	name: string;
	content: string;
	attachments: string[];
	global: boolean;
	nsfw: boolean;
}

export default mongoose.model<ITag>('Tag', TagSchema);
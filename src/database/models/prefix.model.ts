import type { Document } from 'mongoose';
import mongoose from 'mongoose';

export const PrefixSchema = new mongoose.Schema<string>({
	id: mongoose.Schema.Types.ObjectId,
	prefix: String,
	server: String
});

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface IPrefix extends Document {
	id: mongoose.Schema.Types.ObjectId;
	prefix: string;
	server: string;
}

export default mongoose.model<IPrefix>('Prefix', PrefixSchema, 'prefixes');
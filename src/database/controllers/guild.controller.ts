/* eslint-disable @typescript-eslint/consistent-type-imports */

import Guild, { type IGuild } from '../models/guild.model.js';

export async function addGuild(id: string, language: string): Promise<IGuild> {
	const newGuild = new Guild({ id, language });
	const output = await newGuild.save();

	return output;
}

export async function getGuild(id: string): Promise<IGuild | null> {
	const output = await Guild.findOne({ id });

	return output;
}

export async function editGuild(id: string, data: IGuild): Promise<IGuild | null> {
	const output = await Guild.findOneAndUpdate({ id }, data, { new: true });

	return output;
}
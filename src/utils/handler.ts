import { readdirSync } from 'fs';
import { join } from 'path';

export function handle<T>(dir: string, folder: string, fn: (imported: T) => void): string[] {
	const path = join(dir, folder);
	const files = readdirSync(path);

	files.forEach(async file => {
		if (!file.endsWith('.js')) {
			const unknownFile = join(folder, file);

			handle(dir, unknownFile, fn);
			return;
		}
		const pathToFile = join('file:///', dir, folder, file);
		const output: { default: T } = await import(pathToFile);

		fn(output.default);
	});
	return files;
}
import type { Task } from 'types/task';
import { Milliseconds } from '../utils/Util.js';

var counter = 0;

export default <Task> {
	name: 'testing',
	interval: Milliseconds.HOUR * 12,
	disabled: true,
	execute(session) {
		const rn = counter++;
		const guild = session.guilds.cache.get('891367004903182336');
		const channel = guild?.channels.cache.get('895959965469134858');

		if (channel && channel.isText()) // eslint-disable-next-line @typescript-eslint/no-empty-function
			channel.send('Ping! at ' + rn).then(() => {}, console.error);
	}
};
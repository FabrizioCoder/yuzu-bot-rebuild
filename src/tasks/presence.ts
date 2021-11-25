import type { Task } from "../types/task.ts";
import { Milliseconds } from "../utils/mod.ts";

export default <Task> {
  name: "presences",
  interval: Milliseconds.MINUTE * 4,
  async execute(_bot, _payload) {
    const presences = [
      `!help`,
      // `${1000.toLocaleString('de-CH')} servers`,
      // `${1000.toLocaleString('de-CH')} users`
    ];
    presences;

    // session.user?.setPresence({
    // 	status: 'online',
    // 	activities: [
    // 		{
    // 			name: presences[Math.floor(Math.random() * presences.length - 1) + 1],
    // 			type: Constants.ActivityTypes.LISTENING
    // 		}
    // 	]
    // });
  },
};

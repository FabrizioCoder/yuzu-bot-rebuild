import { ShardingManager } from 'discord.js';
import { Options } from './utils/Util.js';
import 'dotenv/config';
import 'process';

const token = process.env.TOKEN ?? Options.TOKEN;
const manager = new ShardingManager('./built/bot.js', { token, mode: 'process' });

manager.on('shardCreate', shard => console.log('Launched shard %s', shard.id));

await manager.spawn({ amount: 'auto' });
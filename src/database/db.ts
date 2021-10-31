import type { Connection } from 'mongoose';
import mongoose from 'mongoose';

var database: Connection | undefined;

if (!database) {
	await mongoose.connect(process.env.DB ?? 'mongodb://localhost:27017/test', {
		// keeping alive the host :(
		useNewUrlParser: true,
		useFindAndModify: false,
		useCreateIndex: true,
		reconnectTries: 10,
		reconnectInterval: 1500,
		connectTimeoutMS: 3000,
		socketTimeoutMS: 30000,
		keepAlive: true
	});
	database = mongoose.connection;
	database.on('open', console.info);
	database.on('error', console.error);
}
else await mongoose.disconnect();
console.info('\x1b[35m%s\x1b[0m', 'trying to connect to the database...');
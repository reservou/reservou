"server-only";

/**
 * Resource from official Next.js example with mongoose
 * https://github.com/vercel/next.js/blob/canary/examples/with-mongodb-mongoose/lib/dbConnect.ts
 */

import { type Mongoose, connect as connectMongoose } from "mongoose";
import { getEnv } from "../env";
import { InternalServerError } from "../errors";

interface MongooseCache {
	conn: Mongoose | null;
	promise: Promise<Mongoose> | null;
}

declare global {
	var mongoose: MongooseCache;
}

const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
	global.mongoose = cached;
}

async function connect(): Promise<Mongoose> {
	const MONGO_URI = getEnv("MONGO_URI");

	if (!MONGO_URI) {
		throw new InternalServerError(
			"Missing MONGO_URI in environment variables.",
		);
	}

	if (cached.conn) {
		return cached.conn;
	}

	if (!cached.promise) {
		const opts = {
			bufferCommands: false,
		};
		cached.promise = connectMongoose(MONGO_URI, opts).then((mongoose) => {
			return mongoose;
		});
	}

	try {
		cached.conn = await cached.promise;
	} catch (e) {
		cached.promise = null;
		throw e;
	}

	return cached.conn;
}

export const database = Object.freeze({
	connect,
});

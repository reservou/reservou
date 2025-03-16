"server-only";

/**
 * This is a implementation using the redis:// protocol that won't be ran in vercel's
 * serverless environment.
 * @todo Implement a interface and dependency injection for resolving the local/upstash redis impl
 */

import Redis from "ioredis";
import { getEnv } from "../env";
import { InternalServerError } from "../errors";

function initializeRedis() {
	const redisUrl = getEnv("REDIS_URL");

	try {
		const redis = new Redis(redisUrl, {
			retryStrategy: (times) => Math.min(times * 50, 2000),
			enableOfflineQueue: true,
		});

		redis.on("connect", () => console.log("Connected to Redis"));
		redis.on("error", (err) => console.error("Redis connection error:", err));

		return redis;
	} catch (error) {
		throw new InternalServerError("Failed to initialize Redis connection.");
	}
}

const redisClient = initializeRedis();

/**
 * Set a value in Redis with optional expiry (in seconds), serializing to JSON.
 * @param key - The Redis key
 * @param value - The value to set (will be JSON-serialized)
 * @param expiry - Optional expiry time in seconds
 */
async function set<T>(key: string, value: T, expiry?: number): Promise<void> {
	const serializedValue = JSON.stringify(value);
	if (expiry) {
		await redisClient.set(key, serializedValue, "EX", expiry);
	} else {
		await redisClient.set(key, serializedValue);
	}
}

/**
 * Get a value from Redis, deserializing from JSON.
 * @param key - The Redis key
 * @returns The deserialized value or null if key doesn't exist
 */
async function get<T>(key: string): Promise<T | null> {
	const value = await redisClient.get(key);
	if (value === null) return null;
	try {
		return JSON.parse(value) as T;
	} catch (error) {
		console.error(`Failed to parse JSON for key "${key}":`, error);
		return null; // Return null if parsing fails
	}
}

/**
 * Set an expiry time for a key in Redis (in seconds).
 * @param key - The Redis key
 * @param seconds - Expiry time in seconds
 * @returns True if expiry was set, false if key doesn't exist
 */
async function expire(key: string, seconds: number): Promise<boolean> {
	const result = await redisClient.expire(key, seconds);
	return result === 1; // Returns 1 if successful, 0 if key doesn't exist
}

/**
 * Delete a key from Redis.
 * @param key - The Redis key to delete
 * @returns Number of keys deleted (0 if key didn't exist)
 */
async function del(key: string): Promise<number> {
	return await redisClient.del(key);
}

const redis = Object.freeze({
	set,
	get,
	expire,
	del,
});

// Export the redis utilities and raw client (optional)
export { redis, redisClient };

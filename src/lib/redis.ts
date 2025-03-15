"server-only";

import { Redis } from "@upstash/redis";
import { getEnv } from "../env";

const redis = new Redis({
	url: getEnv("REDIS_URL"),
	token: getEnv("REDIS_TOKEN"),
});

export { redis };

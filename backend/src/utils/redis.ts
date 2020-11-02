import Redis from "ioredis";

import {
  REDIS_HOST, REDIS_PORT, REDIS_PASSWORD
} from "../config";

export const redis = new Redis(REDIS_PORT, REDIS_HOST, { password: REDIS_PASSWORD });

redis.ping().catch(err => {
  console.error(err);
  process.exitCode = 1;
});

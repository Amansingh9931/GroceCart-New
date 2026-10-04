import { createClient } from "redis";

let client;

export const initializeCache = async () => {
  if (!process.env.REDIS_URL) {
    console.log("Redis cache disabled (REDIS_URL is not configured)");
    return;
  }

  client = createClient({ url: process.env.REDIS_URL });
  client.on("error", (error) => console.error("Redis cache error:", error.message));

  try {
    await client.connect();
    console.log("Redis cache connected");
  } catch (error) {
    console.warn("Redis cache unavailable; continuing without it:", error.message);
    client = undefined;
  }
};

export const cacheGet = async (key) => {
  if (!client?.isReady) return null;
  try {
    const value = await client.get(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.warn("Cache read failed:", error.message);
    return null;
  }
};

export const cacheSet = async (key, value, ttlSeconds) => {
  if (!client?.isReady) return;
  try {
    await client.set(key, JSON.stringify(value), { EX: ttlSeconds });
  } catch (error) {
    console.warn("Cache write failed:", error.message);
  }
};

export const cacheDelete = async (key) => {
  if (!client?.isReady) return;
  try {
    await client.del(key);
  } catch (error) {
    console.warn("Cache invalidation failed:", error.message);
  }
};

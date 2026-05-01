import { createClient } from "redis"
import { env } from "./env"

const redisClient: ReturnType<typeof createClient> = createClient({
    url: env.redisUrl,
    socket: {
        connectTimeout: 5000,
        reconnectStrategy: (retries) => Math.min(retries * 250, 2000)
    }
})

let redisAvailable = false

redisClient.on("error", (error) => {
    redisAvailable = false
    console.error("Redis Error:", error.message)
})

redisClient.on("ready", () => {
    redisAvailable = true
    console.info("Redis Ready:", { url: env.redisUrl })
})

redisClient.on("end", () => {
    redisAvailable = false
    console.warn("Redis connection closed. Falling back to MongoDB-only mode.")
})

redisClient.on("reconnecting", () => {
    redisAvailable = false
    console.warn("Redis reconnecting...")
})

export const isRedisAvailable = () => redisAvailable && redisClient.isReady

export const connectRedis = async () => {
    if (redisClient.isOpen) return

    try {
        await redisClient.connect()
        redisAvailable = true
        console.log("✅💻 -> Redis conectado")
    } catch (error) {
        redisAvailable = false
        console.warn("❌💻 -> Redis no disponible. La app seguirá funcionando sin cache compartido.")
    }
}

export const safeRedisGet = async (key: string) => {
    if (!isRedisAvailable()) return null

    try {
        return await redisClient.get(key)
    } catch (error) {
        redisAvailable = false
        console.warn("Redis GET falló. Se usará fallback a MongoDB.", error)
        return null
    }
}

export const safeRedisSet = async (key: string, value: string, ttlSeconds?: number) => {
    if (!isRedisAvailable()) return

    try {
        if (ttlSeconds && ttlSeconds > 0) {
            await redisClient.set(key, value, { EX: ttlSeconds })
            return
        }

        await redisClient.set(key, value)
    } catch (error) {
        redisAvailable = false
        console.warn("Redis SET falló. La app continuará sin caché.", error)
    }
}

export const safeRedisIncr = async (key: string) => {
    if (!isRedisAvailable()) return null

    try {
        return await redisClient.incr(key)
    } catch (error) {
        redisAvailable = false
        console.warn("Redis INCR falló. Se usará fallback en memoria.", error)
        return null
    }
}

export const safeRedisExpire = async (key: string, seconds: number) => {
    if (!isRedisAvailable()) return false

    try {
        return await redisClient.expire(key, seconds)
    } catch (error) {
        redisAvailable = false
        console.warn("Redis EXPIRE falló. Se usará fallback en memoria.", error)
        return false
    }
}

export const safeRedisTtl = async (key: string) => {
    if (!isRedisAvailable()) return null

    try {
        return await redisClient.ttl(key)
    } catch (error) {
        redisAvailable = false
        console.warn("Redis TTL falló. Se usará fallback en memoria.", error)
        return null
    }
}

export default redisClient

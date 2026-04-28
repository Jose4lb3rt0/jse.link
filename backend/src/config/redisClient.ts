import { createClient } from "redis"
import { env } from "./env"
import { logger } from "../utils/logger"

const redisClient = createClient({ url: env.redisUrl })

redisClient.on("error", (error) => {
    logger.warn("redis_connection_error", { error: error.message })
})

redisClient.on("ready", () => {
    logger.info("redis_ready", { url: env.redisUrl })
})

export const connectRedis = async () => {
    if (redisClient.isOpen) return

    try {
        await redisClient.connect()
        logger.info("redis_succesfully_connected")
    } catch (error) {
        logger.warn("redis_initial_connection_failed", {
            error: error instanceof Error ? error.message : String(error),
            fallback: "mongo_only_mode",
        })
    }
}

export default redisClient
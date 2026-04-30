import { createClient } from "redis"
import { env } from "./env"

const redisClient = createClient({ url: env.redisUrl })

redisClient.on("error", (error) => {
    console.error("Redis Error: ", error.message)
})

redisClient.on("ready", () => {
    console.info("Redis Ready: ", { url: env.redisUrl })
})

export const connectRedis = async () => {
    if (redisClient.isOpen) return

    try {
        await redisClient.connect()
        console.log("Redis conectado")
    } catch (error) {
        console.warn("Redis no disponible. La app seguirá funcionando sin cache compartido.")
        console.warn(error)
    }
}

export default redisClient
import { createClient } from "redis"

const redisClient = createClient({ url: "redis://127.0.0.1:6379" }) // El de mi WSL

redisClient.on("error", (err) => console.error("❌ Redis error:", err))
redisClient.on("connect", () => console.log("✅ Conectado a Redis"))

redisClient.connect()

export default redisClient
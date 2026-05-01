import { createServer } from "node:http"
import app from "./app"
import { conectarDB } from "./config/db"
import { connectRedis } from "./config/redisClient"
import { env } from "./config/env"

const server = createServer(app)

const bootstrap = async () => {
    await conectarDB()
    void connectRedis()

    server.listen(env.port, () => {
        console.log(`Servidor corriendo en ${env.baseUrl}`)
    })
}

void bootstrap()

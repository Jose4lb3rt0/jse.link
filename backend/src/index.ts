import { createServer } from "node:http"
import app from "./app"
import { conectarDB } from "./config/db"
import { connectRedis } from "./config/redisClient"
import { env } from "./config/env"
import { logger } from "./utils/logger"

const PORT = process.env.PORT || 5000
const server = createServer(app)

const bootstrap = async () => {
    await Promise.all([conectarDB(), connectRedis()])

    server.listen(env.port, () => {
        logger.info("server_started", { url: `http://localhost:${env.port}`, nodeEnv: env.nodeEnv });
    })
}

void bootstrap()
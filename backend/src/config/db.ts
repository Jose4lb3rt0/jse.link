// import { config } from "dotenv"
import mongoose from "mongoose"
import { env } from "./env"
import { logger } from "../utils/logger"

// config()

// const DB_USER = process.env.DATABASE_USER
// const DB_PASSWORD = process.env.DATABASE_PASSWORD
// const DB_CLUSTER = process.env.DATABASE_CLUSTER
// const DB_HOST = process.env.DATABASE_HOST
// const DB_NAME = process.env.DATABASE_NAME

export const conectarDB = async (): Promise<void> => {
  try {
    mongoose.set("strictQuery", true)
    await mongoose.connect(env.mongoUri)
    logger.info("mongodb_connected")
  } catch (error) {
    logger.error("mongodb_connection_failed", {
      error: error instanceof Error ? error.message : String(error),
      retryInSeconds: 5,
    })
    setTimeout(() => {
      void conectarDB()
    }, 5000)
  }
}

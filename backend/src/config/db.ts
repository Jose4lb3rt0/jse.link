import { config } from "dotenv"
import mongoose from "mongoose"

config()

const DB_USER = process.env.DATABASE_USER
const DB_PASSWORD = process.env.DATABASE_PASSWORD
const DB_CLUSTER = process.env.DATABASE_CLUSTER
const DB_HOST = process.env.DATABASE_HOST
const DB_NAME = process.env.DATABASE_NAME

export const conectarDB = async (): Promise<void> => {
  try {
    mongoose.set("strictQuery", false)
    const uri = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/?appName=${DB_CLUSTER}`;
    await mongoose.connect(uri)

    console.log("💾 DB -> ✅ Conectado exitosamente a MongoDB Atlas.")
  } catch (error) {
    console.error("💾 DB -> ❌ Error al conectar a la base de datos:", error)
    console.log("💾 DB -> Reintentando en 5 segundos...")
    setTimeout(conectarDB, 5000)
  }
}

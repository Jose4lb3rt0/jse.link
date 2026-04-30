import mongoose from "mongoose"
import { env } from "./env"

export const conectarDB = async (): Promise<void> => {
  try {
    mongoose.set("strictQuery", true)
    await mongoose.connect(env.mongoUri)
    console.log("✅💾 -> MongoDB conectado.")
  } catch (error) {
    console.error("❌💾 -> Error al conectar MongoDB: ", error)
    console.log("🔃⏳ -> Reintentando en 5 segundos...")

    setTimeout(() => {
      void conectarDB()
    }, 5000)
  }
}

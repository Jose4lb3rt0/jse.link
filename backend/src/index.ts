import { createServer } from "node:http"
import app from "./app"
import { conectarDB } from "./config/db"

const PORT = process.env.PORT || 5000
const server = createServer(app)

server.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto http://localhost:${PORT} 🚀`)
    conectarDB()
})
import morgan from 'morgan'
import express from 'express'
import cors from 'cors'
import PKG from '../package.json'
import routeHandler from './routes/api/main.routes'
import docsHandler from './routes/docs/docs.routes'
import { env } from './config/env'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(morgan("tiny"))

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || env.allowedOrigins.length === 0 || env.allowedOrigins.includes(origin)) {
            callback(null, true)
        } else {
            console.error(`CORS bloqueado. Origen: ${origin}. Permitidos: ${env.allowedOrigins}`)
            callback(new Error("Not allowed by CORS"))
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "x-api-key"],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
}))

app.set('etag', false)

app.get('/', (req, res) => res.redirect('/api'))

app.get('/api', (req, res) => {
    res.status(200).json({
        success: true,
        message: "API disponible.",
        data: {
            name: PKG.name,
            author: PKG.author,
            description: PKG.description,
            version: PKG.version
        }
    })
})

docsHandler(app, 'docs')
routeHandler(app, 'api')

export default app

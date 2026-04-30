import morgan from 'morgan'
import express from 'express'
import cors from 'cors'
import PKG from '../package.json'
import routeHandler from './routes/api/main.routes'
import docsHandler from './routes/docs/docs.routes'

const app = express()

// setupDatabase()

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(morgan("tiny"))
app.use(cors())
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

// APIs
docsHandler(app, 'docs')
routeHandler(app, 'api')

export default app

import morgan from 'morgan'
import express from 'express'
import cors from 'cors'
import PKG from '../package.json'

const app = express()

// setupDatabase()

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(morgan("tiny"))
app.use(cors())
app.set('etag', false)

// APIs
//

app.get('/', (req, res) => {
    res.redirect('/api')
})

app.get('/api', (req, res) => {
    res.status(200).json({
        name: PKG.name,
        author: PKG.author,
        description: PKG.description,
        version: PKG.version
    })
})

export default app
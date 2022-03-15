import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

// initialize config
dotenv.config()
const port = process.env.SERVER_PORT

const app = express()

const corsOptions = {
    origin: 'http://example.com',
    optionsSuccessStatus: 200,
}

app.use(cors(corsOptions))

// define a route handler for the default home page
app.use('/', (req, res) => {
    res.status(200).send('holi')
})

app.get('*', (req, res) => {
    res.redirect('/')
})

// start the Express server
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`)
})

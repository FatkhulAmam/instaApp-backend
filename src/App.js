const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
const { APP_PORT } = process.env

app.use(bodyParser.urlencoded({ extended: false }))
app.use(morgan('dev'))
app.use(cors())

// import middleware
const authMiddleware = require('./middlewares/auth')

// import routes
const authRoute = require('./routes/auth')
const postRoute = require('./routes/posts')

app.use('/auth', authRoute)
app.use('/post', authMiddleware, postRoute)

app.get('/', (req, res) => {
  res.send({
    success: true,
    message: 'InstaApp running well'
  })
})

// provide static file(images)
app.use('/uploads', express.static('assets/uploads'))

app.listen(APP_PORT, () => {
  console.log(`InstaApp Running on port ${APP_PORT}`)
})

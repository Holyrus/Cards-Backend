const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const cardRouter = require('./controllers/cardRouter')
const deckRouter = require('./controllers/deckRouter')
const usersRouter = require('./controllers/usersRouter')
const loginRouter = require('./controllers/loginRouter')
const iconRouter = require('./controllers/iconRouter')
const translateRouter = require('./controllers/translateRouter')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

logger.info('Connecting to', config.MONGODB_URL)

mongoose
  .connect(config.MONGODB_URL)
  .then(() => {
    logger.info('Connected to MongoDB')
  })
  .catch((error) => {
    logger.error('Error connecting to MongoDB:', error.message)
  })

app.use(cors())

app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use('/api/cards', cardRouter)
app.use('/api/decks', deckRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/images', iconRouter)
app.use('/api/translate', translateRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
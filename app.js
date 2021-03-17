const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const notesRouter = require('./controllers/notes')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

logger.info('Connecting to ', config.MONDODB_URI)

mongoose.connect(config.MONDODB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        logger.info('Connected to MONGO DB')
    })
    .catch((error) => {
        logger.error('Error connecting to MONGO DB: ', error.message)
    })

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)
app.use('/api/notes', notesRouter)   
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)    

module.exports = app
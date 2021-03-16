const express = require('express')
const app = express()
app.use(express.json())
app.use(express.static('build'))

const cors = require('cors')
app.use(cors())

require('dotenv').config()
const Note = require('./models/notes')

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({error: 'malfortmatted id'})
  }
  next(error)
}

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (req, res) => {
  Note.find({}).then(notes => {
    res.json(notes)
  })
})

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content === undefined) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date()
  })
  note.save()
    .then(savedNote => savedNote.toJSON())
    .then(savedFormattedNote => {
      response.json(savedFormattedNote)
    })
    .catch(error => next(error))
})

app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(response.param.id)
    .then(note => {
      if (note) {
        response.json(note)
      }
      else {
        response.status(404).end()
      }
  })
  .catch(error => {
    console.log('Cant find note with that id')
    next(error)
  })
})

app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()  
    })
    .catch(error => next(error))
})

app.put('/api/notes/:id', (request, response, next) => {
  const body = request.body
  const note = {
    content: body.content,
    important: body.important
  }
  Note.findByIdAndUpdate(request.params.id)
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})



const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
const notesRouter = require('express').Router()
const Note = require('./models/notes')

notesRouter.get('/', (request, res) => {
  Note.find({}).then(notes => {
    res.json(notes.map(note => note.toJSON()))
  })
})

notesRouter.post('/', (request, response, next) => {
  const body = request.body

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

notesRouter.get('/:id', (request, response, next) => {
  Note.findById(response.param.id)
    .then(note => {
      if (note) {
        response.json(note.toJSON())
      }
      else {
        response.status(404).end()
      }
  })
  .catch(error => 
    next(error))
})

notesRouter.delete('/:id', (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()  
    })
    .catch(error => next(error))
})

notesRouter.put('/:id', (request, response, next) => {
  const body = request.body
  const note = {
    content: body.content,
    important: body.important
  }
  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedNote => {
      response.json(updatedNote.toJSON())
    })
    .catch(error => next(error))
})

module.exports = notesRouter
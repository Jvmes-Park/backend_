const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.uvvwk.mongodb.net/twitter-clone?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const command = process.argv[3]

if (command === 'show') {
    Note.find({}).then(result => {
        result.forEach(note => {
            console.log(note)
        })
        mongoose.connection.close()
    })
}

const content_text = process.argv[4]
const bool = process.argv[5]

if (command === 'save') {
    const note = new Note({
        content: content_text,
        date: new Date(),
        important: bool,
      })
    note.save().then(result => {
        console.log('note saved!')
    mongoose.connection.close()
    })
}
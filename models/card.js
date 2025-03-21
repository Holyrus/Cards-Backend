const mongoose = require('mongoose')

const cardSchema = new mongoose.Schema({
  word: {
    type: String,
    minLength: 1,
    maxLength: [60, '60 characters max'],
    required: true,
  },
  translation: {
    type: String,
    minLength: 1,
    maxLength: [60, '60 characters max'],
    required: true,
  },
  usage: {
    type: String,
    minLength: 1,
    maxLength: [65, '65 characters max'],
  },
  deck: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Deck',
    required: true
  }
})

cardSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Card', cardSchema)
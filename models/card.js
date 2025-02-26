const mongoose = require('mongoose')

const cardSchema = new mongoose.Schema({
  word: {
    type: String,
    minLength: 1,
    maxLenght: 20,
    required: true,
  },
  translation: {
    type: String,
    minLength: 1,
    maxLenght: 20,
    required: true,
  },
  usage: {
    type: String,
    minLength: 1,
    maxLenght: 100,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
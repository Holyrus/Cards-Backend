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
  img: {
    type: String,
    required: true
  },
  toLearn: {
    type: Boolean,
    default: true
  },
  known: {
    type: Boolean,
    default: false
  },
  learned: {
    type: Boolean,
    default: false
  },
  gotIt: {
    type: Number,
    default: 0
  },
  flipped: {
    type: Boolean,
    default: false
  },
  nextReviewDate: {
    type: Date,
    default: null,
  },
  deck: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Deck',
    required: true
  }
})

cardSchema.virtual('timeRemaining').get(function () {
  if (!this.nextReviewDate) return null
  return this.nextReviewDate.getTime() - Date.now()
})

cardSchema.set('toJSON', {
  virtuals: true,
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Card', cardSchema)
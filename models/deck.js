const mongoose = require('mongoose')

const deckSchema = new mongoose.Schema({
  learnLang: {
    type: String,
    required: true,
  },
  natLang: {
    type: String,
    required: true,
  },
  firstFlag: {
    type: String,
    required: true,
  },
  secondFlag: {
    type: String,
    required: true,
  },
  mainDeck: {
    type: Boolean,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  cards: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Card',
    },
  ],
})

deckSchema.index({ user: 1, learnLang: 1 }, { unique: true })

deckSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

const Deck = mongoose.model('Deck', deckSchema)

module.exports = Deck
const deckRouter = require('express').Router()
const User = require('../models/user')
const Deck = require('../models/deck')
const Card = require('../models/card')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')

deckRouter.get('/', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'Token Invalid' })
  }
  const decks = await Deck.find({}).populate('user', { username: 1, name: 1 })
  response.json(decks)
})

deckRouter.post('/', middleware.userExtractor, async (request, response) => {
  const { learnLang, natLang } = request.body

  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'Token invalid' })
  }

  const user = await User.findById(decodedToken.id)
  const existingDecks = await Deck.find({ user: user._id })

  if (existingDecks.length >= 5) {
    return response.status(400).json({ error: 'Maximum of 5 decks allowed' })
  }

  const deck = new Deck({
    learnLang,
    natLang,
    user: user._id,
  })

  const savedDeck = await deck.save()
  user.decks = user.decks.concat(savedDeck._id)
  await user.save()
  response.status(201).json(savedDeck)
})

deckRouter.put('/:id', middleware.userExtractor, async (request, response) => {
  const body = request.body
  const deckId = request.params.id

  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'Token invalid' })
  }

  const user = await User.findById(decodedToken.id)
  const deck = await Deck.findById(deckId)

  if (!deck) {
    return response.status(404).json({ error: 'Deck not found' })
  }

  if (deck.user.toString() === user.id.toString()) {
    const updatedDeck = {
      natLang: body.natLang,
    }

    await Deck.findByIdAndUpdate(deckId, updatedDeck, {
      new: true,
      runValidators: true,
      context: 'query'
    })

    const updatedUser = await User.findById(decodedToken.id).populate('decks', { learnLang: 1, natLang: 1 })

    response.json(updatedUser)
  } else {
    response.status(401).json({ error: 'Invalid operation' })
  }
})

deckRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const deckId = request.params.id
  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'Token invalid' })
  }

  const user = await User.findById(decodedToken.id)
  const deck = await Deck.findById(deckId)

  if (!deck) {
    return response.status(404).json({ error: 'Deck not found' })
  }

  if (deck.user.toString() === user.id.toString()) {
    await Deck.findByIdAndDelete(deckId)

    user.decks = user.decks.filter(deck => deck.toString() !== deckId)
    await user.save()

    response.status(204).end()
  } else {
    response.status(401).json({ error: 'Invalid operation' })
  }
})

module.exports = deckRouter
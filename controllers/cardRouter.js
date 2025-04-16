const cardRouter = require('express').Router()
const Card = require('../models/card')
const User = require('../models/user')
const Deck = require('../models/deck')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')

cardRouter.get('/:deckId', middleware.userExtractor, async (request, response) => {
  const deckId = request.params.deckId

  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'Token Invalid' })
  }

  const deck = await Deck.findById(deckId)

  if (!deck) {
    return response.status(404).json({ error: 'Deck not found' })
  }

  const cards = await Card.find({ deck: deckId })
  response.json(cards)
})

cardRouter.post('/:deckId', middleware.userExtractor, async (request, response) => {
  const body = request.body
  const deckId = request.params.deckId

  console.log('Received request with body:', request.body)
  console.log('Deck ID:', request.params.deckId)

  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'Token invalid' })
  }

  const user = await User.findById(decodedToken.id)
  const deck = await Deck.findById(deckId)

  if (!deck) {
    return response.status(404).json({ error: 'Deck not found' })
  }

  if (deck.user.toString() !== user.id.toString()) {
    return response.status(401).json({ error: 'Invalid oparation' })
  }

  const card = new Card({
    word: body.word,
    translation: body.translation,
    usage: body.usage,
    img: body.img,
    toLearn: body.toLearn,
    known: body.known,
    learned: body.learned,
    gotIt: body.gotIt,
    flipped: body.flipped,
    nextReviewDate: body.nextReviewDate,
    deck: deckId
  })

  const savedCard = await card.save()

  deck.cards = deck.cards.concat(savedCard._id)
  await deck.save()

  response.status(201).json(savedCard)
})

cardRouter.put('/:id', middleware.userExtractor, async (request, response) => {
  const body = request.body
  const cardId = request.params.id

  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'Token invalid' })
  }

  const card = await Card.findById(cardId)

  if (!card) {
    return response.status(404).json({ error: 'Card not found' })
  }

  const deck = await Deck.findById(card.deck)
  const user = await User.findById(decodedToken.id)

  if (deck.user.toString() !== user.id.toString()) {
    return response.status(401).json({ error: 'Invalid operation' })
  }

  const updatedCard = await Card.findByIdAndUpdate(cardId, body, {
    new: true,
    runValidators: true,
    context: 'query'
  })

  response.json(updatedCard)
})

cardRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const cardId = request.params.id

  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'Token invalid' })
  }

  const card = await Card.findById(cardId)
  if (!card) {
    return response.status(404).json({ error: 'Card not found' })
  }

  const deck = await Deck.findById(card.deck)
  const user = await User.findById(decodedToken.id)

  if (deck.user.toString() !== user.id.toString()) {
    return response.status(401).json({ error: 'Invalid operation' })
  }

  deck.cards = deck.cards.filter(c => c.toString() !== cardId.toString())
  await deck.save()

  await Card.findByIdAndDelete(cardId)
  response.status(204).end()
})

module.exports = cardRouter
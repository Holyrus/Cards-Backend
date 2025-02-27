const cardRouter = require('express').Router()
const Card = require('../models/card')
const User = require('../models/user')
const Deck = require('../models/deck')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')

// cardRouter.get('/', async (request, response) => {
//   const decodedToken = jwt.verify(request.token, process.env.SECRET)
//   if (!decodedToken.id) {
//     return response.status(401).json({ error: 'Token Invalid' })
//   }
//   const cards = await Card.find({}).populate('user', { username: 1, name: 1 })
//   response.json(cards)
// })

// cardRouter.post('/decks/:id/cards', middleware.userExtractor, async (request, response) => {
//   const body = request.body

//   const decodedToken = jwt.verify(request.token, process.env.SECRET)

//   if (!decodedToken.id) {
//     return response.status(401).json({ error: 'Token invalid' })
//   }

//   const user = await User.findById(decodedToken.id)
//   const deck = await Deck.findById(request.params.id)

//   if (deck.user.toString() === user.id.toString()) {
//     deck.cards = deck.cards.concat(body)
//     await deck.save()
//     response.status(201).json(deck)
//   } else {
//     response.status(401).json({ error: 'Invalid operation' })
//   }
// })

// cardRouter.get('/:id', async (request, response) => {
//   const card = await Card.findById(request.params.id)
//   if (card) {
//     response.json(card)
//   } else {
//     response.status(404).end()
//   }
// })

// cardRouter.put('/:id', async (request, response) => {
//   const body = request.body

//   const card = {
//     word: body.word,
//     translation: body.translation,
//     usage: body.usage,
//   }

//   await Card.findByIdAndUpdate(request.params.id, card, {
//     new: true,
//     runValidators: true,
//     context: 'query'
//   })
//   response.json(card)
// })

// cardRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
//   const decodedToken = jwt.verify(request.token, process.env.SECRET)

//   if (!decodedToken.id) {
//     return response.status(401).json({ error: 'Token invalid' })
//   }

//   const user = await User.findById(decodedToken.id)
//   const card = await Card.findById(request.params.id)

//   if (card.user.toString() === user.id.toString()) {
//     await Card.findByIdAndDelete(request.params.id)
//     user.cards = user.cards.filter(
//       (c) => c.id.toString() !== request.params.id,
//     )
//     await user.save()
//     response.status(204).end()
//   } else {
//     response.status(401).json({ error: 'Invalid operation' })
//   }
// })

module.exports = cardRouter
const usersRouter = require('express').Router()
const User = require('../models/user')
const Deck = require('../models/deck')
const Card = require('../models/card')

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  const user = new User({
    username,
    name,
  })

  user.password = password

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('decks', { learnLang: 1, natLang: 1 })
  response.json(users)
})

usersRouter.delete('/:id', async (request, response) => {
  const userId = request.params.id

  const userDecks = await Deck.find({ user: userId })

  for (const deck of userDecks) {
    await Card.deleteMany({ deck: deck._id })
  }

  await Deck.deleteMany({ user: userId })

  await User.findByIdAndDelete(userId)
  response.status(204).end()
})

module.exports = usersRouter
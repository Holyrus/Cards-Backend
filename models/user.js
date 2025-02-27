const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minLength: 4,
    maxLength: 15,
    validate: {
      validator: function (v) {
        return /^[a-zA-Z0-9]+$/.test(v) // Only letters and numbers are allowed
      },
      message: (props) => `${props.value} is not a valid username!`,
    },
  },
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 15,
  },
  passwordHash: {
    type: String,
    required: true
  },
  decks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Deck',
    },
  ],
})

// Validation for plain password before hashing
userSchema
  .virtual('password')
  .set(function (password) {
    // Validation logic
    if (!password || password.length < 8) {
      throw new Error('Password must be at least 8 characters long.')
    }
    if (!/[a-z]/.test(password)) {
      throw new Error('Password must contain at least one lowercase letter.')
    }
    if (!/[A-Z]/.test(password)) {
      throw new Error('Password must contain at least one uppercase letter.')
    }
    if (!/[0-9]/.test(password)) {
      throw new Error('Password must contain at least one number.')
    }

    // If validation passes, hash the password
    const saltRounds = 10
    this.passwordHash = bcrypt.hashSync(password, saltRounds)
  })
  .get(function () {
    return null // Do not expose the password in any form
  })

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // The passwordHash should not be revealed
    delete returnedObject.passwordHash
  },
})

const User = mongoose.model('User', userSchema)

module.exports = User
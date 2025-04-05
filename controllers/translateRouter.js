const translateRouter = require('express').Router()
const axios = require('axios')

// docker run -p 5000:5000 libretranslate/libretranslate

translateRouter.post('/', async (req, res) => {
  const { q, source, target, format } = req.body

  try {
    const response = await axios.post('http://localhost:5000/translate', {
      q,
      source,
      target,
      format: format || 'text'
    })

    res.json(response.data)
  } catch (error) {
    console.error('Error during translation:', error.message)
    res.status(500).json({ error: 'Translation failed' })
  }
})

module.exports = translateRouter
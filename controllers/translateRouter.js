require('dotenv').config()
const translateRouter = require('express').Router()
const axios = require('axios')

translateRouter.post('/', async (request, response) => {
  const { text, targetLanguage} = request.body

  if (!text || !targetLanguage) {
    return response.status(400).json({
      error: 'Text and target language are required',
    })
  }

  try {
    const apiResponse = await axios.post(
      'https://libretranslate.de/translate',
      {
        q: text,
        source: 'auto',
        target: targetLanguage,
        format: 'text'
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    return response.json({ translatedText: apiResponse.data.translatedText })
  } catch (error) {
    console.error('Translation error:', error.response?.data || error.message)
    return response.status(500).json({ error: 'Translation failed. Try again later.' })
  }

})

module.exports = translateRouter
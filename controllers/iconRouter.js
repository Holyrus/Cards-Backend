const express = require('express')
const iconRouter = require('express').Router()
const fs = require('fs')
const path = require('path')

const IMAGES_DIR = path.join(__dirname, '../assets/Icons')

iconRouter.get('/', (req, res) => {
  fs.readdir(IMAGES_DIR, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read images directory' })
    }
    res.json(files.filter(file => file.endsWith('.png')))
  })
})

// http://localhost:3003/api/images

iconRouter.use('/files', express.static(IMAGES_DIR))

// http://localhost:3003/api/images/files/3d-coordinate-axis-3oy1hpe8rvewjsae9sa4rg.png

module.exports = iconRouter
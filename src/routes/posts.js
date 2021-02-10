const route = require('express').Router()
const { addPost, getPost } = require('../controllers/posts')

// import helper
const uploadHelper = require('../helpers/upload')

// import controllers
route.post('/', uploadHelper.single('pictures'), addPost)
route.get('/', getPost)

module.exports = route

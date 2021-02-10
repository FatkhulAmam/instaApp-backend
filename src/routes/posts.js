const route = require('express').Router()
const { addPost, getPost, addComment, getPostsById, getCommentById } = require('../controllers/posts')

// import helper
const uploadHelper = require('../helpers/upload')

// import controllers
route.post('/', uploadHelper.single('pictures'), addPost)
route.get('/', getPost)
route.get('/:id', getPostsById)
route.post('/comment/:postId', addComment)
route.get('/comment/:id', getCommentById)

module.exports = route

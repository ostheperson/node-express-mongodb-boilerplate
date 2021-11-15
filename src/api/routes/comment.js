const express = require('express')
const commentRoutes = express.Router()
const auth = require('../middleware/auth')
const commentController = require('../controllers/comment');

commentRoutes.get('/:commentId', auth, commentController.find);
commentRoutes.post('/:postId', auth, commentController.create);
commentRoutes.delete('/:postId/:commentId', auth, commentController.remove);

module.exports = commentRoutes;
const express = require('express')
const postRoutes = express.Router()
const auth = require('../middleware/auth')
const postController = require('../controllers/post');

postRoutes.get('/', auth, postController.find);
postRoutes.post('/', auth, postController.create);
postRoutes.patch('/:postId', auth, postController.update);
postRoutes.get('/:postId', auth, postController.details);
postRoutes.delete('/:postId', auth, postController.remove);

module.exports = postRoutes;
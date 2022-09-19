const express = require('express');
const router = express.Router();
const {userController} = require('../../controller/user.controller');
const auth = require('../../middleware/auth');
const {userValidator} = require('../../validators')
const validate = require('../../middleware/validator');

//protected
router
    .route('/')
    .get(userController.list)
    .post(validate(userValidator.register), userController.create)
    .delete(auth, userController.delete)

router
    .route('/:username')
    .get(userController.getByUsername)
    .patch(auth, userController.update)

router
    .route('/:username/follows')
    .post(auth, userController.toggleFollow)

router.post('/:username/save', auth, userController.toggleBookmark)


module.exports = router;


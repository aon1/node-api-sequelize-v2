const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user')

//create user
router.post('/', UserController.create);

router.get('/', UserController.index);
router.put('/:userId', UserController.update);
router.delete('/:userId', UserController.delete);

module.exports = router;
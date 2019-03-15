const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user')

router.get('/', UserController.index);
router.post('/', UserController.create);
router.put('/:userId', UserController.update);
router.delete('/:userId', UserController.delete);

module.exports = router;
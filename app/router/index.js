const express = require('express');
const router = express.Router()
const user = require('./user');
const brand = require('./brand');

router.use('/users', user);
router.use('/brands', brand);

module.exports = router
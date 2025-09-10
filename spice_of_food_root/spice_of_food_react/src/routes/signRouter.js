const express = require('express');
const userController = require('../controllers/signController');
const router = express.Router();

router.get('/check-email', userController.checkEmail);

router.post('/', userController.joinUser);

module.exports = router;

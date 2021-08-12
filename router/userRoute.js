const express = require('express');
const { userController } = require('../controllers/userController');
const router = express.Router();
const userMiddleware = require('../middlewares/userMiddleware');

router.post('/signup', userMiddleware.userMiddleware, userController );

module.exports = router;
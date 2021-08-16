const express = require('express');
const { userSignupController, userLoginController, getUsers, changePassword } = require('../controllers/controller');
const router = express.Router();
const userMiddleware = require('../middlewares/middleware');

router.post('/signup', userMiddleware.userSignupMiddleware, userSignupController );
router.post('/login', userMiddleware.userLoginMiddleware, userLoginController);
router.get('/getusers', userMiddleware.tokenVerifier, getUsers);    
router.post('/changepassword', userMiddleware.tokenVerifier, userMiddleware.changePasswordMiddleware,changePassword);

module.exports = router;
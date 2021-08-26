const express = require('express');
//const { userSignupController, userLoginController, getUsers, changePassword, resetRequest, resetPassword, imageUpload, fetchImage } = require('../controllers/controller');
const authRouter = express.Router();
const {tokenVerifier} = require('../middlewares/tokenVerifier');
const {userSignupController, userLoginController, resetRequest, resetPassword} = require('../controllers/auth')

//auth routes
authRouter.post('/signup', userSignupController );
authRouter.post('/login', userLoginController);
authRouter.post('/resetrequest', resetRequest);
authRouter.post('/resetpassword', tokenVerifier, resetPassword);

module.exports = authRouter;
const express = require('express');
//const { userSignupController, userLoginController, getUsers, changePassword, resetRequest, resetPassword, imageUpload, fetchImage } = require('../controllers/controller');
const userRouter = express.Router();
const {upload} = require('../middlewares/multer');
const {tokenVerifier} = require('../middlewares/tokenVerifier');
const {changePassword, getUsers, imageUpload, fetchImage} = require('../controllers/user');


// user routes
userRouter.get('/getusers', tokenVerifier, getUsers);    
userRouter.post('/changepassword', tokenVerifier, changePassword);
userRouter.post('/imageupload', upload.single('imageUpload'), tokenVerifier, imageUpload)
userRouter.get('/getimage', tokenVerifier, fetchImage)

module.exports = userRouter;
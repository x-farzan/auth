const express = require('express');
//const { userSignupController, userLoginController, getUsers, changePassword, resetRequest, resetPassword, imageUpload, fetchImage } = require('../controllers/controller');
const adminRouter = express.Router();
const {upload} = require('../middlewares/multer');
const {tokenVerifier} = require('../middlewares/tokenVerifier');
const {isAuthorized} = require('../middlewares/isAuthorized');
const {getMusic, addMusic, updateMusic, deleteMusic} = require('../controllers/admin');

// admin routes
adminRouter.get('/getmusic', tokenVerifier, isAuthorized, getMusic);
adminRouter.post('/addmusic', tokenVerifier, isAuthorized, addMusic);
adminRouter.put('/updatemusic/:name', tokenVerifier, isAuthorized, updateMusic);
adminRouter.delete('/deletemusic/:name', tokenVerifier, isAuthorized, deleteMusic)

module.exports = adminRouter;
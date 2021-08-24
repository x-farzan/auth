const express = require('express');
const { userSignupController, userLoginController, getUsers, changePassword, resetRequest, resetPassword, imageUpload, fetchImage } = require('../controllers/controller');
const router = express.Router();
const userMiddleware = require('../middlewares/middleware');
const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    }else{
        cb(null, false);
    }
};

const upload = multer({
    storage: storage, 
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

router.post('/signup', userMiddleware.userSignupMiddleware, userSignupController );
router.post('/login', userMiddleware.userLoginMiddleware, userLoginController);
router.get('/getusers', userMiddleware.tokenVerifier, getUsers);    
router.post('/changepassword', userMiddleware.tokenVerifier, userMiddleware.changePasswordMiddleware,changePassword);
router.post('/resetrequest', userMiddleware.resetRequestMiddleware, resetRequest);
router.post('/resetpassword',userMiddleware.tokenVerifier, resetPassword);
router.post('/imageupload', upload.single('imageUpload'), userMiddleware.tokenVerifier, imageUpload)
router.get('/getimage', userMiddleware.tokenVerifier, fetchImage)

module.exports = router;
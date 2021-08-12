
const mongoose = require('mongoose');
const User = require('../models/userModel');
const validator = require('validator');
const _ = require('lodash');
const userValidator = require('../controllers/userController')

exports.userMiddleware = (req,res,next) => {

    let _errors = userValidator.userValidator(['name', 'email', 'password', 'phone', 'address',], req.body);
    if(_errors.length > 0){
        res.send(_errors);
    }

    if(validator.isEmail(req.body.email) ){
        User.find({email: req.body.email}).exec().then(user => {
            if(user.length >= 1){
                return res.status(409).json({
                    message: "Email already exists!"
                });
            }
            else{
                next();
            }
        }).catch(err => {
            res.json({
                error:err
            })
        });
    }
    else{
        res.json({
            message: "Enter a valid email."
        })
    }
        
}
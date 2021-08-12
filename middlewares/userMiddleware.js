
const mongoose = require('mongoose');
const User = require('../models/userModel');
const validator = require('validator');

exports.userMiddleware = (req,res,next) => {

    if (validator.isEmpty)


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

const mongoose = require('mongoose');
const User = require('../models/model');
const validator = require('validator');
const _ = require('lodash');
const userFieldsValidator = require('../controllers/controller')
const bCrypt = require('bcrypt');
const express = require('express')
const router = express.Router();
require('dotenv').config();
const jwt = require('jsonwebtoken');

exports.userSignupMiddleware = (req,res,next) => {

    let _errors = userFieldsValidator.userFieldsValidator(['name', 'email', 'password', 'phone', 'address',], req.body);
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


exports.userLoginMiddleware = (req,res,next) => {
    let _errors = userFieldsValidator.userFieldsValidator(['email', 'password'], req.body);
    if(_errors.length > 0){
        res.send(_errors);
    }
    User.find({email: req.body.email})
        .exec()
        .then(user =>{
            if(user.length < 1){
                return res.status(401).json({
                    message : "Email not found."
                });
            }
            req.user = user[0];
            next();
            
        })
        .catch(err => {
            console.log("ERROR",err);
            return res.status(500).json({
                error: err
            });
        });
}

exports.tokenVerifier = (req,res,next) =>{
    try{
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, process.env.JWT_KEY, (err,auth) => {
            if(auth){
                // console.log(auth);
                req.userData = auth;
                next();
            } 
            else {
                res.send("Token Expired")
            }
        })
    }
    catch(error){
        return res.status(401).json({
            message: "Auth failed"
        })
    }
}

exports.changePasswordMiddleware = (req,res,next) => {

    let _errors = userFieldsValidator.userFieldsValidator(['oldPassword', 'newPassword', 'confirmPassword'], req.body);
    if(_errors.length > 0){
        res.send(_errors);
    }

    req.myData = {
        "oldPassword": req.body.oldPassword,
        "newPassword": req.body.newPassword,
        "confirmPassword": req.body.confirmPassword
    }
    User.find({email: req.userData.email}).exec().then(user => {
        if(user.length < 1){
            res.json({message :"User doesn't exist"});
        }
        else{
            bCrypt.compare( req.myData.oldPassword, user[0].password, (err, result) => {
                if(result){
                    if( req.myData.newPassword ===  req.myData.confirmPassword){
                        req.userData = user[0];
                        next();
                    }
                    else{
                        res.json({
                            message: "Your new password doesn't matches with the confirm password"
                        })
                    }
                }
                else{
                    res.json({
                        message:"Your old password is not correct"
                    })

                }
            })
        }
    }).catch(err => {
        res.json({
            message: err
        })
    })
}
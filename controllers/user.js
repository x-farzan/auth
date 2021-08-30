const bCrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const nodemailer = require("nodemailer");
const mongoose = require('mongoose');
const validator = require('validator');
const userFieldsValidator = require('../utils/utils')
const express = require('express')
const router = express.Router();
const Permission = require('../models/permissions');


exports.changePassword = (req,res) => {
    // validating inputs
    let _errors = userFieldsValidator.userFieldsValidator(['oldPassword', 'newPassword', 'confirmPassword'], req.body);
    if(_errors.length > 0){
        res.send(_errors);
    }   
    User.find({email: req.userData.email}).exec().then(user => {
        if(user.length < 1){
            res.json({message :"User doesn't exist"});
        }
        else{
            // matching the old passwords and then assigning a new hashed one
            bCrypt.compare( req.body.oldPassword, user[0].password, (err, result) => {
                if(result){
                    if( req.body.newPassword ===  req.body.confirmPassword){
                        //
                        bCrypt.hash( req.body.newPassword, 10, (err, hash) => {
                            if(hash){
                                console.log(hash);
                                req.userData.password = hash;
                                user[0].save().then(result => {
                                    res.json({
                                        message:"Password updated successfully",
                                        oldPassword:  req.body.oldPassword,
                                        newPassword:  req.body.newPassword
                                    })
                                }).catch(err => {
                                    res.json({message: "Password update failed"})
                                })
                            }
                            else{
                                res.json({
                                    message: "Cannot hash password"
                                })
                            }
                        })
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

exports.fetchImage = (req,res) => {
    User.find({email: req.userData.email})
    .exec()
    .then(user =>{
        if(user.length < 1){
            return res.status(401).json({
                message : "Email not found."
            });
        }
        res.json({
            imageUrl: user[0].image
        })
    })
    .catch(err => {
        console.log("ERROR",err);
        return res.status(500).json({
            error: err
        });
    });
}

exports.getUsers = (req,res) => {
    User.find({email:req.userData.email}).exec().then(user=>{
        if(user.length < 1){
            return res.json({
                message:"User not find."
            });
        }  
        res.json({
            email : user[0].name,
            phone: user[0].phone,
            address: user[0].address,
            userType: user[0].userType
        })
    }).catch(err => {
        res.json({
            message : "ERROR : ${err}, occured!"
        })  
    })    
}

exports.imageUpload = (req,res) => {
    User.find({email: req.userData.email})
    .exec()
    .then(user =>{
        if(user.length < 1){
            return res.status(401).json({
                message : "Email not found."
            });
        }
        user[0].image = req.file.path;
        user[0].save().then(result => {
            res.json({
                message:"Image saved!"
            })
        }).catch(err => {
            res.json({
                message:"IMage not saved."
            })
        })
    })
    .catch(err => {
        console.log("ERROR",err);
        return res.status(500).json({
            error: err
        });
    });
}

exports.seePermissions = (req,res) => {
    res.json({
        message: `User is allowed to ${req.perm[0].name} and ${req.perm[1].name}`
    })
}
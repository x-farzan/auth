const bCrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const nodemailer = require("nodemailer");
const userFieldsValidator = require('../utils/utils');
const validator = require('validator');
const {sendEmail} = require('../utils/utils')

exports.userSignupController = (req,res) => {
    //validating the input fields
    let _errors = userFieldsValidator.userFieldsValidator(['name', 'email', 'password', 'phone', 'address',], req.body);
    if(_errors.length > 0){
        res.send(_errors);
    }
    //checking for the email, if already exists!!
    if(validator.isEmail(req.body.email) ){
        User.find({email: req.body.email}).exec().then(user => {
            if(user.length >= 1){
                return res.status(409).json({
                    message: "Email already exists!"
                });
            }
            else{
                 // Creating a user
                bCrypt.hash(req.body.password, 10, (err, hash) => {
                    if(err){
                        res.status(500).json({
                            message: "Password is required."
                        })
                    }
                    else{
                        const user = new User({
                            //_id = new mongoose.Types.ObjectId(),
                            name: req.body.name,
                            email: req.body.email,
                            password: hash,
                            phone: req.body.phone,
                            address: req.body.address
                        })
                        user.save().then(result => {
                            res.status(201).json({
                                message:"User created successfully"
                            })
                        }).catch(err => {
                            res.status(500).json({
                                error:err
                            })
                        });
                    }
                })
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

exports.userLoginController = (req,res) => {
    //aaValidating input fields
    let _errors = userFieldsValidator.userFieldsValidator(['email', 'password'], req.body);
    if(_errors.length > 0){
        res.send(_errors);
    }
    // checking for email, if exists
    User.find({email: req.body.email})
        .exec()
        .then(user =>{
            if(user.length < 1){
                return res.status(401).json({
                    message : "Email not found."
                });
            }
            // comparing passwords and assigning token in user's db
            bCrypt.compare(req.body.password, user[0].password, (err, result) => {        
                if(result) {
                    const token = jwt.sign({email:user[0].email, id:user[0]._id}, process.env.JWT_KEY, {expiresIn: '24h'});
                    //req.token = token;
                    return res.status(200).json({
                        message:"Auth successfull",
                        token: token
                    })
                }
                else {
                    return res.status(401).json({
                        message: "Auth failed"
                    });
                    }
                })
            
        })
        .catch(err => {
            console.log("ERROR",err);
            return res.status(500).json({
                error: err
            });
        });

    
}

exports.resetRequest = (req, res) => {
    // validating inputs
    let _errors = userFieldsValidator.userFieldsValidator(['email'], req.body);
    if(_errors.length > 0){
        res.send(_errors);
    }
    // sending reset token to mailtrap
    User.find({email: req.body.email})
        .exec()
        .then(user =>{
            if(user.length < 1){
                return res.status(401).json({
                    message : "Email not found."
                });
            }
                //email should be the one in the DB
            const resetToken = jwt.sign({email:req.body.email}, process.env.JWT_KEY, {expiresIn: "24h"});
            if(sendEmail(resetToken)){
                res.json({
                    message:"Email sent successfully!"
                })
            }
            user[0].resetToken = resetToken;
            user[0].save().then(result => {
                res.json({
                    message:"Token updated in DB.",
                })
            }).catch(err => {
                res.json({message: "Token updation in DB failed."})
            })
            
        })
        .catch(err => {
            console.log("ERROR",err);
            return res.status(500).json({
                error: err
            });
        });


    
}

exports.resetPassword = (req,res) => {
    const newPassword = req.body.password
    User.find({email: req.userData.email})
        .exec()
        .then(user =>{
            if(user.length < 1){
                return res.status(401).json({
                    message : "Email not found."
                });
            }
            // hashing new password and uploadding the old one
            bCrypt.hash(newPassword, 10, (err,hash)=>{
                if(hash){
                    user[0].password = hash;
                    user[0].resetToken = null;
                    user[0].save().then(result => {
                        res.json({
                            message:"Password reset successfully!"
                        })
                    }).catch(err => {
                        res.json({
                            message:"Password reset failed due to : ${err}"
                        })
                    })
                }else{
                    res.json({
                        message:"Couldn't hash the password"
                    })
                }
            })
        })
        .catch(err => {
            console.log("ERROR",err);
            return res.status(500).json({
                error: err
            });
        });
}


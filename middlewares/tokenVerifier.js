const mongoose = require('mongoose');
const User = require('../models/user');
const validator = require('validator');
const _ = require('lodash');
const userFieldsValidator = require('../utils/utils')
const bCrypt = require('bcrypt');
const express = require('express')
const router = express.Router();
require('dotenv').config();
const jwt = require('jsonwebtoken');


exports.tokenVerifier = (req,res,next) =>{
    try{
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, process.env.JWT_KEY, (err,auth) => {
            if(auth){
                //console.log(auth);
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
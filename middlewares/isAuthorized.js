const mongoose = require('mongoose');
const User = require('../models/user');
const Roles = require('../models/roles')
const Permissions = require('../models/permissions')
const validator = require('validator');
const _ = require('lodash');
const userFieldsValidator = require('../utils/utils')
const bCrypt = require('bcrypt');
const express = require('express')
const router = express.Router();
require('dotenv').config();
const jwt = require('jsonwebtoken');

exports.isAuthorized = (req,res,next) => {
    //FINDING USER
    User.find({email: req.userData.email})
    .exec()
    .then(user =>{
        if(user.length < 1){
            return res.status(401).json({
                message : "Email not found."
            });
        }
        const role_id = user[0].role;
        //FINDING ROLES
        Roles.find({_id: role_id})
        .exec()
        .then(role =>{
            if(role.length < 1){
                return res.status(401).json({
                    message : "role not found."
                });
            }
            const permissions = role[0].permission;
            // FINDING PERMISSIONS
            Permissions.find({
                '_id': { $in: [
                    mongoose.Types.ObjectId(permissions[0]),
                    mongoose.Types.ObjectId(permissions[1])
                ]}
            })
            .exec()
            .then(perm =>{
                if(perm.length < 1){
                    return res.status(401).json({
                        message : "permissions not found."
                    });
                }
                // GETTING PERMISSION NAMES
                console.log(perm);
                req.perm = perm;
                next();
            })
            .catch(err => {
                console.log("ERROR",err);
                return res.status(500).json({
                    error: err
                });
            });
        })
        .catch(err => {
            console.log("ERROR",err);
            return res.status(500).json({
                error: err
            });
        });
    })
    .catch(err => {
        console.log("ERROR",err);
        return res.status(500).json({
            error: err
        });
    });
}
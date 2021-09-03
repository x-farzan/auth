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
    const reqType = req.method;
    let baseUrl = req.baseUrl;
    baseUrl = baseUrl.substr(1);
    var str = undefined;
    var perm = [];
    
    switch(reqType){
        case 'GET':
            str =  `view-${baseUrl}`;
            break
        case 'POST':
            str = `create-${baseUrl}`;
            break;
        case 'PUT':
            str =  `update-${baseUrl}`;
            break;
        case 'DELETE':
            str = `delete-${baseUrl}`;
            break;
        default:
            res.json({
                message: `Invalid request type`
            })
    }
    

    //FINDING USER
    User.find({email: req.userData.email})
    .exec()
    .then(user =>{
        if(user.length < 1){
            return res.status(401).json({
                message : "Email not found."
            });
        }
        // console.log( user[0]);
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
            // console.log(permissions);
            // FINDING PERMISSIONS
            // try{
            //     for(var i = 0; i< permissions.length; i++){
            //         perm.push(Permissions.find({_id: permissions[i]}).exec());
            //     }
            //     console.log(perm);
            // }catch(error){
            //     res.json({
            //         message: `Couldn't find permissions`
            //     })
            // }
            for (var i = 0; i< permissions.length; i++){
                Permissions.find({_id:permissions[i]})
                .exec()
                .then(result =>{
                    if(result.length < 1){
                        return res.status(401).json({
                            message : "permissions not found."
                        });
                    }
                    // GETTING PERMISSION NAMES
                    //console.log(result);
                    perm.push(result);
                   if (perm.length === permissions.length){
                        req.perm = {
                            str: str,
                            perm: perm
                        }
                        //console.log(req.perm.perm);
                        next();
                    }
                })
                .catch(err => {
                    console.log("ERROR",err);
                    return res.status(500).json({
                        error: err
                    });
                });
            }
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
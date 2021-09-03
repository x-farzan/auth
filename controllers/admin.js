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
const Music = require('../models/music')


exports.getMusic = (req,res) => {
    Music.find().exec().then(music => {
        if(music.length < 1){
            res.json({
                message: `Music not found`
            })
        }
        res.json({
            music: music
        })
    }).catch(err => {
        res.json({
            message: `Track not found`
        })
    })
}

exports.addMusic = (req,res) => {
    const name = req.body.name;
    const artist = req.body.artist;
    const music = new Music({
        name : name,
        artist : artist
    });
    music.save().then(result => {
        res.json({
            message: `New track added to your library`
        })
    }).catch(error => {
        res.json({
            message: `Adding new track failed`
        })
    });
}

exports.updateMusic = (req,res) => {
    const name = req.body.name;
    const artist = req.body.artist;
    Music.find({name:req.params.name}).exec().then(result => {
        if(result.length < 1){
            res.json({
                message: `Music not found`
            })
        }
        console.log(result[0].name);
        result[0].name = name;
        console.log(result[0].name);
        result[0].artist = artist;
        result[0].save().then(result => {
            res.json({
                message: `Track updated in your library`,
                music: `Updated song : ${result.name} and Artist : ${result.artist}`
            })
        }).catch(error => {
            res.json({
                message: `Updating track failed`
            })
        });
    }).catch(err => {
        res.json({
            message: `Track not found`
        })
    })
    // res.send(req.params.name);
}

exports.deleteMusic = (req,res) => {
    Music.find({name:req.params.name}).exec().then(result => {
        if(result.length < 1){
            res.json({
                message: `Music not found`
            })
        }
        result[0].delete().then(result => {
            res.json({
                message: `Track deleted successfully!`
            })
        }).catch(error => {
            res.json({
                message: `Failed to delete track.`
            })
        });
    }).catch(err => {
        res.json({
            message: `Track not found`
        })
    })
}
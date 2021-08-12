const bCrypt = require('bcrypt');
const User = require('../models/userModel');

exports.userValidator = (fields, req) => {
    let errors = [];
    fields.forEach(field => {
        if(req[field] === '' || req[field] === null || req[field] === undefined){
            return errors.push(field + " is required");
        }
    });
    return errors;
}

exports.userController = (req,res) => {
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
const bCrypt = require('bcrypt');
const User = require('../models/model');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const nodemailer = require("nodemailer");


// field validator ffunction
exports.userFieldsValidator = (fields, req) => {
    let errors = [];
    fields.forEach(field => {
        if(req[field] === '' || req[field] === null || req[field] === undefined){
            return errors.push(field + " is required");
        }
    });
    return errors;
}

// user signup controller
exports.userSignupController = (req,res) => {
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


//user login controller
exports.userLoginController = (req,res) => {
    bCrypt.compare(req.body.password, req.user.password, (err, result) => {        
    if(result) {
        const token = jwt.sign({email:req.user.email, id:req.user._id}, process.env.JWT_KEY, {expiresIn: '1h'});
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
}



// get users
exports.getUsers = (req,res) => {
    res.json({
        message: "Authentic user, you can see the users secret page."
    })
}

//change Password
exports.changePassword = (req,res) => {
    bCrypt.hash( req.myData.newPassword, 10, (err, hash) => {
        if(hash){
            console.log(hash);
            req.userData.password = hash;
            req.userData.save().then(result => {
                res.json({
                    message:"Password updated successfully",
                    oldPassword:  req.myData.oldPassword,
                    newPassword:  req.myData.newPassword
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

//nodemailer
exports.sendEmail = async (token) => {
    var transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "ee6f9fa8cef44e",
          pass: "45a93a72275616"
        }
    });
    
    var mailOptions = {
        from: 'farzan.hassan@optimusfox.com',
        to: 'farzanhassan245@gmail.com',
        subject: 'Sending Email using Node.js',
        text: `Hello! This is your reset token : ${token}`
    };
    
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log("sendmail" + error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};


//Password reset request
exports.resetRequest = (req, res) => {
    //email should be the one in the DB
    console.log(req.myData.email);
    const resetToken = jwt.sign({email:req.myData.email}, process.env.JWT_KEY, {expiresIn: "24h"});
    if(this.sendEmail(resetToken)){
        res.json({
            message:"Email sent successfully!"
        })
    }
    console.log("HERE");
    req.myData.user.resetToken = resetToken;
    req.myData.user.save().then(result => {
        res.json({
            message:"Token updated in DB.",
        })
    }).catch(err => {
        res.json({message: "Token updation in DB failed."})
    })
    
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
            bCrypt.hash(newPassword, 10, (err,hash)=>{
                if(hash){
                    //console.log(req.userData);
                    user[0].password = hash;
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
    // bCrypt.hash(newPassword, 10, (err,hash)=>{
    //     if(hash){
    //         req.userData.password = hash;
    //         req.userData.save().then(result => {
    //             res.json({
    //                 message:"Password updated successfully!"
    //             })
    //         }).catch(err => {
    //             res.json({
    //                 message:"Password updation failed due to : ${err}"
    //             })
    //         })
    //     }else{
    //         res.json({
    //             message:"Couldn't hash the password"
    //         })
    //     }
    // })
}
const bCrypt = require('bcrypt');
const User = require('../models/user');
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
const bCrypt = require('bcrypt');
const User = require('../models/model');
const jwt = require('jsonwebtoken');

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
                res.json({message: "PAssword update failed"})
            })
        }
        else{
            res.json({
                message: "Cannot hash password"
            })
        }
    })
}
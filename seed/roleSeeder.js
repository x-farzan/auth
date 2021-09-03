const Roles = require('../models/roles');
const mongoose = require('mongoose');
const Permissions = require('../models/permissions')
require('dotenv').config()
// mongoose connection
mongoose.connect(process.env.MODEL_URI, {
    useNewUrlParser:true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => {
    console.log('Connected with database.');
}).catch((err) => {
    console.log(`Connection failed.`);
})

Permissions.find().exec().then(result => {
    // console.log(result);
    const roles = [
    new Roles({
        name:'user',
        permission: [result[0]._id, result[1]._id, result[5]._id]
    }),
    new Roles({
        name:'admin',
        permission: [result[2]._id, result[3]._id, result[4]._id, result[6]._id, result[7]._id]
    })
]
    var done = 0;
    for(var i=0; i< roles.length; i++){
        roles[i].save((err,result) => {
            done++;
            if(done === roles.length){
                mongoose.disconnect();
            }
        })
    };
}).catch(error => {
    console.log(`couldn't fetch`);
})


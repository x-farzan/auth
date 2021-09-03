const Permissions = require('../models/permissions');
const mongoose = require('mongoose');
const { exit } = require('process');
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


const permissions = [
    new Permissions({
        name:'create-user',
        group: 'user'
    }),
    new Permissions({
        name:'view-user',
        group: 'user'
    }),
    new Permissions({
        name:'update-user',
        group: 'admin'
    }),
    new Permissions({
        name:'delete-user',
        group: 'admin'
    }),
    //
    new Permissions({
        name:'create-music',
        group: 'admin'
    }),
    new Permissions({
        name:'view-music',
        group: 'user'
    }),
    new Permissions({
        name:'update-music',
        group: 'admin'
    }),
    new Permissions({
        name:'delete-music',
        group: 'admin'
    }),
];

var done = 0;
for(var i=0; i< permissions.length; i++){
    permissions[i].save((err,result) => {
        done++;
        if(done === permissions.length){
            mongoose.disconnect();
            
        }
    })
};



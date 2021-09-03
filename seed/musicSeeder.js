const Music = require('../models/music');
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


const music = [
    new Music({
        name:'Dont Mind',
        artist: 'Young Stunners'
    }),
    new Music({
        name:'Kun faya kun',
        artist: 'AR Rehman'
    }),
    new Music({
        name:'Adat',
        artist: 'Atif Aslam'
    }),
    new Music({
        name:'Enna sona',
        artist: 'Arijit Singh'
    }),
];

var done = 0;
for(var i=0; i< music.length; i++){
    music[i].save((err,result) => {
        done++;
        if(done === music.length){
            mongoose.disconnect();
            
        }
    })
};
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const morgan = require('morgan');
const router = require('./router/userRoute');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');
dotenv.config();
const port = process.env.PORT || 8080;

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

app.listen(port, () => {
    console.log(`Server started at port : ${port}`);
})

// Initialize ejs
app.set('view engine', 'ejs');

// to make uploads folder static
app.use('/uploads', express.static('uploads'));

app.use(morgan('dev'));
app.use(express.json());
app.use('/', router);
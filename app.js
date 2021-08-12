const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const morgan = require('morgan');
const router = require('./router/userRoute');
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

app.use(morgan('dev'));
app.use(express.json());
app.use('/', router);
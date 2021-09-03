const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const morgan = require('morgan');
const userRouter = require('./routes/user');
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');
dotenv.config();
const port = process.env.PORT || 8080;

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

// listening port
app.listen(port, () => {
    console.log(`Server started at port : ${port}`);
})

// to make uploads folder static, in multer
app.use('/uploads', express.static('uploads'));

app.use(morgan('dev'));

// json parser
app.use(express.json());

//auth routes
app.use('/', authRouter)

//forwarding requests to routes
app.use('/user', userRouter);

//forwarding requests to admin
app.use('/admin', adminRouter);
const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        //_id = mongoose.Schema.Types.ObjectId,
        name: {type:String, required: [true, 'User name required']},
        email: {type:String, required:true},
        password: {type: String, required:true},
        phone: {type: Number, required:true},
        address: {type: String, required: true},
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema)
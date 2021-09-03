const { ObjectID } = require('bson');
const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        //_id = mongoose.Schema.Types.ObjectId,
        name: {type:String, required: true},
        email: {type:String, required:true},
        password: {type: String, required:true},
        phone: {type: Number, required:true},
        address: {type: String, required: true},
        resetToken: ({type: String}),
        image: {type:String},
        userType: {type: String, enum : ['user','admin'], default: 'user'},
        role: {type: ObjectID, enum : ['6131c1df725e0e27ac336768','6131c1df725e0e27ac336769'], default:'6131c1df725e0e27ac336768'}
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema)
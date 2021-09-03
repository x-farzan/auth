const mongoose = require('mongoose');

const musicSchema = mongoose.Schema(
    {
        //_id = mongoose.Schema.Types.ObjectId,
        name: {type:String, required: true},
        artist : {type:String, required:true}
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Music", musicSchema)
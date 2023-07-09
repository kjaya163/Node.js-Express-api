const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    userName: {
        type:String,
        required:[true, "Please add the user name"],
    },
    email:{
        type:String,
        required:[true, "Please Enter User Email Address"],
        unique: [true, "Email Address allready taken"],
    },
    password:{
        type: String,
        required: [true, "Please add User password"]
    }
},{
    timestamps: true,
});

module.exports = mongoose.model("User", userSchema);
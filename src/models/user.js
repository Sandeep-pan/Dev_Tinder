const { type } = require("express/lib/response");
const { default: mongoose } = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
    },
    lastName : {
        type : String,
    },
    emailID : {
        type : String,
        required : [true, "Email is required"],
        validate : {
            validator: validator.isEmail,
            message: 'Invalid Email'
        },
    },
    password : {
        type : String,
    },
    age : {
        type : Number
    },
    gender : {
        type : String,
    },
},
{
    timestamps : true,
});
module.exports = mongoose.model("user", userSchema);
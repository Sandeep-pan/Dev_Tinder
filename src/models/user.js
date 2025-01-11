const { type } = require("express/lib/response");
const { default: mongoose } = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
    },
    lastName : {
        type : String,
        required : true,
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
        required : true,
    },
    age : {
        type : Number,
    },
    gender : {
        type : String,
    },
    photoUrl : {
        type : String,

    },
},
{
    timestamps : true,
});

userSchema.methods.getJWT = async function () {
    const user = this;

    const token = await jwt.sign({ _id: user._id }, "DEV@Tinder2904" ,{
        expiresIn: "7d",
    });

    return token;
};
module.exports = mongoose.model("user", userSchema);
const mongoose = require("mongoose");
const User = require("./user");

const connectionRequestSchema = mongoose.Schema(
    {
        fromUserId:{
            type : mongoose.Schema.Types.ObjectId,
            ref : User,
            require : true,
        },
        toUserId:{
            type : mongoose.Schema.Types.ObjectId,
            ref : User,
            require : true,
        },
        status :{
            type : String,
            enum : {
                values : ["ignored","interested","accepted","rejected",],
                message : `{value} is incorrect status type`,
            },
        },
    },
{
    timestamps : true,
},
);
 connectionRequestSchema.pre("save", function (next) {
    const connectionRequest = this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("You cannot send Request to Yourself");
        
     };
     next();
 })
 
module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);
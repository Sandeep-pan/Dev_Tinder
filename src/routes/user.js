const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../Middlewares/auth");
const connectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const Safe_User_Data = "firstName lastName age gender photoUrl";

userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
    try {

        const loggedInUser = req.user;
        const connectionRequests = await connectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate("fromUserId", Safe_User_Data);

        res.json({ data: connectionRequests });
    } catch (error) {

        res.status(400).send("error :" + error.message);

    }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {

        const loggedInUser = req.user;
        const connectionRequests = await connectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUserId: loggedInUser._id, status: "accepted" }
            ]
        }).populate("fromUserId", Safe_User_Data)
            .populate("toUserId", Safe_User_Data);

        const data = connectionRequests.map((row) => {
            if (row.fromUserId._id.toString() == loggedInUser._id.toString()) {
                return row.toUserId;
            }
            return row.fromUserId
        });

        res.json({ data });

    } catch (error) {
        res.status(400).send("error :" + error.message);

    }
});

userRouter.get("/feed", userAuth, async (req,res) => {
    try {
        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50:limit;
        const skip = (page-1) * limit;


        const connectionRequests = await connectionRequest.find({
            $or : [{fromUserId : loggedInUser._id}, {toUserId : loggedInUser._id},
            ],
        }).select("fromUserId toUserId");
        
        const hideUsersFromFeed = new Set();
        connectionRequests.forEach((req) =>{
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });
         
        const users = await User.find({
            $and : [
               { _id : {$nin : Array.from(hideUsersFromFeed)}},
               {_id : {$ne : loggedInUser._id}},
            ],
        }).select(Safe_User_Data).skip(skip).limit(limit);
        res.json({data:users});
    } catch (error) {
        res.status(400).send("error :" + error.message);
    }
})



module.exports = userRouter;

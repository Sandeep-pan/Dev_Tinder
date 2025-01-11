const express = require("express");
const { userAuth } = require("../Middlewares/auth");
const User = require("../models/user");
const requestRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const user = require("../models/user");
const mongoose = require("mongoose");

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const isAllowedStatus = ["ignored", "interested"];
        if (!isAllowedStatus.includes(status)) {
            return res
                .status(400)
                .json({ message: "Invalid status type " + status });
        };

        const toUser = await User.findById(toUserId)
        if (!toUser) {
            return res.status(400).json({ message: "User not found" });
        };

        const existingConnectionRequst = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId },
            ]
        })
        if (existingConnectionRequst) {
            return res.status(400).json({ message: "Request already exist" });
        }
        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        });
        const data = await connectionRequest.save();

        res.json({
            message: "Connection Request Sent",
            data,
        })


    } catch (error) {
        res.status(400).send("error :" + error.message);
    }
});

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {

        const loggedInUser = req.user;
        const isAllowedStatus = ["accepted", "rejected"];
        const { status, requestId } = req.params;


        if (!isAllowedStatus.includes(status)) {
            return res.status(400).json({ message: "Invalid status type" + status });
        };

        const connectionRequest = await ConnectionRequest.findOne({
            _id: new mongoose.Types.ObjectId(requestId),
            toUserId: loggedInUser._id,
            status: "interested",
        });
        if (!connectionRequest) {
            return res.status(400).json({ message: "request not found" });
        };
        connectionRequest.status = status;
        const data = await connectionRequest.save();

        res.json({ message: "connection request" + status, data });

    } catch (error) {
        res.status(400).send("error :" + error.message);
    }
})
module.exports = requestRouter;
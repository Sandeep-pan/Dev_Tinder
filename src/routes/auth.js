const express = require("express");
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const JWT = require("jsonwebtoken");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
    try {
        validateSignUpData(req);
        const { firstName, lastName, emailID, password } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({
            firstName,
            lastName,
            emailID,
            password: passwordHash,
        });
       const savedUser =  await user.save();
       const token = await savedUser.getJWT();
       res.cookie("token",token, {
        expires: new Date(Date.now() + 8 * 3600000)
       });
        res.json({message : "User added Successfully", data : savedUser});
    } catch (error) {
        res.status(400).send("ERROR :" + error.message);

    }
});

authRouter.post("/login", async (req, res) => {
    try {
        const { emailID, password } = req.body;

        const user = await User.findOne({ emailID: emailID });
        if (!user) {
            throw new Error("Invalid Credentials");
        }
        //console.log("Password provided:", password);
        //console.log("Password from DB:", user.password);

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {

            const token = await user.getJWT();
            res.cookie("token", token, {
                expires: new Date(Date.now() + 8 * 3600000)
               });

            res.send(user);
        } else {
            throw new Error("Invalid Credentials");

        }

    } catch (error) {
        res.status(400).send("ERROR :" + error.message);

    }
});

authRouter.post("/logout", async (req, res) =>{
    res.cookie("token", null, {
        expires : new Date(Date.now())
    });
    res.send("Logout Successfully");
});

module.exports = authRouter;
const express = require("express");
const { userAuth } = require("../Middlewares/auth");
const {validateEditProfileData} = require("../utils/validation");
const profileRouter = express.Router();


profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch (error) {
        res.status(400).send("ERROR :" + error.message);

    }

});

profileRouter.patch("/profile/edit", userAuth, async (req, res)=>{

    try {
       if(!validateEditProfileData(req)){
        throw new Error("Edit Request is not Valid");
       }

        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
        await loggedInUser.save();
        res.send(`${loggedInUser.firstName}, Your profile Updated Successfully!!`);

        
    } catch (error) {
        res.status(400).send("ERROR :" + error.message);
        
    }

})

profileRouter.patch("/profile/forgotPassword", userAuth, async (req, res) =>{
    
})

module.exports = profileRouter;
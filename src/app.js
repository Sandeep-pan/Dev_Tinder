const express = require("express");
const app = express();
const connectDB = require("./database");
const User = require("./models/user");
const {validateSignUpData} = require("./utils/validation");
const bcrypt = require("bcrypt");

app.use(express.json());

app.get("/user", async (req,res) =>{
    const userEmail = req.body.emailID;
    try {
        const user = await User.find({emailID: userEmail});
        if (user.length == 0){
            res.status(404).send("User Not Found");
        }else{
            res.send(user);
        }
        
    } catch (error) { res.status(400).send("something went wrong");
        
    }
});

app.get("/feed", async (req,res) =>{
    try {
        const users = await User.find({});
        res.send(users);
    } catch (error) { res.status(400).send("something went wrong");
        
    }
});

app.post("/signup",async (req,res) => {  
 try {
    validateSignUpData(req);
    const {firstName, lastname, emailID, password} = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
        firstName,
        lastname,
        emailID,
        password : passwordHash,
    });
    await user.save();
    res.send("User added Successfully");
 } catch (error) { res.status(400).send("ERROR :" + error.message);
    
 }   
});
connectDB()
.then(()=>{
    console.log("database connected succesfully");
    app.listen(7777,()=>{
        console.log("Server started successfully and listening on port 7777")
    });
})
.catch((err) => {
    console.log("database cannot be cnnected");
});
app.use((req,res) => {
    res.send("Hello From Server!..");

});

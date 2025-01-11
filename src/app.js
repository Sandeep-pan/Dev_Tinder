const express = require("express");
const app = express();
const connectDB = require("./database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");

app.use(cors({
    origin : "http://localhost:5173",
    credentials : true,
}));
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user");

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);


connectDB()
    .then(() => {
        console.log("database connected succesfully");
        app.listen(7777, () => {
            console.log("Server started successfully and listening on port 7777")
        });
    })
    .catch((err) => {
        console.log("database cannot be cnnected");
    });
app.use((req, res) => {
    res.send("Hello From Server!..");

});

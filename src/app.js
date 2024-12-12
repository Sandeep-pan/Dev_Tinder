const express = require("express");
const app = express();
app.use((req,res) => {
    res.send("Hello From Server!..");

});
app.listen(7777,()=>{
    console.log("Server started successfully and listening on port 7777")
});
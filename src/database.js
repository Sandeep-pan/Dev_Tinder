const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://NamasteNode:SandyPAN@nodebegin.uctkw.mongodb.net/dev_tinder"
    );
};

module.exports = connectDB;
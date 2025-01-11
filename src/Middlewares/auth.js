const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).send("Please login!");
        }
        const decodedObj = jwt.verify(token, "DEV@Tinder2904");
        const { _id } = decodedObj;
        const user = await User.findById(_id);
        if (!user) {
            throw new Error("User Not exist");

        }
        req.user = user;
        next();

    } catch (error) {
      return res.status(400).send("ERROR :" + error.message);

    }
};
module.exports = {userAuth};
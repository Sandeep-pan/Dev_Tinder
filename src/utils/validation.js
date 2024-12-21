const validator = require("validator");

const validateSignUpData = (req) => {
    const {firstName, lastName, emailID, password} = req.body;
    if (!firstName || !lastName) {
        throw new Error("Please enter first or last name");
    } else if(!validator.isEmail(emailID)){
        throw new Error("Please enter valid Email");
    } else if(!validator.isStrongPassword(password)){
        throw new Error("Please create strong password");
    }
    
};
module.exports = {validateSignUpData};
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");


// Register a User
// GET /api/users/register
// access public
const registerUser = asyncHandler(async(req, res) => {
    const { userName, email, password } = req.body;
    if(!userName || !email || !password){
        res.status(400);
        throw new Error("All Fields are Manditory");
    }
    const userAvailable = await User.findOne({ email });
    if(userAvailable){
        res.status(400);
        throw new Error("User Already Registerd");
    }

    //Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        userName, email, password:hashedPassword
    });
  
    if(user){
        res.status(201).json({_id:user._id, email:user.email});
    }else{
        res.status(400);
        throw new Error("User Data Not Valid");
    }
    res.json({ message: "Register the user"});
    
});

// Login User
// GET /api/users/login
// access public
const loginUser = asyncHandler(async(req, res) => {
    const {email, password} = req.body;
    if(!email || !password){
        req.status(400);
        throw new Error("All fields are manditory");
    }
    const user = await User.findOne({email});
    // compare password with hasedpassword
    if(user && (await bcrypt.compare(password, user.password))){
        const accessToken = jwt.sign({
            user:{
                userName: user.userName,
                email: user.email,
                id: user._id
            },

        }, process.env.ACCESS_TOKEN_SECERT,
        {
            expiresIn: "15m"
        }
        );
        res.status(200).json({ accessToken });
    }else{
        res.status(401);
        throw new Error("Eamil or Password is not valid");
    }
    res.json({ message: "Login user"});
});

// Current User
// GET /api/users/current
// access private
const currentUser = asyncHandler(async(req, res) => {
    
    res.json(req.user);
});
module.exports = { 
    registerUser,
    loginUser,
    currentUser 
}

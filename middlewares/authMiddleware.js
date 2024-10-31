const asyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken")
const User = require("../models/user")

function decodeToken(token) {
    const decoded = jwt.decode(token, { complete: false });
    console.log(decoded); // Check payload and expiration time
}
module.exports.protect = asyncHandler(async(req, res, next)=>{
    try{
        const token = req.cookies.token
         console.log("token xxxx-----------------",token)
        decodeToken(token)
        if(!token)
        {
            res.status(401)
            throw new Error("Not authorized, please login")
        }
        const verified = jwt.verify(token, process.env.JWT_SECRET)
        // console.log("verfied", verified)
        const user = await User.findById(verified.id).select("-password")
        // console.log("user", user)
        if(!user)
        {
            res.status(401)
            throw new Error("User not found")
        }
        req.user = user
        next()
    }catch(error)
    {
        res.status(400)
        throw new Error("Not authorized, please login")
    }
})


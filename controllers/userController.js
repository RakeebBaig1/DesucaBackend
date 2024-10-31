const asyncHandler = require("express-async-handler")
const User = require("../models/user") 
const Task = require("../models/task_des")

const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')


const generateToken = (id)=>{
    return jwt.sign(
        {id}, process.env.JWT_SECRET, {expiresIn: '2d'})
}

const tokenParameters = {
    path: '/',
    expires: new Date(Date.now() + 1000 * 86400 * 40),
    httpOnly: true,
    // secure: true,
    // sameSite: 'none'
}


//register user
module.exports.registerUser = asyncHandler( async(req, res, next)=>{

    console.log("register")
    const { name, email, password, username  } = req.body
    if(!name || !email || !password || !username)
    {
        res.status(400)
        throw new Error('Please add all fields')
    }
    
    if(password.length < 6)
    {
        res.status(400)
        throw new Error("Password must be upto 6 characters")
    }

    //check if user exists
    const user = await User.findOne({ $or: [{ email }, { username }] });
    console.log("user", user)
    if(user)
    {
        res.status(400)
        throw new Error('User with this email or username already exists')
    }

    const newUser = await User.create({
        name, email, password, username
    })

    const token = generateToken(newUser._id)

    if(newUser)
    {
        const { _id, name, email, username } = newUser

        res.cookie("token", token, tokenParameters )
        console.log("new user", newUser)
        console.log("token", token)


        res.status(201).json({
            msg: "user created successfully",
            _id, name, email, username, token
        })
    }

})
module.exports.loginUser = asyncHandler( async(req, res, next)=>{
    const { username, password } = req.body
    console.log("req", req.body)

    if(!username || !password)
    {
        res.status(400)
        throw new Error("Please fill in all fields")
    }
    const user = await User.findOne({username})
    if(!user)
    {
        res.status(400)
        throw new Error('User with this username not found')
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password)

    console.log("password match", isPasswordMatch)
    
    if(user && isPasswordMatch)
    {
        const token = generateToken(user._id)
        const { _id, name, email, username } = user
        
        console.log("user", user)
        res.cookie("token", token, tokenParameters)
        res.status(200).json({_id, name, email, username, token})
    }
    else{
        res.status(404)
        throw new Error('Invalid credentials')
    }
})
module.exports.logoutUser = asyncHandler(async(req, res, next)=>{
    console.log("logout")
    res.cookie("token", "", {
        maxAge: 1,
        path: "/",
        expires: new Date(0),
        httpOnly: true
    })
    res.status(200).json({
        message: "Suucessfully LoggedOut"
})
})
module.exports.AssignTask = asyncHandler( async(req, res, next)=>{

    console.log("Add Task")
  
    const {manager_id ,title , description , due_date , status} = req.body


    if(!manager_id || !title || !description || !due_date)
    {
        res.status(400)
        throw new Error('Please add all fields From Assigne Task to manager')
    }
    console.log("Going to Del Manager")
    let idd=manager_id.toString()
    // Task.insertMany([{
    //     idd, title, description, due_date , status,
    // }])
    const newTask = new Task({
         uid : manager_id.toString(),
        title : title,
        description :description,
        due_date :due_date,
        status: status,     
    })
    const taskss =  await newTask.save()
    
  
   const task_id= taskss._id.toString()
    if(taskss)
    {
        
        console.log('Task Added -------->',taskss)
        res.status(201).json(taskss)
    }
    else{
        console.log("Operation Fail AddingTask id not found in Users table")
        res.status(400)
        throw new Error('User with this AddingTask or AddingTas already exists')
    }
})


module.exports.UpdateStatus2 = asyncHandler( async(req, res, next)=>{

    console.log("UpdateStauts")

    const {uid , tid , status} = req.body

    console.log(uid)
    if(!uid)
    {
        res.status(400)
        throw new Error('Please add all fields')
    }
    console.log("Going to Update Status")
    let idd=uid.toString()
 
    const result = await Task.updateOne(
        { uid: idd ,
        _id : tid 
    }, // Filter condition
        { $set: { status: `${status}` } } // Update fields
    );
   
 
    if(result)
    {
        
        console.log('Task Status -------->',result)
        res.status(201).json(result)
    }
    else{
        console.log("Operation Fail For Updation Status --------")
        res.status(400)
        throw new Error('User with this Updating Status ')
    }

})
module.exports.UpdateDescription2 = asyncHandler( async(req, res, next)=>{
    console.log("UpdateStauts")

    const {uid , tid ,des} = req.body

    console.log(uid)
    if(!uid)
    {
        res.status(400)
        throw new Error('Please add all fields')
    }
    console.log("Going to Update Status")
    let idd=uid.toString()
 
    const result = await Task.updateOne(
        { uid: idd ,
        _id: tid}, // Filter condition
        { $set: { description: `${des}` } } // Update fields
    );
   
 
    if(result)
    {
        
        console.log('Task Description -------->',result)
        res.status(201).json(result)
    }
    else{
        console.log("Operation Fail For Task Description   --------")
        res.status(400)
        throw new Error('User with this Task Description   ')
    }
})
module.exports.UpdateTitle2 = asyncHandler( async(req, res, next)=>{

    console.log("UpdateTitle")

    const {uid ,tid , title} = req.body

    console.log(uid)
    if(!uid)
    {
        res.status(400)
        throw new Error('Please add all fields')
    }
    console.log("Going to Update UpdateTitle")
    let idd=uid.toString()
 
    const result = await Task.updateOne(
        { uid: idd ,
          _id, tid  }, // Filter condition
        { $set: { title: `${title}` } } // Update fields
    );
   
 
    if(result)
    {
        
        console.log('UpdateTitle-------->',result)
        res.status(201).json(result)
    }
    else{
        console.log("Operation Fail For UpdateTitle --------")
        res.status(400)
        throw new Error('User with this UpdateTitle ')
    }

})
module.exports.DeleteTask2 = asyncHandler( async(req, res, next)=>{

    console.log("DeleteTask")

    const {uid , tid} = req.body

    console.log(uid)
    if(!uid)
    {
        res.status(400)
        throw new Error('Please add all fields')
    }
    console.log("Going to DeleteTask")
    let idd=uid.toString()
 
    const result = await Task.deleteOne({ uid: idd , _id : tid})
   
 
    if(result)
    {
        
        console.log('DeleteTask -------->',result)
        res.status(201).json(result)
    }
    else{
        console.log("Operation Fail For UDeleteTask --------")
        res.status(400)
        throw new Error('User with this DeleteTask ')
    }

})
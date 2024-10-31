const asyncHandler = require("express-async-handler")
const User = require("../models/user") 
const Manage_User = require("../models/manage_users") 
const Task = require("../models/task_des")
const bcrypt = require("bcrypt")
const Manager_own_task = require("../models/manager_own_Task") 
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


//login user
module.exports.loginUser = asyncHandler( async(req, res, next)=>{
    console.log("Login Users")
    const {email, password} = req.body
    console.log(email,password)
    if(!email || !password )
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
  const newUser = await User.findOne({ $or: [{ email }, { password }] });
  const isPasswordMatch = await bcrypt.compare(password, newUser.password)
    
  console.log("password match", isPasswordMatch)
  console.log("User", newUser)
  const token = generateToken(newUser._id)
  if(newUser && isPasswordMatch)
  {
    res.cookie("token", token, tokenParameters )
      res.status(201).json({
          msg: "User Login successfully",
          token, role :newUser.role ,id :newUser._id
      })
     
  }
  else
  {
      console.log("Not Found Admin")
      res.status(400)
      throw new Error('User with this email or username already exists')
  }
    
})


//logoutUser
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
module.exports.Manager_Own_Task = asyncHandler( async(req, res, next)=>{

    console.log("Get Managerssss Task")
    console.log("Get All Task +++++++++++++++++++++++++")
    const {mid} = req.body

    if(!mid)
    {
        res.status(400)
        throw new Error('Please add all fields')
    }
    console.log("Going to Del Manager")
    let idd=mid.toString()
    // Task.insertMany([{
    //     idd, title, description, due_date , status,
    // }])
    const tasks = await Manager_own_task.find({ m_id: idd });
const taskIds = tasks.map(task => task.t_id);
const taskDetails = await Task.find({ _id: { $in: taskIds } });
 
    if(taskDetails)
    {
        
        console.log('Here is detail of MAnaager Tasks-------->',taskDetails)
        res.status(201).json(taskDetails)
    }
    else{
        console.log("Operation Fail AddingTask id not found in Users table")
        res.status(400)
        throw new Error('User with this AddingTask or AddingTas already exists')
    }

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
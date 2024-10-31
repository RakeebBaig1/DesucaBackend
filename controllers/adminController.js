const asyncHandler = require("express-async-handler")
const Admin = require("../models/admin") 
const User = require("../models/user")
const Task = require("../models/task_des")
const asssignTask = require("../models/AssignTask")
const manageUser = require("../models/manage_users")
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
module.exports.LoginAdmin = asyncHandler( async(req, res, next)=>{

    console.log("Login Admin")
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
    const admin = await Admin.findOne({ $or: [{ email }, { password }] });
    console.log("Admin", admin)
    if(admin)
    {
        res.status(201).json({
            msg: "Admin Login successfully",
            admin: admin.email,
        })
       
    }
    else
    {
        console.log("Not Found Admin")
        res.status(400)
        throw new Error('User with this email or username already exists')
    }
      

})
module.exports.GetListUser = asyncHandler( async(req, res, next)=>{
    try {

    console.log("Getting Users")
      // Fetch all admin records
      const users = await User.find();

      if (users.length === 0) {
          console.log('No records found');
          return res.status(404).json({ message: 'No records found' });
      }

      return res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching List of User calling api:', error);
        return res.status(500).json({ message: 'Server error' });
    }
      

})
module.exports.registerUserbyAdmin = asyncHandler( async(req, res, next)=>{

    console.log("register")
    const { name, email, password, role , id} = req.body

    // console.log(name,email,password,role)
    if(!name || !email || !password || !role)
    {
        res.status(400)
        throw new Error('Please add all fields')
    }
    
    if(password.length < 3)
    {
        res.status(400)
        throw new Error("Password must be upto 3 characters")
    }

    //check if user exists
    const user = await User.findOne({ $or: [{ email }, { name }] });
    console.log("user", user)
    if(user)
    {
        res.status(400)
        console.log("Already exist")
        throw new Error('User with this email or username already exists')
    }
    console.log('Going to create new')
    const newUser = await User.create({
        name, email, password, role , img :"https://i.pravatar.cc/150?img=3",
    })
    console.log('Going to Done new')
    console.log('Phir ,',newUser._id.toString() )
    console.log('Phir 2,',id )
    const uid=newUser._id.toString()
    const mid=id.toString()
    const token = generateToken(newUser._id)
    console.log('Token generated',token)
        if(newUser){
        if(mid != '0')
        {
       let temp = await manageUser.insertMany([{
        mid , uid
       }])
        console('Added Success',temp)
        }
       else
       {
        console.log('id == 0',id)
        }

        const { _id, name, email, username } = newUser

        res.cookie("token", token, tokenParameters )
        console.log("new user", newUser)
        console.log("token", token)


        res.status(201).json({
            msg: "user created successfully",
        })
    }
})
module.exports.ChangeManager = asyncHandler( async(req, res, next)=>{

    console.log("Change Manager")
    const {userid,managerid} = req.body
    console.log(userid,managerid)
    if(!userid || !managerid)
    {
        res.status(400)
        throw new Error('Please add all fields')
    }
    console.log("Going to Del Manager")
    const result = await manageUser.deleteOne({ uid: userid });
console.log("Delete Result:", result);

const newMange = new manageUser({
    mid: managerid.toString() ,
    uid : userid.toString()
})
const datatosave =  await newMange.save()

// let temp = await manageUser.createOne({
//     mid:managerid , uid : userid
//    })
    console.log('Added Success',datatosave)
    //check if user exists
    if(datatosave)
    {
        res.status(201).json({
            msg: "Admin Login successfully",
            
        })
       
    }
    else
    {
        console.log("Operation Fail")
        res.status(400)
        throw new Error('User with this email or username already exists')
    }
      

})
module.exports.GetManager = asyncHandler( async(req, res, next)=>{

    console.log("Manager")
    const {id} = req.body
    console.log(id)
    if(!id)
    {
        res.status(400)
        throw new Error('Please add all fields')
    }
    console.log("Going to Del Manager")
    const users = await manageUser.find({   
        uid: id           
    });
    if(users)
    {
        console.log('manageUser Table Found this',users)
      console.log( 'Id for Query' ,users[0]['mid'] )
        const temp = await User.find({   
            _id: users[0]['mid']           
        });
        if(temp)
        {
        console.log('User Tables -------->',temp)
        res.status(201).json(temp)
    }
    else{
        console.log("Operation Fail manager id not found in Users table")
        res.status(400)
        throw new Error('User with this email or username already exists')
    }
       
    }
    else
    {
        console.log("Operation Fail")
        res.status(400)
        throw new Error('User with this email or username already exists')
    }
      

})
module.exports.AssignTask = asyncHandler( async(req, res, next)=>{

    console.log("Assign_Task")
  
    const {manager_id , user_id ,title , description , due_date , status} = req.body

    console.log(manager_id , user_id ,title , description , due_date , status)
    if(!manager_id || !user_id || !title || !description || !due_date)
    {
        res.status(400)
        throw new Error('Please add all fields')
    }
    console.log("Going to Del Manager")
    let idd=user_id.toString()
    // Task.insertMany([{
    //     idd, title, description, due_date , status,
    // }])
    const newTask = new Task({
         uid : user_id.toString(),
        title : title,
        description :description,
        due_date :due_date,
        status: status,     
    })
    const taskss =  await newTask.save()
    
  
   const task_id= taskss._id.toString()
    if(taskss)
    {
        const newTask = new asssignTask({
            m_id : manager_id,
            u_id : user_id,
            t_id : task_id    
       })
    const assignTask = newTask.save()
        if(assignTask)
        {
        console.log('Task Added -------->',assignTask)
        res.status(201).json(assignTask)
    }
    else{
        console.log("Operation Fail AddingTask id not found in Users table")
        res.status(400)
        throw new Error('User with this AddingTask or AddingTas already exists')
    }
       
    }
    else
    {
        console.log("Operation Fail")
        res.status(400)
        throw new Error('User with this email or username already exists')
    }
      

})
module.exports.GetListOfTask = asyncHandler( async(req, res, next)=>{

    console.log("Get All Task")
    console.log("Get All Task +++++++++++++++++++++++++")
    const {uid} = req.body

    console.log(uid)
    if(!uid)
    {
        res.status(400)
        throw new Error('Please add all fields')
    }
    console.log("Going to Del Manager")
    let idd=uid.toString()
    // Task.insertMany([{
    //     idd, title, description, due_date , status,
    // }])
    const tasks = await Task.find({   
       uid : idd          
    });
   
 
    if(tasks)
    {
        
        console.log('Task Added -------->',tasks)
        res.status(201).json(tasks)
    }
    else{
        console.log("Operation Fail AddingTask id not found in Users table")
        res.status(400)
        throw new Error('User with this AddingTask or AddingTas already exists')
    }

})

module.exports.UpdateStatus = asyncHandler( async(req, res, next)=>{

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
module.exports.UpdateDescription = asyncHandler( async(req, res, next)=>{
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
module.exports.UpdateTitle = asyncHandler( async(req, res, next)=>{

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
module.exports.DeleteTask = asyncHandler( async(req, res, next)=>{

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
module.exports.getUserForManager = asyncHandler( async(req, res, next)=>{

    console.log("Api  getUserForManager")

    const {mid} = req.body

    console.log(mid)
    if(!mid)
    {
        res.status(400)
        throw new Error('Please add all fields')
    }
    console.log("Going to DeleteTask")
    let idd=mid.toString()
 
    const result = await manageUser.find({ mid: idd })
    const managedUserIds = result.map(record => record.uid);
    const managedUsers = await User.find({ _id: { $in: managedUserIds } , role : 'user'});
    if(managedUsers)
    {
        
        console.log('All users found -------->',result)
        res.status(201).json(managedUsers)
    }
    else{
        console.log("Operation Fail For UDeleteTask --------")
        res.status(400)
        throw new Error('User with this DeleteTask ')
    }

})
module.exports.GetotherUsers = asyncHandler( async(req, res, next)=>{

    console.log("Api  getNonAssigned UserForManager")

    const {mid} = req.body

    console.log(mid)
    if(!mid)
    {
        res.status(400)
        throw new Error('Please add all fields')
    }
  
    let idd=mid.toString()
 
    const result = await manageUser.find({ mid: idd })
    const managedUserIds = result.map(record => record.uid);
    const unmanagedUsers = await User.find({ _id: { $nin: managedUserIds } , role : 'user'});





    if(unmanagedUsers)
    {
        
        console.log('No find nON Managed users found -------->',unmanagedUsers)
        res.status(201).json(unmanagedUsers)
    }
    else{
        console.log("Operation Fail For UDeleteTask --------")
        res.status(400)
        throw new Error('User with this DeleteTask ')
    }

})


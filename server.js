const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()
const cookieParser = require("cookie-parser")
const errorhandler = require('./middlewares/errorMiddleware')

const app = express();
app.use(cors({
    origin: 'http://localhost:3000',  // Specify the allowed origin
    credentials: true  // Enable Access-Control-Allow-Credentials
}))
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended: false}))
const PORT = process.env.PORT || 9000;



const userRoutes = require("./routers/userRoutes")
app.use("/api/user", userRoutes)

const adminRoutes = require("./routers/adminRoutes")
app.use("/api/admin", adminRoutes)

const managerRoutes = require("./routers/managerRoutes")
app.use("/api/manager", managerRoutes)


app.use(errorhandler)
// Define a simple route
app.get("/",(req, res)=>{
    //local date get from ntp and convert into local string
    const date = new Date().toISOString()    
    res.send(`Server is running on ${date}`)

})

// Start the server

mongoose.connect(process.env.MONGODB_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(()=>{
        app.listen(PORT,()=>{
            console.log('MONGODB connection established')
            console.log(`Server is running on port ${PORT}`)
        })
    }).catch((error)=>{
        console.log('Error', error)
    })

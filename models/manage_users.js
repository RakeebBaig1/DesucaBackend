const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const managerUserSchema = mongoose.Schema(
    {   
       
        mid: {
            type: String,
            required: true,
    
        },
        uid: {
            type : String,
            required: true,
           
        },
    },
    {
        timestamps: true
}
)



module.exports = mongoose.model("manageUser", managerUserSchema)
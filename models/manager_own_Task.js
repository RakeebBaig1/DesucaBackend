const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const managerTaskSchema = mongoose.Schema(
    {   
       
        m_id: {
            type: String,
            required: true,
            unique: false,
        },
        t_id: {
            type: String,
            required: true,
            unique: true,
        },
    },
    {
        timestamps: true
})


module.exports = mongoose.model("Manager_own_task", managerTaskSchema)
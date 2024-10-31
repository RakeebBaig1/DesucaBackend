const mongoose = require('mongoose');

// Define the schema for your collection
const taskSchema = new mongoose.Schema({
    uid: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    due_date: {
        type: Date,
        required: true
    },
    status: {
        type: Boolean,
        enum: ['pending', 'in_progress', 'completed'], // Example of predefined statuses
        default: 'pending'
    }
},
{
    timestamps: true
});

// Create a Mongoose model based on the schema
module.exports = mongoose.model('Task', taskSchema);
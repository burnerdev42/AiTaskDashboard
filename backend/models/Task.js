const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    priority: {
        type: String,
        enum: ['High', 'Medium', 'Low'],
        default: 'Medium'
    },
    stage: {
        type: String,
        // enum: ['Scale', 'Pilot', 'Prototype', 'Ideation', 'Parking Lot'], // Matching frontend
        required: true
    },
    type: {
        type: String,
        enum: ['evaluation', 'pilot', 'validation', 'standard'],
        default: 'standard'
    },
    progress: {
        type: Number,
        default: 0
    },
    value: String,
    kudos: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);

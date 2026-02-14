const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['challenge', 'idea', 'comment', 'status'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    unread: {
        type: Boolean,
        default: true
    },
    link: {
        type: String
    },
    user: { // The user who receives the notification
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);

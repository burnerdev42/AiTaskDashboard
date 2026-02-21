const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: [
            'challenge_created',
            'challenge_status_update',
            'challenge_edited',
            'idea_edited',
            'challenge_upvoted',
            'idea_upvoted',
            'challenge_commented',
            'idea_commented',
            'challenge_subscribed',
            'idea_subscribed',
            'challenge_deleted',
            'idea_deleted'
        ],
        required: true
    },
    fk_id: {
        type: String, // Can be ObjectId or String depending on implementation, String as per spec
        default: null
    },
    initiatorId: {
        type: String, // Referencing User collection
        required: true
    },
    userId: {
        type: String, // Referencing User collection
        required: true
    },
    isSeen: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);

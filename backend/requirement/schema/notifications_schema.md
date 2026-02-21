```javascript
const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationSchema = new Schema(
  {
    type: {
      type: String,
      enum: [
        'challenge_created',
        'idea_created',
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
        'idea_deleted',
      ],
      required: true,
    },
    fk_id: {
      type: String, // Link to Challenge, Idea, or Comment virtualId
      default: null,
    },
    initiatorId: {
      type: Schema.Types.ObjectId,
      ref: 'User', // The user who triggered the event
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Recipient
      required: true,
    },
    isSeen: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

module.exports = mongoose.model('Notification', notificationSchema);
```

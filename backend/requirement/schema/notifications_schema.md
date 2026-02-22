# Notification Mongoose Schema

```javascript
const mongoose = require('mongoose');
const { Schema } = mongoose;

const NOTIFICATION_TYPES = [
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
  'idea_deleted',
];

const notificationSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: NOTIFICATION_TYPES,
    },
    fk_id: {
      type: String,
      default: null,
    },
    userId: {
      type: String,
      required: true,
    },
    initiatorId: {
      type: String,
      required: true,
    },
    isSeen: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ userId: 1, isSeen: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
```

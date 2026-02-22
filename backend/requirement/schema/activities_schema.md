# Activity Mongoose Schema

```javascript
const mongoose = require('mongoose');
const { Schema } = mongoose;

const ACTIVITY_TYPES = [
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
  'log_in',
  'log_out',
];

const activitySchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ACTIVITY_TYPES,
    },
    fk_id: {
      type: String,
      default: null,
    },
    userId: {
      type: String,
      required: true,
    },
    month: {
      type: Number,
    },
    year: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

activitySchema.pre('save', function (next) {
  if (this.isNew || this.isModified('createdAt')) {
    const date = this.createdAt || new Date();
    this.month = date.getMonth() + 1;
    this.year = date.getFullYear();
  }
  next();
});

activitySchema.index({ userId: 1, createdAt: -1 });
activitySchema.index({ type: 1 });
activitySchema.index({ fk_id: 1 });

module.exports = mongoose.model('Activity', activitySchema);
```

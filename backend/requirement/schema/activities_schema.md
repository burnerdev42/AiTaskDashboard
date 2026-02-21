```javascript
const mongoose = require('mongoose');
const { Schema } = mongoose;

const activitySchema = new Schema(
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
        'log_in',
        'log_out',
      ],
      required: true,
    },
    fkId: {
      type: Schema.Types.ObjectId,
      default: null, // Nullable
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
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
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Pre-save hook to extract month and year from createdAt
activitySchema.pre('save', function (next) {
  if (this.isNew || this.isModified('createdAt')) {
    const date = this.createdAt || new Date();
    this.month = date.getMonth() + 1; // 1-12
    this.year = date.getFullYear();
  }
  next();
});

module.exports = mongoose.model('Activity', activitySchema);
```

# Challenge Mongoose Schema

```javascript
const mongoose = require('mongoose');
const { Schema } = mongoose;

const challengeSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    opco: {
      type: String,
      required: true,
    },
    platform: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
    },
    outcome: {
      type: String,
    },
    timeline: {
      type: String,
    },
    portfolioLane: {
      type: String,
    },
    priority: {
      type: String,
    },
    tags: {
      type: [String],
      default: ['ai'],
    },
    constraint: {
      type: String,
    },
    stakeHolder: {
      type: String,
    },
    virtualId: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      required: true,
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
    upVotes: {
      type: [String],
      default: [],
    },
    subcriptions: {
      type: [String],
      default: [],
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    timestampOfStatusChangedToPilot: {
      type: Date,
      default: null,
    },
    timestampOfCompleted: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

challengeSchema.pre('save', function (next) {
  if (this.isNew || this.isModified('createdAt')) {
    const date = this.createdAt || new Date();
    this.month = date.getMonth() + 1;
    this.year = date.getFullYear();
  }
  next();
});

module.exports = mongoose.model('Challenge', challengeSchema);
```

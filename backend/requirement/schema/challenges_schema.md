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
      enum: [], // Populate with hardcoded options
      required: true,
    },
    platform: {
      type: String,
      enum: [], // Populate with hardcoded options
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
      enum: [], // Populate with hardcoded options
    },
    portfolioLane: {
      type: String,
      enum: [], // Populate with hardcoded options
    },
    priority: {
      type: String,
      enum: [], // Populate with hardcoded options
    },
    tags: {
      type: [String],
      default: ['ai'],
    },
    constraint: {
      type: String,
    },
    stackeHolder: { // Keeping original spelling 'StackeHolder' from requirements
      type: String,
    },
    virtualId: {
      type: String,
      required: true,
      unique: true, // Format: CH-001 to CH-999
    },
    status: {
      type: String,
      enum: [], // Populate with swim lane statuses
      required: true,
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
    contributors: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    upVotes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    downVotes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    subcriptions: [ // Keeping original spelling 'subcriptions' from requirements
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    viewCount: {
      type: Number,
      default: 0,
    },
    timestampOfStatusChangedToPilot: { // Maps to z1
      type: Date,
    },
    timestampOfCompleted: { // Maps to z2
      type: Date,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// Pre-save hook to extract month and year from createdAt if needed
challengeSchema.pre('save', function (next) {
  if (this.isNew || this.isModified('createdAt')) {
    const date = this.createdAt || new Date();
    this.month = date.getMonth() + 1; // 1-12
    this.year = date.getFullYear();
  }
  next();
});

module.exports = mongoose.model('Challenge', challengeSchema);
```

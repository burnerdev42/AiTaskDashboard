```javascript
const mongoose = require('mongoose');
const { Schema } = mongoose;

const ideaSchema = new Schema(
  {
    ideaId: {
      type: String,
      required: true,
      unique: true, // Format: ID-0001
    },
    title: {
      type: String,
      required: true,
    },
    description: { // Maps to 'Description/Idea Summary'
      type: String,
      required: true,
    },
    proposedSolution: {
      type: String,
      required: true,
    },
    expectedImpact: {
      type: String,
    },
    challengeId: {
      type: Schema.Types.ObjectId,
      ref: 'Challenge',
      required: true,
    },
    appreciationCount: {
      type: Number,
      default: 0,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    subscription: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    month: {
      type: Number,
    },
    year: {
      type: Number,
    },
    status: {
      type: Boolean,
      default: true, // Representing Accepted/Declined (true = Accepted)
    },
    upVotes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// Pre-save hook to extract month and year from createdAt
ideaSchema.pre('save', function (next) {
  if (this.isNew || this.isModified('createdAt')) {
    const date = this.createdAt || new Date();
    this.month = date.getMonth() + 1; // 1-12
    this.year = date.getFullYear();
  }
  next();
});

module.exports = mongoose.model('Idea', ideaSchema);
```

# Idea Mongoose Schema

```javascript
const mongoose = require('mongoose');
const { Schema } = mongoose;

const ideaSchema = new Schema(
  {
    ideaId: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    proposedSolution: {
      type: String,
    },
    challengeId: {
      type: String,
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
      type: String,
      required: true,
    },
    subscription: {
      type: [String],
      default: [],
    },
    month: {
      type: Number,
    },
    year: {
      type: Number,
    },
    status: {
      type: Boolean,
      default: true,
    },
    upVotes: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

ideaSchema.pre('save', function (next) {
  if (this.isNew || this.isModified('createdAt')) {
    const date = this.createdAt || new Date();
    this.month = date.getMonth() + 1;
    this.year = date.getFullYear();
  }
  next();
});

module.exports = mongoose.model('Idea', ideaSchema);
```

```javascript
const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
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
    companyTechRole: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    interestAreas: {
      type: [String],
      enum: [], // Populate with hardcoded options
      default: [],
    },
    role: {
      type: String,
      enum: ['ADMIN', 'MEMBER', 'USER'],
      required: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'BLOCKED', 'INACTIVE'],
      required: true,
    },
    innovationScore: {
      type: Number,
      min: 1,
      max: 999,
      default: 1,
    },
    upvotedChallengeList: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Challenge',
      },
    ],
    upvotedAppreciatedIdeaList: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Idea',
      },
    ],
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

module.exports = mongoose.model('User', userSchema);
```

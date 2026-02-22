# User Mongoose Schema

```javascript
const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    opco: {
      type: String,
    },
    platform: {
      type: String,
    },
    companyTechRole: {
      type: String,
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
      default: [],
    },
    role: {
      type: String,
      enum: ['ADMIN', 'MEMBER', 'USER'],
      default: 'USER',
    },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'BLOCKED', 'INACTIVE'],
      default: 'PENDING',
    },
    innovationScore: {
      type: Number,
      default: 0,
    },
    upvotedChallengeList: {
      type: [String],
      default: [],
    },
    upvotedAppreciatedIdeaList: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('User', userSchema);
```

# Comment Mongoose Schema

```javascript
const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['CH', 'ID'],
    },
    createdat: {
      type: Date,
      default: Date.now,
    },
    typeId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: false,
  }
);

commentSchema.index({ typeId: 1, type: 1 });

module.exports = mongoose.model('Comment', commentSchema);
```

```javascript
const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['CH', 'IDX'], // CH = Challenges, IDX = Ideas
      required: true,
    },
    typeId: {
      type: Schema.Types.ObjectId, // Will ref either Challenge or Idea depends on 'type'
      required: true,
      refPath: 'refModel',
    },
  },
  {
    timestamps: { createdAt: 'createdat', updatedAt: false }, // Specific matching for "Createdat" capitalization or mapping
  }
);

// Virtual for dynamic refPath based on Type
commentSchema.virtual('refModel').get(function () {
  return this.type === 'CH' ? 'Challenge' : 'Idea';
});

module.exports = mongoose.model('Comment', commentSchema);
```

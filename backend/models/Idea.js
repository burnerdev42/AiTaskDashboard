const mongoose = require('mongoose');

const ideaSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Ideation', 'Evaluation', 'POC', 'Pilot', 'Scale'],
        default: 'Ideation'
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    linkedChallenge: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Challenge'
    },
    tags: [String],
    stats: {
        appreciations: { type: Number, default: 0 },
        comments: { type: Number, default: 0 },
        views: { type: Number, default: 0 }
    },
    approach: [String],
    problemStatement: String,
    proposedSolution: String,
    expectedImpact: String,
    implementationPlan: String,
    expectedSavings: String,
    impactLevel: {
        type: String,
        enum: ['High', 'Medium', 'Low'],
        default: 'Medium'
    },
    activity: [{
        author: String,
        avatar: String,
        avatarColor: String,
        text: String,
        time: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Idea', ideaSchema);

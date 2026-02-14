const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    stage: {
        type: String,
        enum: ['Scale', 'Pilot', 'Prototype', 'Ideation'],
        default: 'Ideation'
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    accentColor: {
        type: String,
        default: 'teal'
    },
    stats: {
        appreciations: { type: Number, default: 0 },
        comments: { type: Number, default: 0 },
        roi: String,
        savings: String,
        markets: Number,
        members: Number,
        votes: Number,
        accuracy: String,
        methods: Number
    },
    tags: [String],
    problemStatement: String,
    expectedOutcome: String,
    businessUnit: String,
    department: String,
    priority: {
        type: String,
        enum: ['High', 'Medium', 'Low'],
        default: 'Medium'
    },
    estimatedImpact: String,
    team: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    activity: [{
        author: String,
        avatar: String,
        avatarColor: String,
        text: String,
        time: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Challenge', challengeSchema);

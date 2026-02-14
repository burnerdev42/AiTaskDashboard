import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IChallenge extends Document {
    title: string;
    description: string;
    stage: 'Scale' | 'Pilot' | 'Prototype' | 'Ideation';
    owner?: mongoose.Types.ObjectId;
    accentColor: string;
    stats: {
        appreciations: number;
        comments: number;
        roi?: string;
        savings?: string;
        markets?: number;
        members?: number;
        votes?: number;
        accuracy?: string;
        methods?: number;
    };
    tags: string[];
    problemStatement?: string;
    expectedOutcome?: string;
    businessUnit?: string;
    department?: string;
    priority: 'High' | 'Medium' | 'Low';
    estimatedImpact?: string;
    team: mongoose.Types.ObjectId[];
    activity: {
        author: string;
        avatar?: string;
        avatarColor?: string;
        text: string;
        time: Date;
    }[];
    createdAt: Date;
    updatedAt: Date;
}

const challengeSchema: Schema<IChallenge> = new mongoose.Schema({
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

const Challenge: Model<IChallenge> = mongoose.model<IChallenge>('Challenge', challengeSchema);
export default Challenge;

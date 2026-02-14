import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IIdea extends Document {
    title: string;
    description: string;
    status: 'Ideation' | 'Evaluation' | 'POC' | 'Pilot' | 'Scale';
    owner?: mongoose.Types.ObjectId;
    linkedChallenge?: mongoose.Types.ObjectId;
    tags: string[];
    stats: {
        appreciations: number;
        comments: number;
        views: number;
    };
    approach: string[];
    problemStatement?: string;
    proposedSolution?: string;
    expectedImpact?: string;
    implementationPlan?: string;
    expectedSavings?: string;
    impactLevel: 'High' | 'Medium' | 'Low';
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

const ideaSchema: Schema<IIdea> = new mongoose.Schema({
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

const Idea: Model<IIdea> = mongoose.model<IIdea>('Idea', ideaSchema);
export default Idea;

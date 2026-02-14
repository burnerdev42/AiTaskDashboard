import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ITask extends Document {
    title: string;
    description?: string;
    owner: mongoose.Types.ObjectId;
    priority: 'High' | 'Medium' | 'Low';
    stage: string;
    type: 'evaluation' | 'pilot' | 'validation' | 'standard';
    progress: number;
    value?: string;
    kudos: number;
    createdAt: Date;
    updatedAt: Date;
}

const taskSchema: Schema<ITask> = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    priority: {
        type: String,
        enum: ['High', 'Medium', 'Low'],
        default: 'Medium'
    },
    stage: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['evaluation', 'pilot', 'validation', 'standard'],
        default: 'standard'
    },
    progress: {
        type: Number,
        default: 0
    },
    value: String,
    kudos: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const Task: Model<ITask> = mongoose.model<ITask>('Task', taskSchema);
export default Task;

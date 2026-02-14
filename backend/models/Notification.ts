import mongoose, { Document, Schema, Model } from 'mongoose';

export interface INotification extends Document {
    type: 'challenge' | 'idea' | 'comment' | 'status';
    title: string;
    text: string;
    unread: boolean;
    link?: string;
    user: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const notificationSchema: Schema<INotification> = new mongoose.Schema({
    type: {
        type: String,
        enum: ['challenge', 'idea', 'comment', 'status'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    unread: {
        type: Boolean,
        default: true
    },
    link: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

const Notification: Model<INotification> = mongoose.model<INotification>('Notification', notificationSchema);
export default Notification;

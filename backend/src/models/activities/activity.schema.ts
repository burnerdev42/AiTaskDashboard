import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ACTIVITY_TYPES } from '../../common/constants/app-constants';

export type ActivityDocument = Activity & Document;

@Schema({ timestamps: true })
export class Activity {
    @Prop({ required: true, enum: [...ACTIVITY_TYPES] })
    type: string;

    @Prop({ default: null })
    fk_id: string;

    @Prop({ required: true })
    userId: string;

    @Prop()
    month: number;

    @Prop()
    year: number;
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);

ActivitySchema.pre('save', function (this: ActivityDocument, next: Function) {
    if (this.isNew || this.isModified('createdAt')) {
        const date = (this as any).createdAt || new Date();
        this.month = date.getMonth() + 1;
        this.year = date.getFullYear();
    }
    next();
});

ActivitySchema.index({ userId: 1, createdAt: -1 });
ActivitySchema.index({ type: 1 });
ActivitySchema.index({ fk_id: 1 });

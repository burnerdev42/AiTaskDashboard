import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Challenge from './models/Challenge';

dotenv.config();

if (!process.env.MONGO_URI) {
    console.error('MONGO_URI is not defined');
    process.exit(1);
}

console.log('URI:', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('Connected.');
        const count = await Challenge.countDocuments();
        console.log('Challenge Count:', count);
        const challenges = await Challenge.find().select('title');
        console.log('Challenges:', challenges);
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });

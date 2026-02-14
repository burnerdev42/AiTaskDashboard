const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Challenge = require('./models/Challenge');

dotenv.config();

console.log('URI:', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI, {
})
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

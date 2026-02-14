import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
if (process.env.MONGO_URI) {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log('MongoDB Connected'))
        .catch(err => console.log(err));
} else {
    console.error('MONGO_URI is not defined in .env');
}

// Routes
app.get('/', (req: Request, res: Response) => {
    res.send('API is running...');
});

// Import Routes
import authRoutes from './routes/authRoutes';
import challengeRoutes from './routes/challengeRoutes';
import ideaRoutes from './routes/ideaRoutes';
import taskRoutes from './routes/taskRoutes';
import notificationRoutes from './routes/notificationRoutes';
import metricRoutes from './routes/metricRoutes';

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/ideas', ideaRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/metrics', metricRoutes);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

export default app;

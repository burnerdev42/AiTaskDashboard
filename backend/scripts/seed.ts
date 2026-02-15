// @ts-nocheck
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { UserSchema } from '../src/models/users/user.schema';
import { ChallengeSchema } from '../src/models/challenges/challenge.schema';
import { IdeaSchema } from '../src/models/ideas/idea.schema';
import { TaskSchema } from '../src/models/tasks/task.schema';
import * as bcrypt from 'bcryptjs';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ai-task-dashboard';

const User = mongoose.model('User', UserSchema);
const Challenge = mongoose.model('Challenge', ChallengeSchema);
const Idea = mongoose.model('Idea', IdeaSchema);
const Task = mongoose.model('Task', TaskSchema);

const MOCK_USERS = [
    { name: 'Asmi 2', email: 'admin@ananta.com', role: 'Admin', avatar: 'A' },
    { name: 'Siddharth Banerjee', email: 'siddharth@ananta.com', role: 'Innovation Lead', avatar: 'SB', initial: 'SB', color: '#66bb6a' },
    { name: 'Ananya Basu', email: 'ananya@ananta.com', role: 'AI / ML Engineer', avatar: 'AB', initial: 'AB', color: '#f0b870' },
    { name: 'Ravi Patel', email: 'ravi@ananta.com', role: 'User', avatar: 'RP', initial: 'RP', color: '#e8a758', },
    { name: 'Meera Singh', email: 'meera@ananta.com', role: 'User', avatar: 'MS', initial: 'MS', color: '#ab47bc', },
    { name: 'Dev Ghosh', email: 'dev@ananta.com', role: 'User', avatar: 'DG', initial: 'DG', color: '#ffa726', }
];

const MOCK_CHALLENGES = [
    { title: 'Unified Customer 360 Platform', description: 'Consolidated customer view across CRM, billing, and support.', stage: 'Scale', priority: 'Low', accentColor: 'green', ownerEmail: 'siddharth@ananta.com', stats: { appreciations: 142, comments: 38 }, tags: ['Highlighted'] },
    { title: 'Conversational Commerce Bot', description: 'GenAI assistant handling product queries.', stage: 'Pilot', priority: 'High', accentColor: 'blue', ownerEmail: 'ananya@ananta.com', tags: ['Most Appreciated', 'Pilot'], stats: { appreciations: 189, comments: 54 } },
    { title: 'Smart Warehouse Routing', description: 'IoT-driven warehouse navigation.', stage: 'Prototype', priority: 'Low', accentColor: 'orange', ownerEmail: 'ananya@ananta.com', tags: ['Top Voted'], stats: { appreciations: 97, votes: 214 } },
    { title: 'AI-Powered Demand Forecasting', description: 'ML to predict regional demand patterns.', stage: 'Ideation', priority: 'Medium', accentColor: 'purple', ownerEmail: 'siddharth@ananta.com', tags: ['Highlighted'], stats: { appreciations: 76 } },
    { title: 'Digital Twin – Factory Floor', description: 'Real-time 3D simulation of production lines.', stage: 'Pilot', priority: 'Medium', accentColor: 'teal', ownerEmail: 'ravi@ananta.com', tags: ['Most Appreciated'], stats: { appreciations: 118 } },
    // Parking Lot items
    { title: 'Drone Inventory Scan', description: 'Autonomous drone-based cycle counting.', stage: 'Parking Lot', priority: 'Low', accentColor: 'grey', ownerEmail: 'ravi@ananta.com', tags: ['On Hold'], stats: { appreciations: 45 } }
];

const MOCK_IDEAS = [
    // Ideation / Prototype (mapped to POC for now if needed, or keep as is if enum supports it. Enum supports Ideation)
    { title: 'AI Churn Prediction Model', description: 'Gradient-boosted ML model.', ownerEmail: 'siddharth@ananta.com', status: 'POC', priority: 'Medium', type: 'standard' },
    { title: 'Smart Invoice OCR', description: 'Document AI pipeline.', ownerEmail: 'ananya@ananta.com', status: 'POC', priority: 'Low', type: 'standard' },
    { title: 'Dynamic Slot Allocation', description: 'Real-time warehouse bay assignment engine.', ownerEmail: 'ravi@ananta.com', status: 'POC', priority: 'Medium', type: 'standard' },
    { title: 'Gamified Onboarding', description: 'Interactive tutorial system.', ownerEmail: 'meera@ananta.com', status: 'POC', priority: 'Low', type: 'standard' },
    { title: 'Personalised Retention Offers', description: 'Context-aware discount engine.', ownerEmail: 'siddharth@ananta.com', status: 'POC', priority: 'Medium', type: 'standard' },
    { title: 'Robotic Picking Arms', description: 'Feasibility study for collaborative robotic arms.', ownerEmail: 'ananya@ananta.com', status: 'POC', priority: 'High', type: 'standard' },
    { title: 'Voice-Based Order Entry', description: 'NLP-powered hands-free order capture.', ownerEmail: 'ravi@ananta.com', status: 'POC', priority: 'Low', type: 'standard' },
    { title: 'Sentiment Analysis Dashboard', description: 'Real-time CSAT and NPS tracker.', ownerEmail: 'dev@ananta.com', status: 'POC', priority: 'Medium', type: 'standard' },

    // POC & Pilot
    { title: 'AI Churn Prediction – v0.3', description: 'Validated prototype against historical data.', ownerEmail: 'siddharth@ananta.com', status: 'Pilot', priority: 'Medium', type: 'standard' },
    { title: 'Invoice OCR Engine', description: 'Document AI pipeline MVP.', ownerEmail: 'ananya@ananta.com', status: 'Pilot', priority: 'Medium', type: 'standard' },
    { title: 'Smart Warehouse Routing – Pilot', description: 'Live pilot in Kolkata distribution centre.', ownerEmail: 'ravi@ananta.com', status: 'Pilot', priority: 'Low', type: 'standard' },
    { title: 'Digital Twin – Factory', description: 'Real-time 3D simulation.', ownerEmail: 'ananya@ananta.com', status: 'Pilot', priority: 'Medium', type: 'standard' },
    { title: 'Conversational Commerce Bot – Pilot', description: 'GenAI shopping assistant.', ownerEmail: 'meera@ananta.com', status: 'Pilot', priority: 'High', type: 'standard' },
    { title: 'Energy Consumption Optimizer', description: 'IoT-driven HVAC scheduling pilot.', ownerEmail: 'dev@ananta.com', status: 'Pilot', priority: 'Low', type: 'standard' },

    // Deployed / Scale
    { title: 'Unified Customer 360', description: 'Consolidated CRM data.', ownerEmail: 'siddharth@ananta.com', status: 'Scale', priority: 'Low', type: 'standard' },
    { title: 'Predictive Maintenance', description: 'ML-powered anomaly detection.', ownerEmail: 'ananya@ananta.com', status: 'Scale', priority: 'Low', type: 'standard' },
    { title: 'Smart Shelf Replenishment', description: 'Computer vision + weight-sensor system.', ownerEmail: 'ravi@ananta.com', status: 'Scale', priority: 'Low', type: 'standard' },
    { title: 'Automated Quality Inspection', description: 'High-speed camera + deep learning QA.', ownerEmail: 'dev@ananta.com', status: 'Scale', priority: 'Low', type: 'standard' },

    // Parking Lot
    { title: 'AR Field Service', description: 'Augmented reality guided repairs.', ownerEmail: 'meera@ananta.com', status: 'Parking Lot', priority: 'Low', type: 'standard' },
    { title: 'Blockchain Traceability', description: 'Distributed ledger for supply chain.', ownerEmail: 'siddharth@ananta.com', status: 'Parking Lot', priority: 'Low', type: 'standard' }
];

async function seed() {
    console.log(`Connection to ${MONGO_URI}...`);
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // 1. Clear database
    await User.deleteMany({});
    await Challenge.deleteMany({});
    await Idea.deleteMany({});
    await Task.deleteMany({});
    console.log('Database cleared');

    // 2. Insert Users
    const userMap = new Map();
    // Use plain password, let pre-save hook hash it!
    const defaultPassword = 'password123';

    for (const userData of MOCK_USERS) {
        const userId = new mongoose.Types.ObjectId();
        // Capitalized 'Admin' or 'User' as per schema
        const role = userData.role === 'Admin' ? 'Admin' : 'User';
        const bio = userData.role !== 'Admin' ? userData.role : undefined;

        await User.create({
            _id: userId,
            ...userData,
            role,
            bio,
            password: defaultPassword,
        });
        userMap.set(userData.email, userId);
        console.log(`Created user: ${userData.name}`);
    }

    // 3. Insert Challenges
    const challengeMap = new Map(); // Title -> ID
    for (const challengeData of MOCK_CHALLENGES) {
        const ownerId = userMap.get(challengeData.ownerEmail);
        const { ownerEmail, ...data } = challengeData;
        const challengeId = new mongoose.Types.ObjectId();

        const challenge = await Challenge.create({
            _id: challengeId,
            ...data,
            owner: ownerId,
        });
        challengeMap.set(challenge.title, challengeId);
        console.log(`Created challenge: ${challenge.title}`);
    }

    // 4. Insert Ideas
    for (const ideaData of MOCK_IDEAS) {
        const ownerId = userMap.get(ideaData.ownerEmail);
        const { ownerEmail, ...data } = ideaData;

        // Try to link to a relevant challenge if title matches partially, else random
        let linkedChallenge = null;
        if (ideaData.title.includes('Churn') || ideaData.description.includes('Churn')) linkedChallenge = challengeMap.get('Unified Customer 360 Platform'); // Approximate mapping

        await Idea.create({
            _id: new mongoose.Types.ObjectId(),
            ...data,
            owner: ownerId,
            linkedChallenge: linkedChallenge,
            stats: { appreciations: Math.floor(Math.random() * 100), comments: Math.floor(Math.random() * 20), views: Math.floor(Math.random() * 500) }
        });
        console.log(`Created idea: ${ideaData.title}`);
    }

    console.log('Seeding complete!');
    await mongoose.disconnect();
}

seed().catch(err => {
    console.error('Seeding failed:', err);
    mongoose.disconnect();
    process.exit(1);
});

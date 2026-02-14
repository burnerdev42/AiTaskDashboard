import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User';
import Challenge from './models/Challenge';
import Idea from './models/Idea';
import Task from './models/Task';
import Notification from './models/Notification';

dotenv.config();

if (!process.env.MONGO_URI) {
    console.error('MONGO_URI is not defined');
    process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected for Seeding'))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });

const importData = async () => {
    try {
        await User.deleteMany();
        await Challenge.deleteMany();
        await Idea.deleteMany();
        await Task.deleteMany();
        await Notification.deleteMany();

        console.log('Data Destroyed...');

        // --- Users ---
        const users = [
            { name: 'Admin User', email: 'admin@example.com', password: 'password123', role: 'Admin', avatar: 'ADM', avatarColor: '#FF5733' },
            { name: 'Ravi Patel', email: 'ravi@example.com', password: 'password123', role: 'User', avatar: 'RP', avatarColor: 'var(--accent-teal)' },
            { name: 'Sarita Banerjee', email: 'sarita@example.com', password: 'password123', role: 'User', avatar: 'SB', avatarColor: 'var(--accent-blue)' },
            { name: 'Amit Basu', email: 'amit@example.com', password: 'password123', role: 'User', avatar: 'AB', avatarColor: 'var(--accent-green)' },
            { name: 'Ananya Basu', email: 'ananya@example.com', password: 'password123', role: 'User', avatar: 'AB', avatarColor: 'var(--accent-blue)' },
            { name: 'Nikhil Verma', email: 'nikhil@example.com', password: 'password123', role: 'User', avatar: 'NV', avatarColor: 'var(--accent-orange)' },
        ];

        const createdUsers = await User.create(users);
        const usersList = createdUsers.slice(1); // Non-admin users

        console.log(`Created ${createdUsers.length} Users`);

        const getRandomUser = () => usersList[Math.floor(Math.random() * usersList.length)]._id;
        const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
        const getRandomFloat = (min: number, max: number) => (Math.random() * (max - min) + min).toFixed(1);

        // --- Challenges ---
        const challengeTitles = [
            'Reduce Customer Churn by 15%',
            'Automate Invoice Processing End-to-End',
            'Optimize Warehouse Slot Allocation',
            'Improve First-Contact Resolution to 85%',
            'Predictive Maintenance for Manufacturing Lines',
            'Real-Time Last-Mile Delivery Tracking',
            'Harmonise Product Data Across 5 Regions',
            'Automate ESG Reporting & Carbon Accounting',
            'Shelf Planogram Compliance Monitoring',
            'Voice-Driven Order Entry for Warehouses'
        ];

        const stages = ['Scale', 'Pilot', 'Prototype', 'Ideation'] as const;
        const priorities = ['High', 'Medium', 'Low'] as const;

        const challenges = [];
        for (let i = 0; i < challengeTitles.length; i++) {
            challenges.push({
                title: challengeTitles[i],
                description: `This is a description for ${challengeTitles[i]}. It aims to solve critical business problems using AI.`,
                stage: stages[Math.floor(Math.random() * stages.length)],
                owner: getRandomUser(),
                accentColor: ['teal', 'blue', 'green', 'orange', 'purple'][Math.floor(Math.random() * 5)],
                stats: {
                    appreciations: getRandomInt(5, 50),
                    comments: getRandomInt(0, 20),
                    roi: `${getRandomFloat(1.5, 5.0)}x`,
                    savings: `$${getRandomFloat(0.1, 2.0)}M`,
                    markets: getRandomInt(1, 10),
                    members: getRandomInt(2, 10),
                    votes: getRandomInt(10, 100),
                    accuracy: `${getRandomInt(80, 99)}%`,
                    methods: getRandomInt(1, 5)
                },
                tags: ['AI', 'Automation', 'Efficiency'],
                priority: priorities[Math.floor(Math.random() * priorities.length)],
                estimatedImpact: `$${getRandomFloat(0.5, 5.0)}M`,
                team: [getRandomUser(), getRandomUser()]
            });
        }

        const createdChallenges = await Challenge.create(challenges);
        console.log(`Created ${createdChallenges.length} Challenges`);

        // --- Ideas ---
        const ideas = [];
        const ideaStatuses = ['Ideation', 'Evaluation', 'POC', 'Pilot', 'Scale'] as const;

        for (let i = 0; i < 30; i++) {
            const linkedChallenge = createdChallenges[Math.floor(Math.random() * createdChallenges.length)];
            ideas.push({
                title: `Idea #${i + 1} for ${linkedChallenge.title.substring(0, 20)}...`,
                description: 'A cutting-edge solution leveraging Generative AI and ML.',
                status: ideaStatuses[Math.floor(Math.random() * ideaStatuses.length)],
                owner: getRandomUser(),
                linkedChallenge: linkedChallenge._id,
                tags: ['GenAI', 'ML', 'Cloud'],
                stats: {
                    appreciations: getRandomInt(1, 30),
                    comments: getRandomInt(0, 10),
                    views: getRandomInt(20, 200)
                },
                impactLevel: priorities[Math.floor(Math.random() * priorities.length)]
            });
        }

        await Idea.create(ideas);
        console.log(`Created ${ideas.length} Ideas`);

        // --- Tasks ---
        const taskTiles = [
            'Vendor API Integration', 'Model Training v1', 'User Acceptance Testing',
            'Security Compliance Audit', 'UI/UX Refresh', 'Performance Optimization',
            'Data Pipeline Setup', 'Documentation Update', 'Stakeholder Demo',
            'Legacy System Migration'
        ];

        const tasks = [];
        for (let i = 0; i < 40; i++) {
            tasks.push({
                title: taskTiles[Math.floor(Math.random() * taskTiles.length)] + ` (${i})`,
                description: 'Task details...',
                owner: getRandomUser(),
                priority: priorities[Math.floor(Math.random() * priorities.length)],
                stage: stages[Math.floor(Math.random() * stages.length)],
                type: ['evaluation', 'pilot', 'validation', 'standard'][Math.floor(Math.random() * 4)],
                progress: getRandomInt(0, 100),
                value: `€${getRandomInt(10, 100)}K`
            });
        }

        await Task.create(tasks);
        console.log(`Created ${tasks.length} Tasks`);

        // --- Notifications ---
        const notifications = [];
        for (const user of createdUsers) {
            notifications.push({
                type: 'status',
                title: 'Welcome to the Dashboard',
                text: 'Your account has been set up successfully.',
                user: user._id
            });
            notifications.push({
                type: 'challenge',
                title: 'New Challenge Assigned',
                text: 'You have been added to the team for a new challenge.',
                user: user._id
            });
        }
        await Notification.create(notifications);
        console.log(`Created ${notifications.length} Notifications`);

        console.log('Data Imported Successfully!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();

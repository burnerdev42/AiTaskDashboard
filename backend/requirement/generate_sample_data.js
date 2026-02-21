const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'sample_data');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randoInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pad = (num, size) => num.toString().padStart(size, '0');

// Generate realistic 24-character hex MongoDB ObjectIds
const genId = () => [...Array(24)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

const userIds = Array.from({ length: 25 }, genId);
const challengeIds = Array.from({ length: 30 }, genId);
const ideaIds = Array.from({ length: 35 }, genId);
const commentIds = Array.from({ length: 45 }, genId);
const activityIds = Array.from({ length: 50 }, genId);
const notificationIds = Array.from({ length: 50 }, genId);

const opcos = ['OpCo Alpha', 'OpCo Beta', 'OpCo Gamma'];
const platforms = ['Web', 'Mobile - iOS', 'Mobile - Android', 'Desktop'];
const roles = ['Software Engineer', 'Product Manager', 'Data Scientist', 'Designer'];
const swimLanes = ['Draft', 'Under Review', 'Active Voting', 'In Pilot', 'Completed'];

const users = userIds.map((id, i) => ({
    _id: { "$oid": id },
    name: `User ${i + 1}`,
    opco: rand(opcos),
    platform: rand(platforms),
    companyTechRole: rand(roles),
    email: `user${i + 1}@example.com`,
    interestAreas: ['ai', rand(['cloud', 'data', 'security', 'blockchain'])],
    role: i === 0 ? 'ADMIN' : rand(['MEMBER', 'USER', 'USER']),
    status: rand(['APPROVED', 'APPROVED', 'PENDING', 'INACTIVE']),
    innovationScore: randoInt(1, 999),
    upvotedChallengeList: Array.from({ length: randoInt(0, 5) }, () => ({ "$oid": rand(challengeIds) })),
    upvotedAppreciatedIdeaList: Array.from({ length: randoInt(0, 5) }, () => ({ "$oid": rand(ideaIds) })),
    createdAt: { "$date": new Date(Date.now() - randoInt(10000000, 10000000000)).toISOString() },
    updatedAt: { "$date": new Date().toISOString() }
}));

const challenges = challengeIds.map((id, i) => {
    const createdAtStr = new Date(Date.now() - randoInt(10000000, 10000000000)).toISOString();
    const status = rand(swimLanes);
    let pilotDate = null;
    let completedDate = null;

    if (status === 'In Pilot') {
        pilotDate = { "$date": new Date().toISOString() };
    } else if (status === 'Completed') {
        pilotDate = { "$date": new Date(Date.now() - 86400000 * 7).toISOString() };
        completedDate = { "$date": new Date().toISOString() };
    }

    return {
        _id: { "$oid": id },
        title: `Challenge: Optimize Process ${i + 1}`,
        opco: rand(opcos),
        platform: rand(platforms),
        description: `This is the detailed description for challenge ${i + 1}.`,
        summary: `Summary of optimization challenge ${i + 1}`,
        outcome: `Expected outcome includes a 20% increase in efficiency.`,
        timeline: rand(['Q1', 'Q2', 'Q3', 'Q4']),
        portfolioLane: rand(['Core', 'Adjacent', 'Transformational']),
        priority: rand(['High', 'Medium', 'Low']),
        tags: ['ai', 'optimization', 'process'],
        constraint: 'Budget limited to $5000',
        stackeHolder: `Stakeholder ${i + 1}`,
        virtualId: `CH-${pad(i + 1, 3)}`,
        status: status,
        userId: { "$oid": rand(userIds) },
        createdAt: { "$date": createdAtStr },
        month: new Date(createdAtStr).getMonth() + 1,
        year: new Date(createdAtStr).getFullYear(),
        updatedAt: { "$date": new Date().toISOString() },
        upVotes: Array.from({ length: randoInt(0, 10) }, () => ({ "$oid": rand(userIds) })),
        subcriptions: Array.from({ length: randoInt(0, 5) }, () => ({ "$oid": rand(userIds) })),
        viewCount: randoInt(10, 300),
        timestampOfStatusChangedToPilot: pilotDate,
        timestampOfCompleted: completedDate
    };
});

const ideas = ideaIds.map((id, i) => {
    const createdAtStr = new Date(Date.now() - randoInt(1000000, 100000000)).toISOString();
    return {
        _id: { "$oid": id },
        ideaId: `ID-${pad(i + 1, 4)}`,
        title: `Idea implementation for Challenge ${i + 1}`,
        description: `I propose we implement a microservices architecture for idea ${i + 1}.`,
        proposedSolution: `Use Docker and Kubernetes for implementation.`,
        expectedImpact: `High scalability and reduced downtime.`,
        challengeId: { "$oid": rand(challengeIds) },
        appreciationCount: randoInt(0, 150),
        viewCount: randoInt(10, 500),
        userId: { "$oid": rand(userIds) },
        subscription: Array.from({ length: randoInt(0, 5) }, () => ({ "$oid": rand(userIds) })),
        createdAt: { "$date": createdAtStr },
        month: new Date(createdAtStr).getMonth() + 1,
        year: new Date(createdAtStr).getFullYear(),
        updatedAt: { "$date": new Date().toISOString() },
        status: true,
        upVotes: Array.from({ length: randoInt(0, 10) }, () => ({ "$oid": rand(userIds) }))
    };
});

const comments = commentIds.map((id, i) => {
    const isCh = Math.random() > 0.5;
    return {
        _id: { "$oid": id },
        userId: { "$oid": rand(userIds) },
        comment: `This is an insightful comment number ${i + 1}. Great work!`,
        type: isCh ? 'CH' : 'ID',
        typeId: { "$oid": isCh ? rand(challengeIds) : rand(ideaIds) },
        createdat: { "$date": new Date(Date.now() - randoInt(1000, 10000000)).toISOString() }
    };
});

const actTypes = [
    'challenge_created', 'idea_created', 'challenge_status_update',
    'challenge_edited', 'idea_edited',
    'challenge_upvoted', 'idea_upvoted', 'challenge_commented',
    'idea_commented', 'challenge_subscribed', 'idea_subscribed',
    'challenge_deleted', 'idea_deleted', 'log_in', 'log_out'
];
const activities = activityIds.map((id, i) => {
    const createdAtStr = new Date(Date.now() - randoInt(1000, 1000000)).toISOString();
    return {
        _id: { "$oid": id },
        type: rand(actTypes),
        fkId: { "$oid": rand([...challengeIds, ...ideaIds]) },
        userId: { "$oid": rand(userIds) },
        month: new Date(createdAtStr).getMonth() + 1,
        year: new Date(createdAtStr).getFullYear(),
        createdAt: { "$date": createdAtStr }
    };
});

const notTypes = [
    'challenge_created', 'challenge_status_update', 'challenge_edited',
    'idea_edited', 'challenge_upvoted', 'idea_upvoted',
    'challenge_commented', 'idea_commented', 'challenge_subscribed',
    'idea_subscribed', 'challenge_deleted', 'idea_deleted'
];
const notifications = notificationIds.map((id, i) => ({
    _id: { "$oid": id },
    type: rand(notTypes),
    fkId: { "$oid": rand([...challengeIds, ...ideaIds, ...commentIds]) },
    userId: { "$oid": rand(userIds) },
    isSeen: Math.random() > 0.5,
    createdAt: { "$date": new Date(Date.now() - randoInt(1000, 1000000)).toISOString() }
}));

fs.writeFileSync(path.join(dir, 'users_data.json'), JSON.stringify(users, null, 2));
fs.writeFileSync(path.join(dir, 'challenges_data.json'), JSON.stringify(challenges, null, 2));
fs.writeFileSync(path.join(dir, 'ideas_data.json'), JSON.stringify(ideas, null, 2));
fs.writeFileSync(path.join(dir, 'comments_data.json'), JSON.stringify(comments, null, 2));
fs.writeFileSync(path.join(dir, 'activities_data.json'), JSON.stringify(activities, null, 2));
fs.writeFileSync(path.join(dir, 'notifications_data.json'), JSON.stringify(notifications, null, 2));

console.log('Sample data updated with valid randomized metrics matching new specs.');

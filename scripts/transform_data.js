const fs = require('fs');
const path = require('path');

const usersPath = path.join(__dirname, '../live_data/user.json');
const projectsPath = path.join(__dirname, '../live_data/projects.json');

const usersRaw = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
const projectsRaw = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));

const accentColors = ['teal', 'blue', 'green', 'orange', 'purple', 'pink'];
const hexColors = ['var(--accent-teal)', 'var(--accent-blue)', 'var(--accent-green)', 'var(--accent-orange)', 'var(--accent-purple)', 'var(--accent-pink)'];

function getAccentColor(index) {
    return accentColors[index % accentColors.length];
}

function getHexColor(index) {
    return hexColors[index % hexColors.length];
}

const MOCK_USERS = usersRaw.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    avatar: u.avatar
}));

function getUser(id) {
    const user = MOCK_USERS.find(u => u.id === id);
    if (!user) return { name: 'Unknown User', avatar: 'U', email: '', role: 'USER' };
    return user;
}

function getUserMeta(id, idx = 0) {
    const user = getUser(id);
    return {
        name: user.name,
        avatar: user.avatar,
        avatarColor: getHexColor(idx)
    };
}

const stageMap = {
    "Pilot": "POC & Pilot",
    "Parking Lot": "Parking Lot",
    "Evaluation": "Ideation & Evaluation",
    "Modernization": "Scaled & Deployed",
    "AMS": "Scaled & Deployed",
    "Submitted": "Challenge Submitted"
};

function getStage(status) {
    return stageMap[status] || "Challenge Submitted";
}

const challengeDetails = projectsRaw.map((p, idx) => {
    const owner = getUserMeta(p.ownerId, idx);
    const tags = p.challengeTags || [];

    return {
        id: p.id,
        title: p.name,
        description: p.problemStatement.substring(0, 300) + (p.problemStatement.length > 300 ? '...' : ''),
        stage: getStage(p.status),
        owner: owner,
        accentColor: getAccentColor(idx),
        stats: { appreciations: Math.floor(Math.random() * 50), comments: Math.floor(Math.random() * 20), votes: Math.floor(Math.random() * 100) },
        tags: tags,
        summary: p.summary,
        problemStatement: p.problemStatement,
        expectedOutcome: p.outcome,
        businessUnit: p.opco || 'Global',
        department: p.platform || 'Innovation',
        priority: 'High',
        estimatedImpact: 'TBD',
        challengeTags: tags,
        timeline: '3-6 months',
        portfolioOption: p.portfolioOption || 'TBD',
        constraints: 'None',
        stakeholders: 'TBD',
        ideas: (p.ideas || []).map((i, iIdx) => {
            const ideaOwner = getUser(i.userId);
            return {
                id: i.id,
                title: i.ideaTitle,
                author: ideaOwner.name,
                status: 'Accepted',
                appreciations: Math.floor(Math.random() * 20),
                comments: Math.floor(Math.random() * 5),
                views: Math.floor(Math.random() * 100)
            };
        }),
        team: [
            { ...owner, role: 'Owner' }
        ],
        activity: [],
        createdDate: 'Jan 15, 2026',
        updatedDate: 'Feb 10, 2026',
        approvalStatus: 'Approved'
    };
});

const ideaDetails = [];
projectsRaw.forEach((p, idx) => {
    if (p.ideas) {
        p.ideas.forEach((i, iIdx) => {
            const owner = getUser(i.userId);
            ideaDetails.push({
                id: i.id,
                title: i.ideaTitle,
                description: i.ideaDetail,
                problemStatement: p.problemStatement,
                proposedSolution: i.proposedSolution,
                status: 'Accepted',
                owner: {
                    name: owner.name,
                    avatar: owner.avatar,
                    avatarColor: getHexColor(iIdx),
                    role: owner.role
                },
                linkedChallenge: {
                    id: p.id,
                    title: p.name
                },
                tags: p.challengeTags || [],
                stats: {
                    appreciations: Math.floor(Math.random() * 20),
                    comments: Math.floor(Math.random() * 5),
                    views: Math.floor(Math.random() * 100)
                },
                impactLevel: 'Medium',
                submittedDate: 'Feb 01, 2026',
                lastUpdated: 'Feb 15, 2026',
                approvalStatus: 'Approved'
            });
        });
    }
});

const challengeCards = projectsRaw.map((p, idx) => {
    const owner = getUser(p.ownerId);
    return {
        id: p.id,
        challengeNumber: p.id,
        title: p.name,
        description: p.problemStatement.substring(0, 200) + (p.problemStatement.length > 200 ? '...' : ''),
        stage: getStage(p.status),
        impact: 'High',
        ideasCount: (p.ideas || []).length,
        effort: '12 weeks',
        value: 'TBD',
        owner: { name: owner.name, initial: owner.avatar, color: getHexColor(idx) },
        team: [{ name: owner.name, initial: owner.avatar, color: getHexColor(idx) }]
    };
});

const MOCK_CHALLENGES = projectsRaw.map((p, idx) => {
    const owner = getUserMeta(p.ownerId, idx);
    const tags = p.challengeTags || [];
    return {
        id: p.id,
        title: p.name,
        description: p.problemStatement.substring(0, 300) + (p.problemStatement.length > 300 ? '...' : ''),
        stage: getStage(p.status),
        owner: owner,
        accentColor: getAccentColor(idx),
        stats: { appreciations: Math.floor(Math.random() * 50), comments: Math.floor(Math.random() * 20) },
        summary: p.summary,
        tags: tags,
        team: [{ name: owner.name, avatar: owner.avatar, avatarColor: owner.avatarColor }],
        impact: 'High',
        approvalStatus: 'Approved'
    };
});

const MOCK_SWIMLANES = projectsRaw.map((p, idx) => {
    const owner = getUser(p.ownerId);
    return {
        id: p.id,
        title: p.name,
        description: p.problemStatement.substring(0, 200) + (p.problemStatement.length > 200 ? '...' : ''),
        owner: owner.name,
        priority: 'High',
        stage: getStage(p.status),
        type: 'standard'
    };
});

function formatExport(name, data) {
    let typeName = 'any[]';
    if (name === 'challengeDetails') typeName = 'ChallengeDetailData[]';
    if (name === 'ideaDetails') typeName = 'Idea[]';
    if (name === 'challengeCards') typeName = 'ChallengeCardData[]';
    if (name === 'MOCK_USERS') typeName = 'User[]';
    if (name === 'MOCK_CHALLENGES') typeName = 'Challenge[]';
    if (name === 'MOCK_SWIMLANES') typeName = 'SwimLaneCard[]';
    return `export const ${name}: ${typeName} = ${JSON.stringify(data, null, 4)};`;
}

const challengeDataContent = [
    "import type { ChallengeDetailData, Idea, ChallengeCardData } from '../types';",
    formatExport('challengeDetails', challengeDetails),
    formatExport('ideaDetails', ideaDetails),
    formatExport('challengeCards', challengeCards)
].join('\n\n');

fs.writeFileSync(path.join(__dirname, '../dashboard/src/data/challengeData.ts'), challengeDataContent);
console.log('Successfully wrote challengeData.ts');

let mockDataRaw = '';
try {
    mockDataRaw = fs.readFileSync(path.join(__dirname, '../dashboard/src/services/mockData.ts'), 'utf8');
} catch (e) {
    console.error('Could not read mockData.ts');
}

const adminLogsRegex = /export const MOCK_ADMIN_LOGS: AdminLog\[\] = (\[.*?\]);/s;
const pendingRegRegex = /export const MOCK_PENDING_REGISTRATIONS = (\[.*?\]);/s;
const pendingIdeasRegex = /export const MOCK_PENDING_IDEAS: any\[\] = (\[.*?\]);/s;
const notificationsRegex = /export const MOCK_NOTIFICATIONS: Notification\[\] = (\[.*?\]);/s;

function m(regex) {
    const matched = mockDataRaw.match(regex);
    return matched ? matched[1] : '[]';
}

const newMockDataContent = [
    "import { type Challenge, type Notification, type SwimLaneCard, type User, type AdminLog } from '../types';",
    `export const MOCK_ADMIN_LOGS: AdminLog[] = ${m(adminLogsRegex)};`,
    formatExport('MOCK_USERS', MOCK_USERS),
    formatExport('MOCK_CHALLENGES', MOCK_CHALLENGES),
    `export const MOCK_PENDING_REGISTRATIONS = ${m(pendingRegRegex)};`,
    `export const MOCK_PENDING_IDEAS: any[] = ${m(pendingIdeasRegex)};`,
    `export const MOCK_NOTIFICATIONS: Notification[] = ${m(notificationsRegex)};`,
    formatExport('MOCK_SWIMLANES', MOCK_SWIMLANES),
].join('\n\n');

fs.writeFileSync(path.join(__dirname, '../dashboard/src/services/mockData.ts'), newMockDataContent);
console.log('Successfully wrote mockData.ts');

console.log('Script completed successfully.');

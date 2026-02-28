export type ChallengeStage = 'Scaled & Deployed' | 'POC & Pilot' | 'Ideation & Evaluation' | 'Challenge Submitted' | 'Parking Lot';

export interface User {
    id: string;
    name: string;
    avatar: string; // Initials or URL
    role: string;
    email: string;
    password?: string; // In a real app, this wouldn't be here like this
    opco?: string;
    platform?: string;
    about?: string;
    interests?: string[];
}

export interface Challenge {
    id: string;
    title: string;
    description: string;
    stage: ChallengeStage;
    owner: {
        name: string;
        avatar: string; // Initials
        avatarColor: string; // Hex code
    };
    accentColor: 'teal' | 'blue' | 'green' | 'orange' | 'purple' | 'pink';
    stats: {
        appreciations: number;
        comments: number;
        roi?: string; // e.g., "3.2x"
        savings?: string; // e.g., "$4.2M"
        markets?: number;
        members?: number;
        votes?: number;
        accuracy?: string;
        methods?: number;
        [key: string]: string | number | undefined;
    };
    summary: string;
    tags?: string[]; // e.g., ["Highlighted", "Most Appreciated"]
    team?: { name: string; avatar: string; avatarColor: string }[];
    impact?: 'Critical' | 'High' | 'Medium' | 'Low';
    approvalStatus?: 'Pending' | 'Approved' | 'Rejected';
}

export interface Notification {
    id: string;
    type: 'challenge' | 'idea' | 'comment' | 'status' | 'like' | 'vote' | 'registration';
    title: string;
    text: string;
    time: string;
    unread: boolean;
    link: string;
    actionNeeded?: boolean;
    meta?: { type: string; text: string }[];
}

export interface SwimLaneCard {
    id: string;
    title: string;
    summary?: string;
    description?: string;
    owner: string;
    priority: 'High' | 'Medium' | 'Low';
    stage: ChallengeStage | 'Parking Lot'; // Parking Lot is a special lane
    type: 'evaluation' | 'pilot' | 'validation' | 'standard'; // To determine styling
    progress?: number;
    value?: string;
    kudos?: number;
}

export interface ActivityItem {
    author: string;
    avatar: string;
    avatarColor: string;
    text: string;
    time: string;
}

export interface Idea {
    id: string;
    title: string;
    description: string;
    status: 'Accepted' | 'Declined' | 'In Review' | 'Pending';
    owner: {
        name: string;
        avatar: string;
        avatarColor: string;
        role?: string;
    };
    linkedChallenge?: {
        id: string;
        title: string;
    };
    tags: string[];
    stats: {
        appreciations: number;
        comments: number;
        views: number;
    };
    approach?: string[];
    problemStatement?: string;
    proposedSolution?: string;
    expectedImpact?: string;
    expectedSavings?: string;
    impactLevel?: 'High' | 'Medium' | 'Low';
    submittedDate?: string;
    lastUpdated?: string;
    activity?: ActivityItem[];
    approvalStatus?: 'Pending' | 'Approved' | 'Rejected';
}

export interface AdminLog {
    id: string;
    action: string;
    itemType: 'Registration' | 'Challenge' | 'Idea';
    itemName: string;
    adminName: string;
    timestamp: string;
    status: 'Approved' | 'Rejected';
    details?: string;
}

export interface ChallengeCardData {
    id: string;
    challengeNumber: string;
    title: string;
    description: string;
    stage: ChallengeStage;
    impact: 'Critical' | 'High' | 'Medium' | 'Low';
    ideasCount: number;
    effort: string;
    value: string;
    owner: { name: string; initial: string; color: string };
    team: { name: string; initial: string; color: string }[];
}

export interface ChallengeDetailData extends Challenge {
    problemStatement: string;
    expectedOutcome: string;
    businessUnit: string;
    department: string;
    priority: 'High' | 'Medium' | 'Low';
    estimatedImpact: string;
    challengeTags: string[];
    summary: string;
    timeline: string;
    portfolioOption: string;
    constraints: string;
    stakeholders: string;
    ideas: { id: string; title: string; author: string; status: string; appreciations: number; comments: number; views: number }[];
    team: { name: string; avatar: string; avatarColor: string; role: string }[];
    activity: ActivityItem[];
    createdDate: string;
    updatedDate: string;
}

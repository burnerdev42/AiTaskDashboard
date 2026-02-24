import { type Challenge, type ChallengeStage } from '../../types';

const STAGE_MAP: Record<string, ChallengeStage> = {
    submitted: 'Challenge Submitted',
    ideation: 'Ideation & Evaluation',
    pilot: 'POC & Pilot',
    completed: 'Scaled & Deployed',
    archive: 'Parking Lot',
};

const ACCENT_COLORS: Challenge['accentColor'][] = ['teal', 'blue', 'green', 'orange', 'purple', 'pink'];

const AVATAR_COLORS = [
    '#FF5722', '#2196F3', '#4CAF50', '#FFC107', '#9C27B0',
    '#00BCD4', '#E91E63', '#673AB7', '#3F51B5', '#009688'
];

/**
 * Generates consistent initials from a name.
 */
const getInitials = (name: string): string => {
    if (!name) return '??';
    const parts = name.split(' ');
    if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
};

/**
 * Generates a consistent color based on a string (e.g., userId).
 */
const getColorFromString = (str: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % AVATAR_COLORS.length;
    return AVATAR_COLORS[index];
};

/**
 * Maps a backend challenge object to the frontend Challenge type.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mapBackendChallengeToFrontend = (backendChallenge: any): Challenge => {
    const {
        virtualId,
        title,
        summary,
        status,
        ownerDetails,
        countOfIdeas,
        upvoteCount,
        viewCount,
        contributorsCount,
        commentCount,
    } = backendChallenge;

    const ownerName = ownerDetails?.name || 'Unknown User';
    const ownerId = ownerDetails?._id || 'unknown';

    return {
        id: virtualId,
        title: title,
        description: summary,
        stage: STAGE_MAP[status] || 'Challenge Submitted',
        owner: {
            id: ownerId,
            name: ownerName,
            avatar: getInitials(ownerName),
            avatarColor: getColorFromString(ownerId),
        },
        accentColor: ACCENT_COLORS[parseInt(virtualId.replace(/\D/g, '')) % ACCENT_COLORS.length],
        stats: {
            appreciations: upvoteCount || 0,
            ideas: countOfIdeas || 0,
            votes: upvoteCount || 0,
            views: viewCount || 0,
            members: contributorsCount || 0,
            comments: commentCount || 0,
        },
        tags: backendChallenge.tags || [],
    };
};

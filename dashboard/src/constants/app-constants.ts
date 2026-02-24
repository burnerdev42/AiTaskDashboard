export const COMMENT_TYPES = {
    CHALLENGE: 'CH',
    IDEA: 'ID',
} as const;

export const SWIM_LANE_STATUS = [
    { code: 'submitted', label: 'Challenge Submitted' },
    { code: 'ideation', label: 'Ideation & Evaluation' },
    { code: 'pilot', label: 'POC & Pilot' },
    { code: 'completed', label: 'Scaled & Deployed' },
    { code: 'archive', label: 'Parking Lot' },
] as const;

export const PRIORITY_LEVELS = ['Critical', 'High', 'Medium', 'Low'] as const;

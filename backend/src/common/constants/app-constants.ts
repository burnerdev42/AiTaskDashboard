/**
 * @file app-constants.ts
 * @description Hardcoded constants used at runtime for validation, enum constraints,
 *              and populating related fields of domain entities.
 *              These constants are NOT stored in or fetched from the database.
 *              Source of truth: Data requirements.txt Section 0.
 */

// ─── 1. OpCo (Operating Company) ───────────────────────────────────
export const OPCO_LIST = [
  'Albert Heijn',
  'GSO',
  'GET',
  'BecSee',
  'Other',
] as const;

// ─── 2. OpCo → Platform Mapping ────────────────────────────────────
// Platforms are linked to OpCo. The `platform` field on Challenge/User
// stores the selected VALUE from this map, not the key.
const INDUSTRY_PLATFORMS = [
  'BFSI',
  'Retail & CPG',
  'Manufacturing',
  'Life Sciences & Healthcare',
  'Communications & Media',
  'Technology & Services',
  'Energy, Resources & Utilities',
  'Government & Public Services',
  'Travel & Hospitality',
  'Other',
] as const;

export const OPCO_PLATFORM_MAP: Record<string, readonly string[]> = {
  'Albert Heijn': ['STP', 'CTP', 'RTP'],
  GSO: INDUSTRY_PLATFORMS,
  GET: INDUSTRY_PLATFORMS,
  BecSee: INDUSTRY_PLATFORMS,
  Other: INDUSTRY_PLATFORMS,
};

// Flat list of all unique platform values (for schema enum validation)
export const ALL_PLATFORMS = [
  'STP',
  'CTP',
  'RTP',
  ...INDUSTRY_PLATFORMS,
] as const;

// ─── 3. Portfolio Lanes ────────────────────────────────────────────
export const PORTFOLIO_LANES = [
  'Customer Value Driver',
  'Non Strategic Product Management',
  'Tech Enabler',
  'Maintenance',
] as const;

// ─── 4. Swim Lane Status ──────────────────────────────────────────
// Short codes are stored in DB; long codes are display labels.
// Backend uses ONLY short codes.
export const SWIM_LANE_STATUS = [
  { code: 'submitted', label: 'Challenge Submitted' },
  { code: 'ideation', label: 'Ideation & Evaluation' },
  { code: 'pilot', label: 'POC & Pilot' },
  { code: 'completed', label: 'Scaled & Deployed' },
  { code: 'archive', label: 'Parking Lot' },
] as const;

// Short codes only (for schema enum validation)
export const SWIM_LANE_CODES = SWIM_LANE_STATUS.map((s) => s.code);

// ─── 5. Timeline ──────────────────────────────────────────────────
export const TIMELINE_OPTIONS = [
  '1-3 months',
  '3-6 months',
  '6-12 months',
  '12+ months',
] as const;

// ─── 6. Priority ──────────────────────────────────────────────────
export const PRIORITY_LEVELS = ['Critical', 'High', 'Medium', 'Low'] as const;

// ─── 7. User Areas of Interest ────────────────────────────────────
export const INTEREST_AREAS = [
  'Customer Experience',
  'Finance & Ops',
  'Supply Chain',
  'Product & Data',
  'Manufacturing',
  'Sustainability',
  'Logistics',
  'Retail Ops',
  'HR & Talent',
] as const;

// ─── 8. User Roles (Auth Roles) ──────────────────────────────────
export const AUTH_ROLES = ['ADMIN', 'MEMBER', 'USER'] as const;

// ─── 8b. Company Tech Roles ──────────────────────────────────────
export const COMPANY_TECH_ROLES = [
  'Innovation Lead',
  'AI / ML Engineer',
  'IoT & Digital Twin Lead',
  'Data Science Lead',
  'Full-Stack Developer',
  'UX / Design Lead',
  'Product Manager',
  'Cloud Architect',
  'Data Engineer',
  'DevOps Lead',
  'Contributor',
] as const;

// ─── 9. User Statuses ────────────────────────────────────────────
export const USER_STATUSES = [
  'PENDING',
  'APPROVED',
  'BLOCKED',
  'INACTIVE',
] as const;

// ─── 10. Activity Types (15 values) ──────────────────────────────
export const ACTIVITY_TYPES = [
  'challenge_created',
  'idea_created',
  'challenge_status_update',
  'challenge_edited',
  'idea_edited',
  'challenge_upvoted',
  'idea_upvoted',
  'challenge_commented',
  'idea_commented',
  'challenge_subscribed',
  'idea_subscribed',
  'challenge_deleted',
  'idea_deleted',
  'log_in',
  'log_out',
] as const;

// ─── 11. Notification Types (13 values) ──────────────────────────
export const NOTIFICATION_TYPES = [
  'challenge_created',
  'idea_created',
  'challenge_status_update',
  'challenge_edited',
  'idea_edited',
  'challenge_upvoted',
  'idea_upvoted',
  'challenge_commented',
  'idea_commented',
  'challenge_subscribed',
  'idea_subscribed',
  'challenge_deleted',
  'idea_deleted',
] as const;

export const NOTIFICATION_LINKED_ENTITY_TYPES = ['CH', 'ID'] as const;

// ─── Comment Types ───────────────────────────────────────────────
// CH = Challenge, ID = Idea
export const COMMENT_TYPES = ['CH', 'ID'] as const;

// ─── 12. Notification Templates ──────────────────────────────────
export const NOTIFICATION_TEMPLATES: Record<
  typeof NOTIFICATION_TYPES[number],
  { title: string; descriptionTemplate: string }
> = {
  challenge_created: {
    title: 'New Challenge Published',
    descriptionTemplate: '{initiatorName} published a new Challenge: {entityTitle}',
  },
  idea_created: {
    title: 'New Idea Submitted',
    descriptionTemplate: '{initiatorName} submitted an Idea: {entityTitle}',
  },
  challenge_status_update: {
    title: 'Challenge Status Updated',
    descriptionTemplate: '{initiatorName} updated the status of Challenge: {entityTitle}',
  },
  challenge_edited: {
    title: 'Challenge Updated',
    descriptionTemplate: '{initiatorName} updated the Challenge: {entityTitle}',
  },
  idea_edited: {
    title: 'Idea Updated',
    descriptionTemplate: '{initiatorName} updated the Idea: {entityTitle}',
  },
  challenge_upvoted: {
    title: 'New Upvote',
    descriptionTemplate: '{initiatorName} upvoted the Challenge: {entityTitle}',
  },
  idea_upvoted: {
    title: 'New Upvote',
    descriptionTemplate: '{initiatorName} upvoted the Idea: {entityTitle}',
  },
  challenge_commented: {
    title: 'New Comment',
    descriptionTemplate: '{initiatorName} commented on the Challenge: {entityTitle}',
  },
  idea_commented: {
    title: 'New Comment',
    descriptionTemplate: '{initiatorName} commented on the Idea: {entityTitle}',
  },
  challenge_subscribed: {
    title: 'New Subscriber',
    descriptionTemplate: '{initiatorName} subscribed to the Challenge: {entityTitle}',
  },
  idea_subscribed: {
    title: 'New Subscriber',
    descriptionTemplate: '{initiatorName} subscribed to the Idea: {entityTitle}',
  },
  challenge_deleted: {
    title: 'Challenge Deleted',
    descriptionTemplate: '{initiatorName} deleted the Challenge: {entityTitle}',
  },
  idea_deleted: {
    title: 'Idea Deleted',
    descriptionTemplate: '{initiatorName} deleted the Idea: {entityTitle}',
  },
};

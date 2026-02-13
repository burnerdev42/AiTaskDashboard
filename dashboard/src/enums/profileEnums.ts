/**
 * Operational Companies (OpCos) available in the system.
 */
export const OPCOS = [
    'TCS — India',
    'TCS — USA',
    'TCS — UK',
    'TCS — Europe',
    'TCS — APAC'
] as const;

export type OpCo = typeof OPCOS[number];

/**
 * Industry Platforms/Domains.
 */
export const PLATFORMS = [
    'BFSI',
    'Technology & Services',
    'Manufacturing',
    'Retail & CPG',
    'Life Sciences',
    'Communications'
] as const;

export type Platform = typeof PLATFORMS[number];

/**
 * User Interest Areas.
 */
export const INTEREST_OPTIONS = [
    'Customer Experience',
    'Product & Data',
    'Supply Chain',
    'Finance & Ops',
    'HR & Talent',
    'Sustainability',
    'Life Sciences',
    'Communications'
] as const;

export type Interest = typeof INTEREST_OPTIONS[number];

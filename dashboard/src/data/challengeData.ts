import type { ChallengeDetailData, Idea, ChallengeCardData } from '../types';

export const challengeDetails: ChallengeDetailData[] = [
    {
        id: 'CH-001',
        title: 'Reduce Customer Churn by 15%',
        description: 'High-value segment losing 8% QoQ due to poor onboarding experience. Need to identify root causes and implement retention strategies.',
        stage: 'Challenge Submitted',
        owner: { name: 'Ravi Patel', avatar: 'RP', avatarColor: 'var(--accent-teal)' },
        accentColor: 'teal',
        stats: { appreciations: 42, comments: 8, votes: 42 },
        tags: ['Highlighted'],
        problemStatement: `Our premium customer segment (lifetime value >$10K) is experiencing an alarming 8% quarter-over-quarter churn rate. Exit interviews indicate that 63% of departing customers cite frustration with the onboarding process. Competitors are offering smoother digital experiences, and we're losing market share as a result.

Key pain points identified:
• Onboarding takes 14+ days vs industry average of 3-5 days
• Complex KYC process with multiple document submissions
• Lack of real-time progress tracking
• Minimal product education during initial weeks`,
        expectedOutcome: `Reduce customer churn from 8% to below 3% within 6 months by implementing an improved onboarding experience.

Success metrics:
• Onboarding completion time reduced to 5 days or less
• Customer satisfaction score (CSAT) for onboarding >4.5/5
• First-month product activation rate >80%
• Reduce churn in first 90 days by 50%`,
        businessUnit: 'Customer Experience',
        department: 'Customer Success',
        priority: 'High',
        estimatedImpact: '$2M annual revenue retention',
        challengeTags: ['Customer Experience', 'Retention', 'Onboarding', 'Digital Transformation'],
        timeline: '3-6 months',
        portfolioOption: 'Customer Value Driver',
        constraints: 'Current systems lack easy integration points. Required APIs are legacy and may need wrapping before modernization. Security compliance for customer data must be maintained.',
        stakeholders: 'Customer Success Team, Product Management, Data Engineering',
        ideas: [],
        team: [
            { name: 'Ravi Patel', avatar: 'RP', avatarColor: 'var(--accent-teal)', role: 'Owner' },
            { name: 'Sarita Banerjee', avatar: 'SB', avatarColor: 'var(--accent-blue)', role: 'Contributor' },
            { name: 'Amit Basu', avatar: 'AB', avatarColor: 'var(--accent-green)', role: 'Contributor' },
        ],
        activity: [
            { author: 'Ravi Patel', avatar: 'RP', avatarColor: 'var(--accent-teal)', text: 'Created this challenge. Looking for innovative solutions to address our onboarding friction points.', time: '2 days ago' },
            { author: 'Sarita Banerjee', avatar: 'SB', avatarColor: 'var(--accent-blue)', text: "I've been researching ML-based churn prediction models. We could identify at-risk customers earlier in their journey. Would love to collaborate on this!", time: '1 day ago' },
            { author: 'Amit Basu', avatar: 'AB', avatarColor: 'var(--accent-green)', text: 'Have we looked at gamification for the onboarding process? Interactive tutorials with milestone rewards could significantly improve engagement.', time: '5 hours ago' },
        ],
        createdDate: 'Jan 15, 2026',
        updatedDate: 'Feb 10, 2026',
    },
];

export const ideaDetails: Idea[] = [];

export const challengeCards: ChallengeCardData[] = [
    {
        id: 'CH-001', challengeNumber: 'CH-001',
        title: 'Reduce Customer Churn by 15%',
        description: 'High-value segment losing 8% QoQ due to poor onboarding. Need to identify root causes and implement retention strategies.',
        stage: 'Challenge Submitted', impact: 'Critical', ideasCount: 8,
        effort: '12 weeks', value: '€2M/year',
        owner: { name: 'Ravi Patel', initial: 'RP', color: 'var(--accent-teal)' },
        team: [{ name: 'Ravi', initial: 'R', color: 'var(--accent-teal)' }, { name: 'Sarita', initial: 'S', color: 'var(--accent-blue)' }, { name: 'Amit', initial: 'A', color: 'var(--accent-green)' }],
    },
    {
        id: 'CH-002', challengeNumber: 'CH-002',
        title: 'Automate Invoice Processing End-to-End',
        description: 'Manual invoice handling costs $180K/year with 3-5% error rate. Need an AI-driven solution for extraction and matching.',
        stage: 'Ideation & Evaluation', impact: 'Medium', ideasCount: 5,
        effort: '8 weeks', value: '€180K/year',
        owner: { name: 'Ankit Shah', initial: 'AS', color: 'var(--accent-purple)' },
        team: [{ name: 'Ankit', initial: 'A', color: 'var(--accent-purple)' }, { name: 'Sara', initial: 'S', color: 'var(--accent-green)' }],
    },
    {
        id: 'CH-003', challengeNumber: 'CH-003',
        title: 'Optimize Warehouse Slot Allocation',
        description: 'Bay utilization at 62% due to static assignment rules. Dynamic allocation could reduce turnaround time by 35%.',
        stage: 'POC & Pilot', impact: 'High', ideasCount: 4,
        effort: '10 weeks', value: '€320K/year',
        owner: { name: 'Priya Desai', initial: 'PD', color: 'var(--accent-red)' },
        team: [{ name: 'Priya', initial: 'P', color: 'var(--accent-red)' }, { name: 'Dev', initial: 'D', color: 'var(--accent-teal)' }, { name: 'Meena', initial: 'M', color: 'var(--accent-gold, #ffd54f)' }, { name: 'Kiran', initial: 'K', color: 'var(--accent-blue)' }],
    },
    {
        id: 'CH-004', challengeNumber: 'CH-004',
        title: 'Improve First-Contact Resolution to 85%',
        description: 'CX team resolving only 64% on first contact. Agent knowledge gaps and siloed systems driving repeat escalations.',
        stage: 'Challenge Submitted', impact: 'Medium', ideasCount: 6,
        effort: '6 weeks', value: '€75K/year',
        owner: { name: 'Nikhil Verma', initial: 'NV', color: 'var(--accent-orange)' },
        team: [{ name: 'Nikhil', initial: 'N', color: 'var(--accent-orange)' }, { name: 'Vidya', initial: 'V', color: 'var(--accent-pink, #ec407a)' }],
    },
    {
        id: 'CH-005', challengeNumber: 'CH-005',
        title: 'Predictive Maintenance for Manufacturing Lines',
        description: 'Unplanned downtime costing $500K/year. Need ML-based anomaly detection across 10K+ sensor feeds.',
        stage: 'Ideation & Evaluation', impact: 'Critical', ideasCount: 3,
        effort: '14 weeks', value: '€500K/year',
        owner: { name: 'Sutanu Roy', initial: 'SR', color: 'var(--accent-green)' },
        team: [{ name: 'Sutanu', initial: 'S', color: 'var(--accent-green)' }, { name: 'Amit', initial: 'A', color: 'var(--accent-purple)' }, { name: 'Ravi', initial: 'R', color: 'var(--accent-teal)' }],
    },
    {
        id: 'CH-006', challengeNumber: 'CH-006',
        title: 'Real-Time Last-Mile Delivery Tracking',
        description: 'No live visibility into delivery routes. 18% of customers call support for status updates, clogging queues.',
        stage: 'Scaled & Deployed', impact: 'Medium', ideasCount: 7,
        effort: '6 weeks', value: '€120K/year',
        owner: { name: 'Kavita Nair', initial: 'KN', color: 'var(--accent-blue)' },
        team: [{ name: 'Kavita', initial: 'K', color: 'var(--accent-blue)' }, { name: 'Prakash', initial: 'P', color: 'var(--accent-red)' }, { name: 'Jay', initial: 'J', color: 'var(--accent-gold, #ffd54f)' }],
    },
    {
        id: 'CH-007', challengeNumber: 'CH-007',
        title: 'Harmonise Product Data Across 5 Regions',
        description: 'Five regional catalogue formats leading to SKU mismatches, search errors, and pricing inconsistencies across markets.',
        stage: 'Challenge Submitted', impact: 'Low', ideasCount: 2,
        effort: '10 weeks', value: '€200K/year',
        owner: { name: 'Deepak Joshi', initial: 'DJ', color: 'var(--accent-teal)' },
        team: [{ name: 'Deepak', initial: 'D', color: 'var(--accent-teal)' }, { name: 'Fatima', initial: 'F', color: 'var(--accent-orange)' }],
    },
    {
        id: 'CH-008', challengeNumber: 'CH-008',
        title: 'Automate ESG Reporting & Carbon Accounting',
        description: 'Quarterly ESG reports take 3 weeks of manual data gathering. Need to automate Scope 1/2/3 carbon calculations.',
        stage: 'Ideation & Evaluation', impact: 'Low', ideasCount: 4,
        effort: '8 weeks', value: '€90K/year',
        owner: { name: 'Arun Kapoor', initial: 'AK', color: 'var(--accent-green)' },
        team: [{ name: 'Arun', initial: 'A', color: 'var(--accent-green)' }, { name: 'Tara', initial: 'T', color: 'var(--accent-purple)' }, { name: 'Mohan', initial: 'M', color: 'var(--accent-pink, #ec407a)' }],
    },
    {
        id: 'CH-009', challengeNumber: 'CH-009',
        title: 'Shelf Planogram Compliance Monitoring',
        description: 'Merchandising audits are manual and cover only 30% of stores. Need automated visual compliance at scale.',
        stage: 'POC & Pilot', impact: 'Medium', ideasCount: 5,
        effort: '12 weeks', value: '€250K/year',
        owner: { name: 'Neha Gupta', initial: 'NG', color: 'var(--accent-blue)' },
        team: [{ name: 'Deepak', initial: 'D', color: 'var(--accent-red)' }, { name: 'Neha', initial: 'N', color: 'var(--accent-blue)' }, { name: 'Gaurav', initial: 'G', color: 'var(--accent-gold, #ffd54f)' }],
    },
    {
        id: 'CH-010', challengeNumber: 'CH-010',
        title: 'Voice-Driven Order Entry for Warehouses',
        description: 'Warehouse staff spending 40% of time on manual data entry. Voice-based handsfree system could boost throughput.',
        stage: 'Challenge Submitted', impact: 'Low', ideasCount: 3,
        effort: '6 weeks', value: '€110K/year',
        owner: { name: 'Rahul Mehra', initial: 'RM', color: 'var(--accent-orange)' },
        team: [{ name: 'Rahul', initial: 'R', color: 'var(--accent-orange)' }, { name: 'Sneha', initial: 'S', color: 'var(--accent-green)' }],
    },
];



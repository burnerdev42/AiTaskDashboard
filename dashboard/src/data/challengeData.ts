import type { ChallengeDetailData, Idea, ChallengeCardData } from '../types';

export const challengeDetails: ChallengeDetailData[] = [
    {
        id: 'CHG-001',
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
        ideas: [
            { id: 'ID-0001', title: 'AI Churn Prediction Model', author: 'S. Banerjee', status: 'In Review', appreciations: 24, comments: 7, views: 156 },
            { id: 'ID-0002', title: 'Gamified Onboarding Flow', author: 'M. Singh', status: 'Pending', appreciations: 18, comments: 5, views: 132 },
            { id: 'ID-0003', title: 'Personalized Tutorial System', author: 'A. Basu', status: 'Accepted', appreciations: 31, comments: 12, views: 203 },
            { id: 'ID-0004', title: 'Retention Offer Engine', author: 'R. Sharma', status: 'Declined', appreciations: 27, comments: 9, views: 178 },
            { id: 'ID-0005', title: 'Customer Health Dashboard', author: 'P. Kumar', status: 'Accepted', appreciations: 22, comments: 6, views: 145 },
            { id: 'ID-0006', title: 'Smart Segmentation AI', author: 'N. Reddy', status: 'In Review', appreciations: 15, comments: 4, views: 98 },
            { id: 'ID-0007', title: 'Automated Account Alerts', author: 'V. Gupta', status: 'Pending', appreciations: 19, comments: 3, views: 112 },
            { id: 'ID-0008', title: 'Customer Journey Analytics', author: 'D. Mehta', status: 'Accepted', appreciations: 29, comments: 11, views: 187 },
        ],
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

export const ideaDetails: Idea[] = [
    {
        id: 'ID-0003',
        title: 'AI-powered document verification',
        description: 'Automate customer onboarding document verification using computer vision and NLP to reduce processing time from 48 hours to under 5 minutes.',
        status: 'Accepted',
        owner: { name: 'Ananya Basu', avatar: 'AB', avatarColor: 'var(--accent-blue)', role: 'AI/ML Engineer' },
        linkedChallenge: { id: 'CHG-001', title: 'Reduce customer onboarding time by 40%' },
        tags: ['Document AI', 'Computer Vision', 'Automation'],
        stats: { appreciations: 12, comments: 8, views: 247 },
        problemStatement: `Current customer onboarding requires manual verification of identity documents (passport, driver's license, utility bills). This manual process takes 48+ hours and requires 3 staff members to cross-verify information, leading to:
• High operational costs (~$8 per verification)
• Customer drop-off rate of 22% due to long wait times
• Human error in 3-5% of verifications
• Inability to scale during peak periods`,
        proposedSolution: `Implement an AI-powered document verification system that combines:
• Computer Vision: Extract text and validate document authenticity using deep learning models trained on 500K+ documents
• NLP Processing: Parse and validate extracted information against government databases and fraud detection systems
• Real-time Processing: Process documents in under 5 minutes with 99.2% accuracy rate
• Flagging System: Flag suspicious documents for manual review (estimated 2-3% of total)

The system will integrate with existing CRM and onboarding workflows via REST APIs, requiring minimal changes to current processes.`,
        expectedImpact: `• Processing Time: Reduce from 48 hours to 5 minutes (576x faster)
• Cost Savings: $420K annually by reducing manual verification staff from 9 to 3 FTE
• Accuracy: Improve to 99.2% (vs. current 96%)
• Customer Experience: Reduce drop-off from 22% to estimated 8%
• Scalability: Handle 10x current volume without additional staff
• Compliance: Enhanced audit trails and regulatory compliance documentation`,
        expectedSavings: '$420K',
        impactLevel: 'High',
        submittedDate: '18 Jan 2026',
        lastUpdated: '10 Feb 2026',
        activity: [
            { author: 'Meera Singh', avatar: 'MS', avatarColor: 'var(--accent-green)', text: 'Great idea! Have you considered using Azure AI Document Intelligence instead of Form Recognizer? It has better accuracy for identity documents and built-in fraud detection features.', time: '2 days ago' },
            { author: 'Ananya Basu', avatar: 'AB', avatarColor: 'var(--accent-teal)', text: 'This aligns perfectly with our digital transformation roadmap. Flagged this for pilot consideration in Q1. Can you prepare a detailed cost-benefit analysis?', time: '3 days ago' },
            { author: 'Siddharth Banerjee', avatar: 'SB', avatarColor: 'var(--accent-blue)', text: "Excellent proposal! The 576x speedup is impressive. What's the plan for handling documents in multiple languages across our global markets?", time: '5 days ago' },
        ],
    },
];

export const challengeCards: ChallengeCardData[] = [
    {
        id: 'CHG-001', challengeNumber: 'CHG-001',
        title: 'Reduce Customer Churn by 15%',
        description: 'High-value segment losing 8% QoQ due to poor onboarding. Need to identify root causes and implement retention strategies.',
        stage: 'Challenge Submitted', impact: 'Critical', ideasCount: 8,
        effort: '12 weeks', value: '€2M/year',
        owner: { name: 'Ravi Patel', initial: 'RP', color: 'var(--accent-teal)' },
        team: [{ name: 'Ravi', initial: 'R', color: 'var(--accent-teal)' }, { name: 'Sarita', initial: 'S', color: 'var(--accent-blue)' }, { name: 'Amit', initial: 'A', color: 'var(--accent-green)' }],
    },
    {
        id: 'CHG-002', challengeNumber: 'CHG-002',
        title: 'Automate Invoice Processing End-to-End',
        description: 'Manual invoice handling costs $180K/year with 3-5% error rate. Need an AI-driven solution for extraction and matching.',
        stage: 'Ideation & Evaluation', impact: 'Medium', ideasCount: 5,
        effort: '8 weeks', value: '€180K/year',
        owner: { name: 'Ankit Shah', initial: 'AS', color: 'var(--accent-purple)' },
        team: [{ name: 'Ankit', initial: 'A', color: 'var(--accent-purple)' }, { name: 'Sara', initial: 'S', color: 'var(--accent-green)' }],
    },
    {
        id: 'CHG-003', challengeNumber: 'CHG-003',
        title: 'Optimize Warehouse Slot Allocation',
        description: 'Bay utilization at 62% due to static assignment rules. Dynamic allocation could reduce turnaround time by 35%.',
        stage: 'POC & Pilot', impact: 'High', ideasCount: 4,
        effort: '10 weeks', value: '€320K/year',
        owner: { name: 'Priya Desai', initial: 'PD', color: 'var(--accent-red)' },
        team: [{ name: 'Priya', initial: 'P', color: 'var(--accent-red)' }, { name: 'Dev', initial: 'D', color: 'var(--accent-teal)' }, { name: 'Meena', initial: 'M', color: 'var(--accent-gold, #ffd54f)' }, { name: 'Kiran', initial: 'K', color: 'var(--accent-blue)' }],
    },
    {
        id: 'CHG-004', challengeNumber: 'CHG-004',
        title: 'Improve First-Contact Resolution to 85%',
        description: 'CX team resolving only 64% on first contact. Agent knowledge gaps and siloed systems driving repeat escalations.',
        stage: 'Challenge Submitted', impact: 'Medium', ideasCount: 6,
        effort: '6 weeks', value: '€75K/year',
        owner: { name: 'Nikhil Verma', initial: 'NV', color: 'var(--accent-orange)' },
        team: [{ name: 'Nikhil', initial: 'N', color: 'var(--accent-orange)' }, { name: 'Vidya', initial: 'V', color: 'var(--accent-pink, #ec407a)' }],
    },
    {
        id: 'CHG-005', challengeNumber: 'CHG-005',
        title: 'Predictive Maintenance for Manufacturing Lines',
        description: 'Unplanned downtime costing $500K/year. Need ML-based anomaly detection across 10K+ sensor feeds.',
        stage: 'Ideation & Evaluation', impact: 'Critical', ideasCount: 3,
        effort: '14 weeks', value: '€500K/year',
        owner: { name: 'Sutanu Roy', initial: 'SR', color: 'var(--accent-green)' },
        team: [{ name: 'Sutanu', initial: 'S', color: 'var(--accent-green)' }, { name: 'Amit', initial: 'A', color: 'var(--accent-purple)' }, { name: 'Ravi', initial: 'R', color: 'var(--accent-teal)' }],
    },
    {
        id: 'CHG-006', challengeNumber: 'CHG-006',
        title: 'Real-Time Last-Mile Delivery Tracking',
        description: 'No live visibility into delivery routes. 18% of customers call support for status updates, clogging queues.',
        stage: 'Scaled & Deployed', impact: 'Medium', ideasCount: 7,
        effort: '6 weeks', value: '€120K/year',
        owner: { name: 'Kavita Nair', initial: 'KN', color: 'var(--accent-blue)' },
        team: [{ name: 'Kavita', initial: 'K', color: 'var(--accent-blue)' }, { name: 'Prakash', initial: 'P', color: 'var(--accent-red)' }, { name: 'Jay', initial: 'J', color: 'var(--accent-gold, #ffd54f)' }],
    },
    {
        id: 'CHG-007', challengeNumber: 'CHG-007',
        title: 'Harmonise Product Data Across 5 Regions',
        description: 'Five regional catalogue formats leading to SKU mismatches, search errors, and pricing inconsistencies across markets.',
        stage: 'Challenge Submitted', impact: 'Low', ideasCount: 2,
        effort: '10 weeks', value: '€200K/year',
        owner: { name: 'Deepak Joshi', initial: 'DJ', color: 'var(--accent-teal)' },
        team: [{ name: 'Deepak', initial: 'D', color: 'var(--accent-teal)' }, { name: 'Fatima', initial: 'F', color: 'var(--accent-orange)' }],
    },
    {
        id: 'CHG-008', challengeNumber: 'CHG-008',
        title: 'Automate ESG Reporting & Carbon Accounting',
        description: 'Quarterly ESG reports take 3 weeks of manual data gathering. Need to automate Scope 1/2/3 carbon calculations.',
        stage: 'Ideation & Evaluation', impact: 'Low', ideasCount: 4,
        effort: '8 weeks', value: '€90K/year',
        owner: { name: 'Arun Kapoor', initial: 'AK', color: 'var(--accent-green)' },
        team: [{ name: 'Arun', initial: 'A', color: 'var(--accent-green)' }, { name: 'Tara', initial: 'T', color: 'var(--accent-purple)' }, { name: 'Mohan', initial: 'M', color: 'var(--accent-pink, #ec407a)' }],
    },
    {
        id: 'CHG-009', challengeNumber: 'CHG-009',
        title: 'Shelf Planogram Compliance Monitoring',
        description: 'Merchandising audits are manual and cover only 30% of stores. Need automated visual compliance at scale.',
        stage: 'POC & Pilot', impact: 'Medium', ideasCount: 5,
        effort: '12 weeks', value: '€250K/year',
        owner: { name: 'Neha Gupta', initial: 'NG', color: 'var(--accent-blue)' },
        team: [{ name: 'Deepak', initial: 'D', color: 'var(--accent-red)' }, { name: 'Neha', initial: 'N', color: 'var(--accent-blue)' }, { name: 'Gaurav', initial: 'G', color: 'var(--accent-gold, #ffd54f)' }],
    },
    {
        id: 'CHG-010', challengeNumber: 'CHG-010',
        title: 'Voice-Driven Order Entry for Warehouses',
        description: 'Warehouse staff spending 40% of time on manual data entry. Voice-based handsfree system could boost throughput.',
        stage: 'Challenge Submitted', impact: 'Low', ideasCount: 3,
        effort: '6 weeks', value: '€110K/year',
        owner: { name: 'Rahul Mehra', initial: 'RM', color: 'var(--accent-orange)' },
        team: [{ name: 'Rahul', initial: 'R', color: 'var(--accent-orange)' }, { name: 'Sneha', initial: 'S', color: 'var(--accent-green)' }],
    },
];



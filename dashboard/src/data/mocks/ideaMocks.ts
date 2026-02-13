import type { Idea } from '../../types/idea';

export const MOCK_IDEA_DETAILS: Idea[] = [
        {
                id: 'IDX-003',
                title: 'AI-powered document verification',
                description: 'Automate customer onboarding document verification using computer vision and NLP to reduce processing time from 48 hours to under 5 minutes.',
                status: 'Pilot',
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
                implementationPlan: `Phase 1 - Prototype (Weeks 1-4):
• Build MVP with Azure Form Recognizer + Custom Vision
• Test with 1,000 historical documents
• Validate accuracy and edge cases

Phase 2 - Pilot (Weeks 5-8):
• Deploy to single market (UK subsidiary)
• Process 500 real customer documents in parallel with manual verification
• Collect feedback and fine-tune models

Phase 3 - Scale (Weeks 9-16):
• Roll out to all markets
• Train operations staff on flagged case handling
• Monitor and optimize performance`,
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

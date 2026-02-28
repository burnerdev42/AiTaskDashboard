import { type Challenge, type Notification, type SwimLaneCard, type User, type AdminLog } from '../types';

export const MOCK_ADMIN_LOGS: AdminLog[] = [
    {
        id: 'log-1',
        action: 'Approved Challenge',
        itemType: 'Challenge',
        itemName: 'Unified Customer 360 Platform',
        adminName: 'Ananta Admin',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Approved'
    },
    {
        id: 'log-2',
        action: 'Approved Challenge',
        itemType: 'Challenge',
        itemName: 'Digital Twin – Factory Floor',
        adminName: 'Ananta Admin',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Approved'
    },
    {
        id: 'log-3',
        action: 'Approved Registration',
        itemType: 'Registration',
        itemName: 'priya.sharma@tcs.com',
        adminName: 'Ananta Admin',
        timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Approved'
    },
    {
        id: 'log-4',
        action: 'Approved Registration',
        itemType: 'Registration',
        itemName: 'siddharth@ananta.azurewebsites.net',
        adminName: 'Ananta Admin',
        timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Approved'
    },
    {
        id: 'log-5',
        action: 'Rejected Registration',
        itemType: 'Registration',
        itemName: 'test@external.com',
        adminName: 'Ananta Admin',
        timestamp: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Rejected',
        details: 'External email'
    },
    {
        id: 'log-6',
        action: 'Approved Challenge',
        itemType: 'Challenge',
        itemName: 'Conversational Commerce Bot',
        adminName: 'Ananta Admin',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Approved'
    },
    {
        id: 'log-7',
        action: 'Rejected Challenge',
        itemType: 'Challenge',
        itemName: 'Free Lunch Fridays',
        adminName: 'Ananta Admin',
        timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Rejected',
        details: 'Not innovation-related'
    },
    {
        id: 'log-8',
        action: 'Approved Idea',
        itemType: 'Idea',
        itemName: 'AI-Powered Retention Model',
        adminName: 'Ananta Admin',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Approved'
    },
    {
        id: 'log-9',
        action: 'Approved Idea',
        itemType: 'Idea',
        itemName: 'Predictive Inventory Restocking',
        adminName: 'Ananta Admin',
        timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Approved'
    },
    {
        id: 'log-10',
        action: 'Rejected Idea',
        itemType: 'Idea',
        itemName: 'Replace All Meetings with Emails',
        adminName: 'Ananta Admin',
        timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Rejected',
        details: 'Not feasible'
    }
];

export const MOCK_USERS: User[] = [
    {
        id: 'u-admin',
        name: 'Ananta Admin',
        email: 'admin@ananta.tcs.com',
        role: 'Admin',
        avatar: 'AD',
    },
    {
        id: 'u-priya',
        name: 'Priya Sharma',
        email: 'priya.sharma@tcs.com',
        role: 'Contributor',
        avatar: 'PS',
    },
    {
        id: 'u1',
        name: 'Asmi 2',
        email: 'admin@ananta.azurewebsites.net',
        role: 'Admin',
        avatar: 'A',
    },
    {
        id: 'u2',
        name: 'Siddharth Banerjee',
        email: 'siddharth@ananta.azurewebsites.net',
        role: 'Innovation Lead',
        avatar: 'SB',
    },
    {
        id: 'u3',
        name: 'Ananya Basu',
        email: 'ananya@ananta.azurewebsites.net',
        role: 'AI / ML Engineer',
        avatar: 'AB',
    }
];

export const MOCK_CHALLENGES: Challenge[] = [
    {
        id: 'CH-001',
        title: 'Unified Customer 360 Platform',
        description: 'Consolidated customer view across CRM, billing, and support — deployed globally in 12 markets. Recognized for transforming customer experience at scale.',
        stage: 'Scaled & Deployed',
        accentColor: 'green',
        owner: { name: 'S. Banerjee', avatar: 'SB', avatarColor: '#66bb6a' },
        stats: { appreciations: 142, comments: 38, roi: '3.2x', methods: 12, savings: '$4.2M' },
        tags: ['Highlighted'],
        team: [
            { name: 'Siddharth Banerjee', avatar: 'SB', avatarColor: '#66bb6a' },
            { name: 'Ananya Basu', avatar: 'AB', avatarColor: '#42a5f5' },
            { name: 'Ravi Patel', avatar: 'RP', avatarColor: '#ffa726' }
        ],
        impact: 'Critical'
    },
    {
        id: 'CH-002',
        title: 'Conversational Commerce Bot',
        description: 'GenAI assistant handling product queries, order tracking, and returns for e-commerce. Praised for driving self-service adoption up by 65%.',
        stage: 'POC & Pilot',
        accentColor: 'blue',
        owner: { name: 'A. Basu', avatar: 'AB', avatarColor: '#f0b870' },
        tags: ['Most Appreciated', 'Pilot'],
        stats: { appreciations: 189, comments: 54, members: 12, accuracy: '92%', votes: 45 },
        team: [
            { name: 'Ananya Basu', avatar: 'AB', avatarColor: '#f0b870' },
            { name: 'Siddharth Banerjee', avatar: 'SB', avatarColor: '#42a5f5' }
        ],
        impact: 'High'
    },
    {
        id: 'CH-003',
        title: 'Smart Warehouse Routing',
        description: 'IoT-driven warehouse navigation for autonomous forklifts, reducing pick-time by 40%. Voted best innovation challenge of Q4 2025.',
        stage: 'Ideation & Evaluation',
        accentColor: 'orange',
        owner: { name: 'A. Basu', avatar: 'AB', avatarColor: '#ffa726' },
        tags: ['Top Voted'],
        stats: { appreciations: 97, votes: 214, comments: 15, savings: '40%', units: 120 },
        team: [
            { name: 'Ananya Basu', avatar: 'AB', avatarColor: '#ffa726' },
            { name: 'Rohan Patel', avatar: 'RP', avatarColor: '#66bb6a' },
            { name: 'Meera Singh', avatar: 'MS', avatarColor: '#42a5f5' }
        ],
        impact: 'High'
    },
    {
        id: 'CH-004',
        title: 'AI-Powered Demand Forecasting',
        description: 'Use machine learning to predict regional demand patterns and optimize inventory allocation. Highlighted for its potential to save $12M annually.',
        stage: 'Challenge Submitted',
        accentColor: 'purple',
        owner: { name: 'S. Banerjee', avatar: 'SB', avatarColor: '#ab47bc' },
        tags: ['Highlighted'],
        stats: { appreciations: 76, savings: '$12M', votes: 156, accuracy: '94%', comments: 8 },
        team: [
            { name: 'Siddharth Banerjee', avatar: 'SB', avatarColor: '#ab47bc' },
            { name: 'Priya Desai', avatar: 'PD', avatarColor: '#ef5350' }
        ],
        impact: 'Medium',
        approvalStatus: 'Pending'
    },
    {
        id: 'CH-005',
        title: 'Digital Twin – Factory Floor',
        description: 'Real-time 3D simulation of production lines for throughput optimization. Appreciated by leadership for cutting simulation costs by 70%.',
        stage: 'POC & Pilot',
        accentColor: 'teal',
        owner: { name: 'R. Patel', avatar: 'RP', avatarColor: '#e8a758' },
        tags: ['Most Appreciated'],
        stats: { appreciations: 118, savings: '70%', comments: 42, active: 3, alerts: 12 },
        team: [
            { name: 'Ravi Patel', avatar: 'RP', avatarColor: '#e8a758' },
            { name: 'Amit Basu', avatar: 'AB', avatarColor: '#42a5f5' },
            { name: 'Sutanu Roy', avatar: 'SR', avatarColor: '#66bb6a' }
        ],
        impact: 'Critical',
        approvalStatus: 'Pending'
    }
];

export const MOCK_PENDING_REGISTRATIONS = [
    {
        id: 'pr-1',
        name: 'Kavita Rao',
        email: 'kavita.rao@tcs.com',
        role: 'Contributor',
        avatar: 'KR',
        opco: 'TCS Digital',
        submittedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'pr-2',
        name: 'Rajesh Kumar',
        email: 'rajesh.kumar@tcs.com',
        role: 'Innovation Lead',
        avatar: 'RK',
        opco: 'TCS iON',
        submittedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'pr-3',
        name: 'Deepa Nair',
        email: 'deepa.nair@tcs.com',
        role: 'AI / ML Engineer',
        avatar: 'DN',
        opco: 'TCS Research',
        submittedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    }
];

export const MOCK_PENDING_IDEAS: any[] = [
    {
        id: 'IDEA-P1',
        title: 'Smart Contract Audit Automation',
        description: 'Leverage LLMs to automatically audit smart contracts for common vulnerabilities and gas optimisation opportunities.',
        owner: { name: 'Meera Singh', avatar: 'MS', avatarColor: '#42a5f5' },
        linkedChallenge: { id: 'CH-003', title: 'Smart Warehouse Routing' },
        status: 'In Review',
        approvalStatus: 'Pending' as const,
        impactLevel: 'High',
        stats: { appreciations: 12, comments: 3, views: 45 },
        submittedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'IDEA-P2',
        title: 'Voice-Activated Inventory Check',
        description: 'Allow warehouse staff to query inventory levels via voice commands, reducing manual lookup time by 60%.',
        owner: { name: 'Rohan Patel', avatar: 'RP', avatarColor: '#66bb6a' },
        linkedChallenge: { id: 'CH-003', title: 'Smart Warehouse Routing' },
        status: 'Pending',
        approvalStatus: 'Pending' as const,
        impactLevel: 'Medium',
        stats: { appreciations: 8, comments: 1, views: 22 },
        submittedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: '1',
        type: 'challenge',
        title: 'New Challenge Submitted',
        text: 'Ravi Patel submitted "Optimize Cloud Infrastructure Costs"',
        time: '5 minutes ago',
        unread: true,
        link: '/challenges/CH-001'
    },
    {
        id: '2',
        type: 'idea',
        title: 'New Idea Submitted',
        text: 'Meera Singh proposed "Gamified Onboarding Flow" on CH-001',
        time: '22 minutes ago',
        unread: true,
        link: '/challenges/CH-001/ideas/ID-0003'
    },
    {
        id: '3',
        type: 'comment',
        title: 'New Comment on Your Idea',
        text: 'Siddharth Banerjee commented on "AI-powered document verification"',
        time: '1 hour ago',
        unread: true,
        link: '/challenges/CH-001/ideas/ID-0003'
    },
    {
        id: '4',
        type: 'status',
        title: 'Challenge Status Updated',
        text: '"Reduce Customer Churn" moved to Ideation stage',
        time: '3 hours ago',
        unread: true,
        link: '/challenges/CH-001'
    },
    {
        id: '5',
        type: 'idea',
        title: 'New Idea Submitted',
        text: 'Ananya Basu proposed "Personalized Tutorial System" on CH-001',
        time: '5 hours ago',
        unread: true,
        link: '/challenges/CH-001/ideas/ID-0003'
    },
    {
        id: '6',
        type: 'challenge',
        title: 'New Challenge Submitted',
        text: 'Priya Desai submitted "Optimize Warehouse Slot Allocation"',
        time: 'Yesterday',
        unread: false,
        link: '/challenges/CH-001'
    },
    {
        id: '7',
        type: 'comment',
        title: 'New Comment',
        text: 'Rohan Patel commented on "Customer Health Dashboard"',
        time: '2 days ago',
        unread: false,
        link: '/challenges/CH-001/ideas/ID-0003'
    },
    {
        id: '8',
        type: 'status',
        title: 'Idea Status Updated',
        text: '"Voice-Driven Order Entry" moved to Ideation',
        time: '3 days ago',
        unread: false,
        link: '/challenges/CH-001'
    },
    {
        id: '9',
        type: 'vote',
        title: 'Your Challenge received a vote',
        text: 'Ananya Basu voted for "Unified Customer 360 Platform"',
        time: 'Just now',
        unread: true,
        link: '/challenges/CH-001'
    },
    {
        id: '10',
        type: 'like',
        title: 'Your Idea received a like',
        text: 'Siddharth Banerjee liked "Personalized Tutorial System"',
        time: '10 minutes ago',
        unread: true,
        link: '/challenges/CH-001/ideas/ID-0003'
    }
];

/* ══ Swim-Lane Cards — 5, 8, 6, 4, 4 distribution ══ */
export const MOCK_SWIMLANES: SwimLaneCard[] = [
    // ── 1. Challenge Submitted  (5 cards) ──
    { id: 'CH-001', title: 'Reduce Customer Churn', description: 'High-value B2B segment losing 8% quarter-over-quarter. Root cause analysis points to delayed support response and lack of proactive engagement.', owner: 'R. Patel', priority: 'High', stage: 'Scaled & Deployed', type: 'standard' },
    { id: 'CH-002', title: 'Automate Invoice Reconciliation', description: 'Finance team spends 200+ person-hours monthly on manual three-way matching between POs, GRNs, and invoices across 14 vendor systems.', owner: 'M. Singh', priority: 'Medium', stage: 'POC & Pilot', type: 'standard' },
    { id: 'CH-003', title: 'Improve Warehouse Throughput', description: 'Dock gate bottleneck causing 6-hour average shipping delays. Peak season amplifies the problem with 40% capacity overflow.', owner: 'A. Basu', priority: 'High', stage: 'Ideation & Evaluation', type: 'standard' },
    { id: 'CH-004', title: 'Optimize Cloud Infra Costs', description: 'Cloud spend grew 35% YoY while compute utilisation sits at only 42%. Idle resources and over-provisioned instances need right-sizing.', owner: 'S. Banerjee', priority: 'Medium', stage: 'Challenge Submitted', type: 'standard' },
    { id: 'CH-005', title: 'Reduce Employee Attrition', description: 'Tech talent turnover reached 22% annually. Exit interviews highlight limited growth paths and outdated tooling as top reasons.', owner: 'D. Ghosh', priority: 'High', stage: 'POC & Pilot', type: 'standard' },

    // ── 2. Ideation & Evaluation  (8 cards) ──
    { id: 'ID-0001', title: 'AI Churn Prediction Model', description: 'Gradient-boosted ML model leveraging 40+ behavioural signals — login frequency, ticket sentiment, usage drop-off — to flag at-risk accounts 30 days early.', owner: 'S. Banerjee', priority: 'Medium', stage: 'Ideation & Evaluation', type: 'standard' },
    { id: 'ID-0002', title: 'Smart Invoice OCR', description: 'Document AI pipeline combining layout-aware OCR with entity extraction to auto-match line items to purchase orders with 94% accuracy.', owner: 'A. Basu', priority: 'Low', stage: 'Ideation & Evaluation', type: 'standard' },
    { id: 'ID-0003', title: 'Dynamic Slot Allocation', description: 'Real-time warehouse bay assignment engine using demand forecast + vehicle ETA to pre-allocate loading docks and cut idle time by 28%.', owner: 'R. Patel', priority: 'Medium', stage: 'Ideation & Evaluation', type: 'standard' },
    { id: 'ID-0004', title: 'Gamified Onboarding', description: 'Interactive tutorial system with achievement badges and progress tracking, designed to reduce new-user time-to-value from 14 days to 3.', owner: 'M. Singh', priority: 'Low', stage: 'Ideation & Evaluation', type: 'standard' },
    { id: 'EV-01', title: 'Personalised Retention Offers', description: 'Context-aware discount engine combining purchase history, browsing patterns, and churn risk score to generate tailored offers with 3x conversion lift.', owner: 'S. Banerjee', priority: 'Medium', stage: 'Ideation & Evaluation', type: 'standard' },
    { id: 'EV-02', title: 'Robotic Picking Arms', description: 'Feasibility study for collaborative robotic arms handling high-shelf inventory picks. Initial simulations show 60% reduction in manual reach tasks.', owner: 'A. Basu', priority: 'High', stage: 'Ideation & Evaluation', type: 'standard' },
    { id: 'EV-03', title: 'Voice-Based Order Entry', description: 'NLP-powered hands-free order capture for warehouse floor staff, supporting multi-language commands and reducing data entry errors by 45%.', owner: 'R. Patel', priority: 'Low', stage: 'Ideation & Evaluation', type: 'standard' },
    { id: 'EV-04', title: 'Sentiment Analysis Dashboard', description: 'Real-time CSAT and NPS tracker aggregating feedback from social media, support tickets, and app reviews into a unified executive dashboard.', owner: 'D. Ghosh', priority: 'Medium', stage: 'Ideation & Evaluation', type: 'standard' },

    // ── 3. POC & Pilot  (6 cards) ──
    { id: 'POC-01', title: 'AI Churn Prediction – v0.3', description: 'Validated prototype against 12 months of historical data. Achieved 87% recall and 0.91 AUC on hold-out set. Ready for controlled A/B pilot.', owner: 'S. Banerjee', priority: 'Medium', stage: 'POC & Pilot', type: 'standard' },
    { id: 'POC-02', title: 'Invoice OCR Engine', description: 'Document AI pipeline MVP processing 500 invoices/day in sandbox. Accuracy at 94.2% with human-in-the-loop fallback for low-confidence extractions.', owner: 'A. Basu', priority: 'Medium', stage: 'POC & Pilot', type: 'standard' },
    { id: 'PLT-01', title: 'Smart Warehouse Routing', description: 'Live pilot in Kolkata distribution centre with 8 autonomous forklifts. Pick-time reduced 38% in first two weeks of operation.', owner: 'R. Patel', priority: 'Low', stage: 'POC & Pilot', type: 'standard' },
    { id: 'PLT-02', title: 'Digital Twin – Factory', description: 'Real-time 3D simulation of Plant #4 production line. Detecting throughput bottlenecks 2 hours before they impact output.', owner: 'A. Basu', priority: 'Medium', stage: 'POC & Pilot', type: 'standard' },
    { id: 'PLT-03', title: 'Conversational Commerce Bot', description: 'GenAI shopping assistant live on 2 retail partner sites. Handling 12K daily queries with 78% resolution rate and 4.2★ user satisfaction.', owner: 'M. Singh', priority: 'High', stage: 'POC & Pilot', type: 'standard' },
    { id: 'PLT-04', title: 'Energy Consumption Optimizer', description: 'IoT-driven HVAC scheduling pilot across 3 office buildings. Early results show 18% energy savings and improved occupant comfort scores.', owner: 'D. Ghosh', priority: 'Low', stage: 'POC & Pilot', type: 'standard' },

    // ── 4. Deployed  (4 cards) ──
    { id: 'PRD-01', title: 'Unified Customer 360', description: 'Consolidated CRM, billing, and support data into a single customer view. Live in 12 global markets, driving $4.2M annual savings in support costs.', owner: 'S. Banerjee', priority: 'Low', stage: 'Scaled & Deployed', type: 'standard' },
    { id: 'PRD-02', title: 'Predictive Maintenance', description: 'ML-powered anomaly detection deployed across 6 manufacturing plants monitoring 10K+ IoT sensors. Prevented 23 unplanned outages last quarter.', owner: 'A. Basu', priority: 'Low', stage: 'Scaled & Deployed', type: 'standard' },
    { id: 'PRD-03', title: 'Smart Shelf Replenishment', description: 'Computer vision + weight-sensor system auto-generating restock alerts. Operational in 450+ retail stores, reducing stockouts by 31%.', owner: 'R. Patel', priority: 'Low', stage: 'Scaled & Deployed', type: 'standard' },
    { id: 'PRD-04', title: 'Automated Quality Inspection', description: 'High-speed camera + deep learning QA system inspecting 1,200 units/hour on 3 production lines. Defect escape rate dropped from 2.1% to 0.3%.', owner: 'D. Ghosh', priority: 'Low', stage: 'Scaled & Deployed', type: 'standard' },

    // ── 5. Parking Lot  (4 cards) ──
    { id: 'PK-01', title: 'AR Field Service', description: 'Augmented reality guided repairs for on-site technicians. Paused pending availability of enterprise AR headsets from vendor.', owner: 'M. Singh', priority: 'Low', stage: 'Parking Lot', type: 'standard' },
    { id: 'PK-02', title: 'Drone Inventory Scan', description: 'Autonomous drone-based cycle counting for high-bay warehouses. On hold while regulatory approval for indoor drone ops is finalized.', owner: 'R. Patel', priority: 'Low', stage: 'Parking Lot', type: 'standard' },
    { id: 'PK-03', title: 'Blockchain Traceability', description: 'Distributed ledger for end-to-end supply chain provenance. Deferred as finance team reviews cost-benefit versus existing EDI integrations.', owner: 'S. Banerjee', priority: 'Low', stage: 'Parking Lot', type: 'standard' },
    { id: 'PK-04', title: 'Autonomous Delivery Vehicles', description: 'Self-driving last-mile delivery pods for urban zones. Waiting for municipal operating permits and updated insurance framework.', owner: 'A. Basu', priority: 'Low', stage: 'Parking Lot', type: 'standard' },
];

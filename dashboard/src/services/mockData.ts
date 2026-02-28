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
        "id": "u-admin",
        "name": "Sutanu Banerjee",
        "email": "admin@ananta.com",
        "role": "ADMIN",
        "avatar": "SB"
    },
    {
        "id": "u-dibyendu",
        "name": "Dibyendu Das",
        "email": "dibyendu@ananta.com",
        "role": "Member",
        "avatar": "DD"
    },
    {
        "id": "u-asmit",
        "name": "Asmit Basu",
        "email": "asmit@ananta.com",
        "role": "Member",
        "avatar": "AB"
    },
    {
        "id": "u-smriti",
        "name": "Smriti Kumar",
        "email": "smriti@ananta.com",
        "role": "Member",
        "avatar": "SK"
    },
    {
        "id": "u-indrani",
        "name": "Indrani Ghosh",
        "email": "indrani@ananta.com",
        "role": "Member",
        "avatar": "IG"
    },
    {
        "id": "u-nur",
        "name": "Nur Islam",
        "email": "nur@ananta.com",
        "role": "Member",
        "avatar": "NI"
    },
    {
        "id": "u-pragya",
        "name": "Pragya Bharati",
        "email": "pragya@ananta.com",
        "role": "Member",
        "avatar": "PB"
    },
    {
        "id": "u-rohan",
        "name": "Rohan Mondal",
        "email": "rohan@ananta.com",
        "role": "Member",
        "avatar": "RM"
    },
    {
        "id": "u-pritam",
        "name": "Pritam Ghatak",
        "email": "pritam@ananta.com",
        "role": "Member",
        "avatar": "PG"
    },
    {
        "id": "u-riyal",
        "name": "Riyal Guha",
        "email": "riyal@ananta.com",
        "role": "Member",
        "avatar": "RG"
    },
    {
        "id": "u-deb",
        "name": "Debdarsan Roy",
        "email": "deb@ananta.com",
        "role": "Member",
        "avatar": "DR"
    },
    {
        "id": "u-user1",
        "name": "Arjun Sharma",
        "email": "arjun.sharma@example.com",
        "role": "USER",
        "avatar": "AS"
    },
    {
        "id": "u-user2",
        "name": "Ishita Verma",
        "email": "ishita.verma@example.com",
        "role": "USER",
        "avatar": "IV"
    },
    {
        "id": "u-user3",
        "name": "Kabir Malhotra",
        "email": "kabir.malhotra@example.com",
        "role": "USER",
        "avatar": "KM"
    },
    {
        "id": "u-user4",
        "name": "Deepika Iyer",
        "email": "deepika.iyer@example.com",
        "role": "USER",
        "avatar": "DI"
    },
    {
        "id": "u-user5",
        "name": "Aditya Rao",
        "email": "aditya.rao@example.com",
        "role": "USER",
        "avatar": "AR"
    },
    {
        "id": "u-user6",
        "name": "Sanya Gupta",
        "email": "sanya.gupta@example.com",
        "role": "USER",
        "avatar": "SG"
    },
    {
        "id": "u-user7",
        "name": "Vikram Singh",
        "email": "vikram.singh@example.com",
        "role": "USER",
        "avatar": "VS"
    },
    {
        "id": "u-user8",
        "name": "Ananya Reddy",
        "email": "ananya.reddy@example.com",
        "role": "USER",
        "avatar": "AR"
    },
    {
        "id": "u-user9",
        "name": "Varun Joshi",
        "email": "varun.joshi@example.com",
        "role": "USER",
        "avatar": "RJ"
    },
    {
        "id": "u-user10",
        "name": "Pooja Hegde",
        "email": "pooja.hegde@example.com",
        "role": "USER",
        "avatar": "PH"
    },
    {
        "id": "u-chandan",
        "name": "Chandan Kumar",
        "email": "chandan.kumar@example.com",
        "role": "MEMBER",
        "avatar": "CK"
    }
];

export const MOCK_CHALLENGES: Challenge[] = [
    {
        "id": "CH-001",
        "title": "Aham.ai",
        "description": "Due to varied and constantly evolving reporting needs from the Ad Tech team, relying on manual SQL querying and static dashboards is no longer viable. There is a strong need to create an AI-backed dynamic SQL query generator and a set of runtime dashboards to support ad-hoc analytics without enginee...",
        "stage": "POC & Pilot",
        "owner": {
            "name": "Asmit Basu",
            "avatar": "AB",
            "avatarColor": "var(--accent-teal)"
        },
        "accentColor": "teal",
        "stats": {
            "appreciations": 41,
            "comments": 4
        },
        "summary": "Implement an AI-backed dynamic SQL query generator and a set of runtime dashboards to support ad-hoc analytics.",
        "tags": [
            "GenAI",
            "SQL",
            "AdTech"
        ],
        "team": [
            {
                "name": "Asmit Basu",
                "avatar": "AB",
                "avatarColor": "var(--accent-teal)"
            }
        ],
        "impact": "High",
        "approvalStatus": "Approved"
    },
    {
        "id": "CH-002",
        "title": "Party Planner",
        "description": "Planning a party involves complex logistics, and miscalculating attendee consumption often results in a significant amount of food waste the next day. There is currently no intelligent mechanism to optimize food and drink orders beforehand or to repurpose leftovers effectively after the event.",
        "stage": "Parking Lot",
        "owner": {
            "name": "Asmit Basu",
            "avatar": "AB",
            "avatarColor": "var(--accent-blue)"
        },
        "accentColor": "blue",
        "stats": {
            "appreciations": 20,
            "comments": 14
        },
        "summary": "Develop an intelligent, agent-based party planning optimizer to optimize food orders and reduce post-event waste.",
        "tags": [
            "AI Agents",
            "Azure AI",
            "Vision"
        ],
        "team": [
            {
                "name": "Asmit Basu",
                "avatar": "AB",
                "avatarColor": "var(--accent-blue)"
            }
        ],
        "impact": "High",
        "approvalStatus": "Approved"
    },
    {
        "id": "CH-003",
        "title": "Pallas Data Insights",
        "description": "The current data fulfillment process is heavily manual, leading to delays and inefficiencies. Requests depend entirely on the IT team, causing multiple back-and-forth iterations before completion. Access to data and its related attributes is limited, restricting insights and slowing decision-making....",
        "stage": "POC & Pilot",
        "owner": {
            "name": "Pritam Ghatak",
            "avatar": "PG",
            "avatarColor": "var(--accent-green)"
        },
        "accentColor": "green",
        "stats": {
            "appreciations": 10,
            "comments": 16
        },
        "summary": "Implement a GenAI-based autonomous Co-Pilot to streamline data fulfillment and reduce engineering dependency.",
        "tags": [
            "GenAI",
            "Data Insights",
            "Azure"
        ],
        "team": [
            {
                "name": "Pritam Ghatak",
                "avatar": "PG",
                "avatarColor": "var(--accent-green)"
            }
        ],
        "impact": "High",
        "approvalStatus": "Approved"
    },
    {
        "id": "CH-004",
        "title": "Ops Copilot AI Agent",
        "description": "Our IT support and engineering teams lose significant time on repetitive troubleshooting tasks and navigating scattered knowledge sources. This leads to inconsistent issue resolutions, high dependency on subject matter experts, and an elevated L3 Mean Time To Resolve (MTTR) of 1.3 days, ultimately d...",
        "stage": "POC & Pilot",
        "owner": {
            "name": "Indrani Ghosh",
            "avatar": "IG",
            "avatarColor": "var(--accent-orange)"
        },
        "accentColor": "orange",
        "stats": {
            "appreciations": 10,
            "comments": 13
        },
        "summary": "Deploy an AI assistant chatbot to centralize troubleshooting knowledge and significantly reduce L3 MTTR.",
        "tags": [
            "AIOps",
            "Automation",
            "LLM"
        ],
        "team": [
            {
                "name": "Indrani Ghosh",
                "avatar": "IG",
                "avatarColor": "var(--accent-orange)"
            }
        ],
        "impact": "High",
        "approvalStatus": "Approved"
    },
    {
        "id": "CH-005",
        "title": "Sponsored Products Agent",
        "description": "Sponsored Product Campaign management is currently performed entirely via complex UIs, making it a lengthy and error-prone process for advertisers. Setting up, modifying, and tracking campaigns requires multiple manual steps that deter advertisers from scaling their efforts.",
        "stage": "POC & Pilot",
        "owner": {
            "name": "Asmit Basu",
            "avatar": "AB",
            "avatarColor": "var(--accent-purple)"
        },
        "accentColor": "purple",
        "stats": {
            "appreciations": 7,
            "comments": 18
        },
        "summary": "Create an intuitive AI Voice Assistant for advertisers to seamlessly manage campaigns and fetch analytics reports.",
        "tags": [
            "Agents",
            "LlamaIndex",
            "MCP"
        ],
        "team": [
            {
                "name": "Asmit Basu",
                "avatar": "AB",
                "avatarColor": "var(--accent-purple)"
            }
        ],
        "impact": "High",
        "approvalStatus": "Approved"
    },
    {
        "id": "CH-006",
        "title": "AH360",
        "description": "Distribution Centre operations lack a unified, real-time view that connects business processes with their underlying technology services and applications. Without clear observability into how technical components support operational workflows, it becomes difficult to quickly identify root causes, as...",
        "stage": "POC & Pilot",
        "owner": {
            "name": "Pragya Bharati",
            "avatar": "PB",
            "avatarColor": "var(--accent-pink)"
        },
        "accentColor": "pink",
        "stats": {
            "appreciations": 7,
            "comments": 16
        },
        "summary": "Deliver an end-to-end Chain Observability solution mapping business processes to microservices for faster issue resolution.",
        "tags": [
            "Observability",
            "Conversational AI",
            "Retail"
        ],
        "team": [
            {
                "name": "Pragya Bharati",
                "avatar": "PB",
                "avatarColor": "var(--accent-pink)"
            }
        ],
        "impact": "High",
        "approvalStatus": "Approved"
    },
    {
        "id": "CH-007",
        "title": "Myguru.ai",
        "description": "The organization faces severe knowledge management challenges that limit scalability. Critical expertise is concentrated among a few Subject Matter Experts (SMEs), creating bottlenecks and single points of failure. Onboarding new developers is inefficient as information is scattered across Confluenc...",
        "stage": "POC & Pilot",
        "owner": {
            "name": "Dibyendu Das",
            "avatar": "DD",
            "avatarColor": "var(--accent-teal)"
        },
        "accentColor": "teal",
        "stats": {
            "appreciations": 2,
            "comments": 14
        },
        "summary": "Launch an AI-powered knowledge hub to provide instant, source-cited answers to developer queries.",
        "tags": [
            "Knowledge Base",
            "Semantic Search",
            "RAG"
        ],
        "team": [
            {
                "name": "Dibyendu Das",
                "avatar": "DD",
                "avatarColor": "var(--accent-teal)"
            }
        ],
        "impact": "High",
        "approvalStatus": "Approved"
    },
    {
        "id": "CH-008",
        "title": "Agentic PromoPilot",
        "description": "Promotion item inclusion and exclusion lists are heavily maintained through manual spreadsheet processes and outdated legacy rules. This leads to frequent errors, financial losses from incorrect discounts, missed eligible items, and inconsistent execution that heavily impacts overall profitability a...",
        "stage": "Ideation & Evaluation",
        "owner": {
            "name": "Smriti Kumar",
            "avatar": "SK",
            "avatarColor": "var(--accent-blue)"
        },
        "accentColor": "blue",
        "stats": {
            "appreciations": 7,
            "comments": 19
        },
        "summary": "Automate the generation and maintenance of promotion rules using AI to ensure error-free pricing execution.",
        "tags": [
            "Retail",
            "Pricing",
            "AI Rules"
        ],
        "team": [
            {
                "name": "Smriti Kumar",
                "avatar": "SK",
                "avatarColor": "var(--accent-blue)"
            }
        ],
        "impact": "High",
        "approvalStatus": "Approved"
    },
    {
        "id": "CH-009",
        "title": "Text-To-Action",
        "description": "Traditional Robotic Process Automation (RPA) development within our ecosystem is time-consuming, requires specialized engineering skills, and lacks the agility needed for rapid automation of simple web-based tasks. This slows down our modernization efforts and leaves many manual tasks unautomated.",
        "stage": "Scaled & Deployed",
        "owner": {
            "name": "Smriti Kumar",
            "avatar": "SK",
            "avatarColor": "var(--accent-green)"
        },
        "accentColor": "green",
        "stats": {
            "appreciations": 49,
            "comments": 16
        },
        "summary": "Empower business users to automate repetitive web-based tasks using intuitive natural language prompts via AI-enhanced RPA.",
        "tags": [
            "RPA",
            "Low Code",
            "Azure OpenAI"
        ],
        "team": [
            {
                "name": "Smriti Kumar",
                "avatar": "SK",
                "avatarColor": "var(--accent-green)"
            }
        ],
        "impact": "High",
        "approvalStatus": "Approved"
    },
    {
        "id": "CH-010",
        "title": "Terraform to AVM Migration",
        "description": "Ahold Delhaize manages over 8,000 Terraform repositories across various OpCos, creating massive governance, standardization, and cost-control challenges. Without a structured migration to Azure Verified Modules (AVM), we suffer from tech debt, security inconsistencies, and operational bloat.",
        "stage": "Scaled & Deployed",
        "owner": {
            "name": "Dibyendu Das",
            "avatar": "DD",
            "avatarColor": "var(--accent-orange)"
        },
        "accentColor": "orange",
        "stats": {
            "appreciations": 31,
            "comments": 19
        },
        "summary": "Autonomously migrate thousands of Terraform repositories to standardized Azure AVM configurations using an AI agent.",
        "tags": [
            "Terraform",
            "AVM",
            "Infrastructure"
        ],
        "team": [
            {
                "name": "Dibyendu Das",
                "avatar": "DD",
                "avatarColor": "var(--accent-orange)"
            }
        ],
        "impact": "High",
        "approvalStatus": "Approved"
    },
    {
        "id": "CH-011",
        "title": "Argus Observability Platform",
        "description": "The lack of a unified observability platform limits our ability to proactively monitor technical, operational, and business KPIs. This reduces our situational awareness, increasing the risk of major undetected outages and negatively impacting both internal operations and the end-customer experience.",
        "stage": "Scaled & Deployed",
        "owner": {
            "name": "Dibyendu Das",
            "avatar": "DD",
            "avatarColor": "var(--accent-purple)"
        },
        "accentColor": "purple",
        "stats": {
            "appreciations": 32,
            "comments": 5
        },
        "summary": "Establish a centralized observability platform to proactively monitor technical and business KPIs and improve resilience.",
        "tags": [
            "Grafana",
            "KPIs",
            "Observability"
        ],
        "team": [
            {
                "name": "Dibyendu Das",
                "avatar": "DD",
                "avatarColor": "var(--accent-purple)"
            }
        ],
        "impact": "High",
        "approvalStatus": "Approved"
    },
    {
        "id": "CH-012",
        "title": "SR Automation",
        "description": "Service request handling in the identity and access provisioning area remains highly manual and time-intensive. Engineers frequently execute repetitive bash and PowerShell scripts, leading to a higher MTTR, human errors, and a frustrating, inconsistent onboarding experience for new employees.",
        "stage": "Scaled & Deployed",
        "owner": {
            "name": "Dibyendu Das",
            "avatar": "DD",
            "avatarColor": "var(--accent-pink)"
        },
        "accentColor": "pink",
        "stats": {
            "appreciations": 33,
            "comments": 19
        },
        "summary": "Fully automate access provisioning service requests using self-serve portals backed by intelligent scripting.",
        "tags": [
            "PowerShell",
            "Automation",
            "IAM"
        ],
        "team": [
            {
                "name": "Dibyendu Das",
                "avatar": "DD",
                "avatarColor": "var(--accent-pink)"
            }
        ],
        "impact": "High",
        "approvalStatus": "Approved"
    },
    {
        "id": "CH-013",
        "title": "AI-Driven Test Design Automation",
        "description": "Test case creation is largely manual, time-consuming, and heavily dependent on individual QA expertise. This results in inconsistent test coverage and delayed software delivery cycles. There is limited alignment between Jira user stories, Figma UX designs, and the resulting QA artifacts.",
        "stage": "Scaled & Deployed",
        "owner": {
            "name": "Chandan Kumar",
            "avatar": "CK",
            "avatarColor": "var(--accent-teal)"
        },
        "accentColor": "teal",
        "stats": {
            "appreciations": 40,
            "comments": 0
        },
        "summary": "Accelerate QA delivery by introducing an AI tool that automatically generates high-quality test cases directly in Jira.",
        "tags": [
            "QA Automation",
            "GPT-4",
            "Jira"
        ],
        "team": [
            {
                "name": "Chandan Kumar",
                "avatar": "CK",
                "avatarColor": "var(--accent-teal)"
            }
        ],
        "impact": "High",
        "approvalStatus": "Approved"
    },
    {
        "id": "CH-014",
        "title": "JIRA Sprint Planning Assistant",
        "description": "Agile Sprint planning is currently repetitive and manual, requiring Scrum Masters to constantly coordinate prioritized epics, user stories, dependencies, and team availability. Matching the correct team members' skills to complicated user story requirements is particularly challenging and often lead...",
        "stage": "Challenge Submitted",
        "owner": {
            "name": "Chandan Kumar",
            "avatar": "CK",
            "avatarColor": "var(--accent-blue)"
        },
        "accentColor": "blue",
        "stats": {
            "appreciations": 26,
            "comments": 16
        },
        "summary": "Automate and optimize the agile sprint planning lifecycle using AI to pull user stories and assign tasks based on skills.",
        "tags": [
            "Agile",
            "Sprint Planning",
            "AI Assistant"
        ],
        "team": [
            {
                "name": "Chandan Kumar",
                "avatar": "CK",
                "avatarColor": "var(--accent-blue)"
            }
        ],
        "impact": "High",
        "approvalStatus": "Approved"
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
        link: '/challenges/ch-001'
    },
    {
        id: '2',
        type: 'idea',
        title: 'New Idea Submitted',
        text: 'Meera Singh proposed "Gamified Onboarding Flow" on CH-001',
        time: '22 minutes ago',
        unread: true,
        link: '/challenges/ch-001/ideas/id-0003'
    },
    {
        id: '3',
        type: 'comment',
        title: 'New Comment on Your Idea',
        text: 'Siddharth Banerjee commented on "AI-powered document verification"',
        time: '1 hour ago',
        unread: true,
        link: '/challenges/ch-001/ideas/id-0003'
    },
    {
        id: '4',
        type: 'status',
        title: 'Challenge Status Updated',
        text: '"Reduce Customer Churn" moved to Ideation stage',
        time: '3 hours ago',
        unread: true,
        link: '/challenges/ch-001'
    },
    {
        id: '5',
        type: 'idea',
        title: 'New Idea Submitted',
        text: 'Ananya Basu proposed "Personalized Tutorial System" on CH-001',
        time: '5 hours ago',
        unread: true,
        link: '/challenges/ch-001/ideas/id-0003'
    },
    {
        id: '6',
        type: 'challenge',
        title: 'New Challenge Submitted',
        text: 'Priya Desai submitted "Optimize Warehouse Slot Allocation"',
        time: 'Yesterday',
        unread: false,
        link: '/challenges/ch-001'
    },
    {
        id: '7',
        type: 'comment',
        title: 'New Comment',
        text: 'Rohan Patel commented on "Customer Health Dashboard"',
        time: '2 days ago',
        unread: false,
        link: '/challenges/ch-001/ideas/id-0003'
    },
    {
        id: '8',
        type: 'status',
        title: 'Idea Status Updated',
        text: '"Voice-Driven Order Entry" moved to Ideation',
        time: '3 days ago',
        unread: false,
        link: '/challenges/ch-001'
    },
    {
        id: '9',
        type: 'vote',
        title: 'Your Challenge received a vote',
        text: 'Ananya Basu voted for "Unified Customer 360 Platform"',
        time: 'Just now',
        unread: true,
        link: '/challenges/ch-001'
    },
    {
        id: '10',
        type: 'like',
        title: 'Your Idea received a like',
        text: 'Siddharth Banerjee liked "Personalized Tutorial System"',
        time: '10 minutes ago',
        unread: true,
        link: '/challenges/ch-001/ideas/id-0003'
    }
];

export const MOCK_SWIMLANES: SwimLaneCard[] = [
    {
        "id": "CH-001",
        "title": "Aham.ai",
        "description": "Due to varied and constantly evolving reporting needs from the Ad Tech team, relying on manual SQL querying and static dashboards is no longer viable. There is a strong need to create an AI-backed dyn...",
        "owner": "Asmit Basu",
        "priority": "High",
        "stage": "POC & Pilot",
        "type": "standard"
    },
    {
        "id": "CH-002",
        "title": "Party Planner",
        "description": "Planning a party involves complex logistics, and miscalculating attendee consumption often results in a significant amount of food waste the next day. There is currently no intelligent mechanism to op...",
        "owner": "Asmit Basu",
        "priority": "High",
        "stage": "Parking Lot",
        "type": "standard"
    },
    {
        "id": "CH-003",
        "title": "Pallas Data Insights",
        "description": "The current data fulfillment process is heavily manual, leading to delays and inefficiencies. Requests depend entirely on the IT team, causing multiple back-and-forth iterations before completion. Acc...",
        "owner": "Pritam Ghatak",
        "priority": "High",
        "stage": "POC & Pilot",
        "type": "standard"
    },
    {
        "id": "CH-004",
        "title": "Ops Copilot AI Agent",
        "description": "Our IT support and engineering teams lose significant time on repetitive troubleshooting tasks and navigating scattered knowledge sources. This leads to inconsistent issue resolutions, high dependency...",
        "owner": "Indrani Ghosh",
        "priority": "High",
        "stage": "POC & Pilot",
        "type": "standard"
    },
    {
        "id": "CH-005",
        "title": "Sponsored Products Agent",
        "description": "Sponsored Product Campaign management is currently performed entirely via complex UIs, making it a lengthy and error-prone process for advertisers. Setting up, modifying, and tracking campaigns requir...",
        "owner": "Asmit Basu",
        "priority": "High",
        "stage": "POC & Pilot",
        "type": "standard"
    },
    {
        "id": "CH-006",
        "title": "AH360",
        "description": "Distribution Centre operations lack a unified, real-time view that connects business processes with their underlying technology services and applications. Without clear observability into how technica...",
        "owner": "Pragya Bharati",
        "priority": "High",
        "stage": "POC & Pilot",
        "type": "standard"
    },
    {
        "id": "CH-007",
        "title": "Myguru.ai",
        "description": "The organization faces severe knowledge management challenges that limit scalability. Critical expertise is concentrated among a few Subject Matter Experts (SMEs), creating bottlenecks and single poin...",
        "owner": "Dibyendu Das",
        "priority": "High",
        "stage": "POC & Pilot",
        "type": "standard"
    },
    {
        "id": "CH-008",
        "title": "Agentic PromoPilot",
        "description": "Promotion item inclusion and exclusion lists are heavily maintained through manual spreadsheet processes and outdated legacy rules. This leads to frequent errors, financial losses from incorrect disco...",
        "owner": "Smriti Kumar",
        "priority": "High",
        "stage": "Ideation & Evaluation",
        "type": "standard"
    },
    {
        "id": "CH-009",
        "title": "Text-To-Action",
        "description": "Traditional Robotic Process Automation (RPA) development within our ecosystem is time-consuming, requires specialized engineering skills, and lacks the agility needed for rapid automation of simple we...",
        "owner": "Smriti Kumar",
        "priority": "High",
        "stage": "Scaled & Deployed",
        "type": "standard"
    },
    {
        "id": "CH-010",
        "title": "Terraform to AVM Migration",
        "description": "Ahold Delhaize manages over 8,000 Terraform repositories across various OpCos, creating massive governance, standardization, and cost-control challenges. Without a structured migration to Azure Verifi...",
        "owner": "Dibyendu Das",
        "priority": "High",
        "stage": "Scaled & Deployed",
        "type": "standard"
    },
    {
        "id": "CH-011",
        "title": "Argus Observability Platform",
        "description": "The lack of a unified observability platform limits our ability to proactively monitor technical, operational, and business KPIs. This reduces our situational awareness, increasing the risk of major u...",
        "owner": "Dibyendu Das",
        "priority": "High",
        "stage": "Scaled & Deployed",
        "type": "standard"
    },
    {
        "id": "CH-012",
        "title": "SR Automation",
        "description": "Service request handling in the identity and access provisioning area remains highly manual and time-intensive. Engineers frequently execute repetitive bash and PowerShell scripts, leading to a higher...",
        "owner": "Dibyendu Das",
        "priority": "High",
        "stage": "Scaled & Deployed",
        "type": "standard"
    },
    {
        "id": "CH-013",
        "title": "AI-Driven Test Design Automation",
        "description": "Test case creation is largely manual, time-consuming, and heavily dependent on individual QA expertise. This results in inconsistent test coverage and delayed software delivery cycles. There is limite...",
        "owner": "Chandan Kumar",
        "priority": "High",
        "stage": "Scaled & Deployed",
        "type": "standard"
    },
    {
        "id": "CH-014",
        "title": "JIRA Sprint Planning Assistant",
        "description": "Agile Sprint planning is currently repetitive and manual, requiring Scrum Masters to constantly coordinate prioritized epics, user stories, dependencies, and team availability. Matching the correct te...",
        "owner": "Chandan Kumar",
        "priority": "High",
        "stage": "Challenge Submitted",
        "type": "standard"
    }
];
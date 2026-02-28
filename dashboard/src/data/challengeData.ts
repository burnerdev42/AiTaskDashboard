import type { ChallengeDetailData, Idea, ChallengeCardData } from '../types';

export const challengeDetails: ChallengeDetailData[] = [
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
            "appreciations": 28,
            "comments": 2,
            "votes": 21
        },
        "tags": [
            "GenAI",
            "SQL",
            "AdTech"
        ],
        "summary": "Implement an AI-backed dynamic SQL query generator and a set of runtime dashboards to support ad-hoc analytics.",
        "problemStatement": "Due to varied and constantly evolving reporting needs from the Ad Tech team, relying on manual SQL querying and static dashboards is no longer viable. There is a strong need to create an AI-backed dynamic SQL query generator and a set of runtime dashboards to support ad-hoc analytics without engineering dependencies.",
        "expectedOutcome": "Implement a comprehensive conversational interface that empowers users to generate dynamic dashboards and complex SQL queries on demand using natural language, reducing IT dependency and accelerating decision-making.",
        "businessUnit": "GSO",
        "department": "Global Platform",
        "priority": "High",
        "estimatedImpact": "TBD",
        "challengeTags": [
            "GenAI",
            "SQL",
            "AdTech"
        ],
        "timeline": "3-6 months",
        "portfolioOption": "Non Strategic Product Management",
        "constraints": "None",
        "stakeholders": "TBD",
        "ideas": [
            {
                "id": "ID-0001",
                "title": "Multi agent dashboard generator",
                "author": "Dibyendu Das",
                "status": "Accepted",
                "appreciations": 19,
                "comments": 2,
                "views": 46
            }
        ],
        "team": [
            {
                "name": "Asmit Basu",
                "avatar": "AB",
                "avatarColor": "var(--accent-teal)",
                "role": "Owner"
            }
        ],
        "activity": [],
        "createdDate": "Jan 15, 2026",
        "updatedDate": "Feb 10, 2026",
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
            "appreciations": 22,
            "comments": 16,
            "votes": 88
        },
        "tags": [
            "AI Agents",
            "Azure AI",
            "Vision"
        ],
        "summary": "Develop an intelligent, agent-based party planning optimizer to optimize food orders and reduce post-event waste.",
        "problemStatement": "Planning a party involves complex logistics, and miscalculating attendee consumption often results in a significant amount of food waste the next day. There is currently no intelligent mechanism to optimize food and drink orders beforehand or to repurpose leftovers effectively after the event.",
        "expectedOutcome": "Develop an intelligent, agent-based party planning optimizer that takes simple voice or text inputs to calculate precise food and drink requirements. Post-event, it uses computer vision to analyze leftovers and suggest creative recipes, minimizing waste.",
        "businessUnit": "Albert Heijn",
        "department": "RBP",
        "priority": "High",
        "estimatedImpact": "TBD",
        "challengeTags": [
            "AI Agents",
            "Azure AI",
            "Vision"
        ],
        "timeline": "3-6 months",
        "portfolioOption": "Tech Enabler",
        "constraints": "None",
        "stakeholders": "TBD",
        "ideas": [
            {
                "id": "ID-0002",
                "title": "Agentic party planner optimizer",
                "author": "Riyal Guha",
                "status": "Accepted",
                "appreciations": 15,
                "comments": 2,
                "views": 40
            }
        ],
        "team": [
            {
                "name": "Asmit Basu",
                "avatar": "AB",
                "avatarColor": "var(--accent-blue)",
                "role": "Owner"
            }
        ],
        "activity": [],
        "createdDate": "Jan 15, 2026",
        "updatedDate": "Feb 10, 2026",
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
            "appreciations": 48,
            "comments": 10,
            "votes": 98
        },
        "tags": [
            "GenAI",
            "Data Insights",
            "Azure"
        ],
        "summary": "Implement a GenAI-based autonomous Co-Pilot to streamline data fulfillment and reduce engineering dependency.",
        "problemStatement": "The current data fulfillment process is heavily manual, leading to delays and inefficiencies. Requests depend entirely on the IT team, causing multiple back-and-forth iterations before completion. Access to data and its related attributes is limited, restricting insights and slowing decision-making. Furthermore, the process requires specialized tool knowledge, preventing business users from operating independently.",
        "expectedOutcome": "Implement a GenAI-based, fully autonomous Co-Pilot solution that streamlines data fulfillment by eliminating dependency on specific tools or engineering support. Users will independently access insights through a conversational interface, accelerating turnaround times and enhancing operational agility.",
        "businessUnit": "BecSee",
        "department": "Ecommerce",
        "priority": "High",
        "estimatedImpact": "TBD",
        "challengeTags": [
            "GenAI",
            "Data Insights",
            "Azure"
        ],
        "timeline": "3-6 months",
        "portfolioOption": "Non Strategic Product Management",
        "constraints": "None",
        "stakeholders": "TBD",
        "ideas": [
            {
                "id": "ID-0003",
                "title": "Pallas AI Assistance",
                "author": "Indrani Ghosh",
                "status": "Accepted",
                "appreciations": 16,
                "comments": 2,
                "views": 54
            }
        ],
        "team": [
            {
                "name": "Pritam Ghatak",
                "avatar": "PG",
                "avatarColor": "var(--accent-green)",
                "role": "Owner"
            }
        ],
        "activity": [],
        "createdDate": "Jan 15, 2026",
        "updatedDate": "Feb 10, 2026",
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
            "appreciations": 0,
            "comments": 9,
            "votes": 18
        },
        "tags": [
            "AIOps",
            "Automation",
            "LLM"
        ],
        "summary": "Deploy an AI assistant chatbot to centralize troubleshooting knowledge and significantly reduce L3 MTTR.",
        "problemStatement": "Our IT support and engineering teams lose significant time on repetitive troubleshooting tasks and navigating scattered knowledge sources. This leads to inconsistent issue resolutions, high dependency on subject matter experts, and an elevated L3 Mean Time To Resolve (MTTR) of 1.3 days, ultimately degrading service quality.",
        "expectedOutcome": "Deploy an AI assistant chatbot that centralizes scattered troubleshooting knowledge and system logs. This will dramatically reduce SME dependency, accelerate root cause analysis, and bring the L3 MTTR down significantly, improving overall IT productivity.",
        "businessUnit": "GSO",
        "department": "Global Platform",
        "priority": "High",
        "estimatedImpact": "TBD",
        "challengeTags": [
            "AIOps",
            "Automation",
            "LLM"
        ],
        "timeline": "3-6 months",
        "portfolioOption": "Maintenance",
        "constraints": "None",
        "stakeholders": "TBD",
        "ideas": [
            {
                "id": "ID-0004",
                "title": "Operation Pilot AI Agent",
                "author": "Asmit Basu",
                "status": "Accepted",
                "appreciations": 2,
                "comments": 2,
                "views": 73
            }
        ],
        "team": [
            {
                "name": "Indrani Ghosh",
                "avatar": "IG",
                "avatarColor": "var(--accent-orange)",
                "role": "Owner"
            }
        ],
        "activity": [],
        "createdDate": "Jan 15, 2026",
        "updatedDate": "Feb 10, 2026",
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
            "appreciations": 5,
            "comments": 12,
            "votes": 74
        },
        "tags": [
            "Agents",
            "LlamaIndex",
            "MCP"
        ],
        "summary": "Create an intuitive AI Voice Assistant for advertisers to seamlessly manage campaigns and fetch analytics reports.",
        "problemStatement": "Sponsored Product Campaign management is currently performed entirely via complex UIs, making it a lengthy and error-prone process for advertisers. Setting up, modifying, and tracking campaigns requires multiple manual steps that deter advertisers from scaling their efforts.",
        "expectedOutcome": "Enable advertisers to seamlessly create, update, and manage campaigns, as well as fetch detailed analytics reports, using an intuitive AI Voice Assistant, thereby reducing campaign setup time by over 50%.",
        "businessUnit": "Albert Heijn",
        "department": "RBP",
        "priority": "High",
        "estimatedImpact": "TBD",
        "challengeTags": [
            "Agents",
            "LlamaIndex",
            "MCP"
        ],
        "timeline": "3-6 months",
        "portfolioOption": "Maintenance",
        "constraints": "None",
        "stakeholders": "TBD",
        "ideas": [
            {
                "id": "ID-0005",
                "title": "Multi agent sponsored porducts manager",
                "author": "Pragya Bharati",
                "status": "Accepted",
                "appreciations": 2,
                "comments": 1,
                "views": 75
            }
        ],
        "team": [
            {
                "name": "Asmit Basu",
                "avatar": "AB",
                "avatarColor": "var(--accent-purple)",
                "role": "Owner"
            }
        ],
        "activity": [],
        "createdDate": "Jan 15, 2026",
        "updatedDate": "Feb 10, 2026",
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
            "comments": 13,
            "votes": 33
        },
        "tags": [
            "Observability",
            "Conversational AI",
            "Retail"
        ],
        "summary": "Deliver an end-to-end Chain Observability solution mapping business processes to microservices for faster issue resolution.",
        "problemStatement": "Distribution Centre operations lack a unified, real-time view that connects business processes with their underlying technology services and applications. Without clear observability into how technical components support operational workflows, it becomes difficult to quickly identify root causes, assess impact, and respond to disruptions.",
        "expectedOutcome": "Deliver AH360 as an end-to-end Chain Observability solution. By mapping business processes directly to supporting microservices, the organization will enable faster root-cause analysis, proactive issue resolution, and improved collaboration across Distribution Centre teams.",
        "businessUnit": "BecSee",
        "department": "Ecommerce",
        "priority": "High",
        "estimatedImpact": "TBD",
        "challengeTags": [
            "Observability",
            "Conversational AI",
            "Retail"
        ],
        "timeline": "3-6 months",
        "portfolioOption": "Customer Value Driver",
        "constraints": "None",
        "stakeholders": "TBD",
        "ideas": [
            {
                "id": "ID-0006",
                "title": "AH360 Conversational AI for Operational Impact Visibility",
                "author": "Kabir Malhotra",
                "status": "Accepted",
                "appreciations": 9,
                "comments": 0,
                "views": 88
            }
        ],
        "team": [
            {
                "name": "Pragya Bharati",
                "avatar": "PB",
                "avatarColor": "var(--accent-pink)",
                "role": "Owner"
            }
        ],
        "activity": [],
        "createdDate": "Jan 15, 2026",
        "updatedDate": "Feb 10, 2026",
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
            "appreciations": 34,
            "comments": 0,
            "votes": 32
        },
        "tags": [
            "Knowledge Base",
            "Semantic Search",
            "RAG"
        ],
        "summary": "Launch an AI-powered knowledge hub to provide instant, source-cited answers to developer queries.",
        "problemStatement": "The organization faces severe knowledge management challenges that limit scalability. Critical expertise is concentrated among a few Subject Matter Experts (SMEs), creating bottlenecks and single points of failure. Onboarding new developers is inefficient as information is scattered across Confluence, ServiceNow, and numerous codebases, leading to duplicated efforts and slow ramp-up times.",
        "expectedOutcome": "Launch IGuru as a centralized, AI-powered knowledge hub that provides instant, source-cited answers to developer queries. This will reduce search time, alleviate SME bottlenecks, accelerate new hire onboarding, and establish a single source of truth.",
        "businessUnit": "Albert Heijn",
        "department": "RBP",
        "priority": "High",
        "estimatedImpact": "TBD",
        "challengeTags": [
            "Knowledge Base",
            "Semantic Search",
            "RAG"
        ],
        "timeline": "3-6 months",
        "portfolioOption": "Tech Enabler",
        "constraints": "None",
        "stakeholders": "TBD",
        "ideas": [
            {
                "id": "ID-0007",
                "title": "IGuru: Centralized AI Knowledge Assistant",
                "author": "Aditya Rao",
                "status": "Accepted",
                "appreciations": 19,
                "comments": 0,
                "views": 62
            }
        ],
        "team": [
            {
                "name": "Dibyendu Das",
                "avatar": "DD",
                "avatarColor": "var(--accent-teal)",
                "role": "Owner"
            }
        ],
        "activity": [],
        "createdDate": "Jan 15, 2026",
        "updatedDate": "Feb 10, 2026",
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
            "appreciations": 8,
            "comments": 12,
            "votes": 24
        },
        "tags": [
            "Retail",
            "Pricing",
            "AI Rules"
        ],
        "summary": "Automate the generation and maintenance of promotion rules using AI to ensure error-free pricing execution.",
        "problemStatement": "Promotion item inclusion and exclusion lists are heavily maintained through manual spreadsheet processes and outdated legacy rules. This leads to frequent errors, financial losses from incorrect discounts, missed eligible items, and inconsistent execution that heavily impacts overall profitability and customer trust.",
        "expectedOutcome": "Automate the generation and maintenance of accurate promotion rules using an intelligent AI agent. Retailers will dramatically reduce manual effort, ensure error-free pricing execution, and completely eliminate margin leakage caused by incorrect discounts.",
        "businessUnit": "GSO",
        "department": "Global Platform",
        "priority": "High",
        "estimatedImpact": "TBD",
        "challengeTags": [
            "Retail",
            "Pricing",
            "AI Rules"
        ],
        "timeline": "3-6 months",
        "portfolioOption": "Non Strategic Product Management",
        "constraints": "None",
        "stakeholders": "TBD",
        "ideas": [
            {
                "id": "ID-0008",
                "title": "Agentic Promotion Rules Manager",
                "author": "Smriti Kumar",
                "status": "Accepted",
                "appreciations": 6,
                "comments": 4,
                "views": 67
            }
        ],
        "team": [
            {
                "name": "Smriti Kumar",
                "avatar": "SK",
                "avatarColor": "var(--accent-blue)",
                "role": "Owner"
            }
        ],
        "activity": [],
        "createdDate": "Jan 15, 2026",
        "updatedDate": "Feb 10, 2026",
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
            "appreciations": 39,
            "comments": 2,
            "votes": 25
        },
        "tags": [
            "RPA",
            "Low Code",
            "Azure OpenAI"
        ],
        "summary": "Empower business users to automate repetitive web-based tasks using intuitive natural language prompts via AI-enhanced RPA.",
        "problemStatement": "Traditional Robotic Process Automation (RPA) development within our ecosystem is time-consuming, requires specialized engineering skills, and lacks the agility needed for rapid automation of simple web-based tasks. This slows down our modernization efforts and leaves many manual tasks unautomated.",
        "expectedOutcome": "Empower business users and citizen developers to automate repetitive web-based tasks using intuitive natural language prompts, bypassing traditional RPA bottlenecks and accelerating the organization's modernization journey.",
        "businessUnit": "Albert Heijn",
        "department": "STP",
        "priority": "High",
        "estimatedImpact": "TBD",
        "challengeTags": [
            "RPA",
            "Low Code",
            "Azure OpenAI"
        ],
        "timeline": "3-6 months",
        "portfolioOption": "Tech Enabler",
        "constraints": "None",
        "stakeholders": "TBD",
        "ideas": [
            {
                "id": "ID-0009",
                "title": "GenAI-Powered RPA Framework",
                "author": "Nur Islam",
                "status": "Accepted",
                "appreciations": 18,
                "comments": 4,
                "views": 65
            }
        ],
        "team": [
            {
                "name": "Smriti Kumar",
                "avatar": "SK",
                "avatarColor": "var(--accent-green)",
                "role": "Owner"
            }
        ],
        "activity": [],
        "createdDate": "Jan 15, 2026",
        "updatedDate": "Feb 10, 2026",
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
            "appreciations": 0,
            "comments": 6,
            "votes": 72
        },
        "tags": [
            "Terraform",
            "AVM",
            "Infrastructure"
        ],
        "summary": "Autonomously migrate thousands of Terraform repositories to standardized Azure AVM configurations using an AI agent.",
        "problemStatement": "Ahold Delhaize manages over 8,000 Terraform repositories across various OpCos, creating massive governance, standardization, and cost-control challenges. Without a structured migration to Azure Verified Modules (AVM), we suffer from tech debt, security inconsistencies, and operational bloat.",
        "expectedOutcome": "Successfully and completely migrate all 8,000+ Terraform repositories to standardized Azure AVM configurations within one calendar year. This will vastly improve governance, standardize infrastructure as code, and realize up to  in direct cost savings.",
        "businessUnit": "BecSee",
        "department": "Ecommerce",
        "priority": "High",
        "estimatedImpact": "TBD",
        "challengeTags": [
            "Terraform",
            "AVM",
            "Infrastructure"
        ],
        "timeline": "3-6 months",
        "portfolioOption": "Maintenance",
        "constraints": "None",
        "stakeholders": "TBD",
        "ideas": [
            {
                "id": "ID-0010",
                "title": "Agentic AI–Driven Terraform Migration",
                "author": "Riyal Guha",
                "status": "Accepted",
                "appreciations": 10,
                "comments": 0,
                "views": 85
            }
        ],
        "team": [
            {
                "name": "Dibyendu Das",
                "avatar": "DD",
                "avatarColor": "var(--accent-orange)",
                "role": "Owner"
            }
        ],
        "activity": [],
        "createdDate": "Jan 15, 2026",
        "updatedDate": "Feb 10, 2026",
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
            "appreciations": 29,
            "comments": 18,
            "votes": 89
        },
        "tags": [
            "Grafana",
            "KPIs",
            "Observability"
        ],
        "summary": "Establish a centralized observability platform to proactively monitor technical and business KPIs and improve resilience.",
        "problemStatement": "The lack of a unified observability platform limits our ability to proactively monitor technical, operational, and business KPIs. This reduces our situational awareness, increasing the risk of major undetected outages and negatively impacting both internal operations and the end-customer experience.",
        "expectedOutcome": "Establish Argus as the enterprise-wide centralized observability platform. By proactively monitoring technical and business KPIs, we will preempt incidents, improve system resilience, and deliver a vastly superior customer experience.",
        "businessUnit": "GSO",
        "department": "Analytics",
        "priority": "High",
        "estimatedImpact": "TBD",
        "challengeTags": [
            "Grafana",
            "KPIs",
            "Observability"
        ],
        "timeline": "3-6 months",
        "portfolioOption": "Non Strategic Product Management",
        "constraints": "None",
        "stakeholders": "TBD",
        "ideas": [
            {
                "id": "ID-0011",
                "title": "Enterprise Observability with Grafana",
                "author": "Vikram Singh",
                "status": "Accepted",
                "appreciations": 2,
                "comments": 0,
                "views": 8
            }
        ],
        "team": [
            {
                "name": "Dibyendu Das",
                "avatar": "DD",
                "avatarColor": "var(--accent-purple)",
                "role": "Owner"
            }
        ],
        "activity": [],
        "createdDate": "Jan 15, 2026",
        "updatedDate": "Feb 10, 2026",
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
            "appreciations": 4,
            "comments": 4,
            "votes": 5
        },
        "tags": [
            "PowerShell",
            "Automation",
            "IAM"
        ],
        "summary": "Fully automate access provisioning service requests using self-serve portals backed by intelligent scripting.",
        "problemStatement": "Service request handling in the identity and access provisioning area remains highly manual and time-intensive. Engineers frequently execute repetitive bash and PowerShell scripts, leading to a higher MTTR, human errors, and a frustrating, inconsistent onboarding experience for new employees.",
        "expectedOutcome": "Fully automate access provisioning service requests using self-serve portals backed by intelligent scripting. This will effectively reduce MTTR from days to minutes, ensure zero-defect provisioning, and enhance the overall IT service experience.",
        "businessUnit": "GSO",
        "department": "Global Platform",
        "priority": "High",
        "estimatedImpact": "TBD",
        "challengeTags": [
            "PowerShell",
            "Automation",
            "IAM"
        ],
        "timeline": "3-6 months",
        "portfolioOption": "Non Strategic Product Management",
        "constraints": "None",
        "stakeholders": "TBD",
        "ideas": [
            {
                "id": "ID-0012",
                "title": "Automated Access Provisioning Engine",
                "author": "Rohan Mondal",
                "status": "Accepted",
                "appreciations": 18,
                "comments": 2,
                "views": 10
            }
        ],
        "team": [
            {
                "name": "Dibyendu Das",
                "avatar": "DD",
                "avatarColor": "var(--accent-pink)",
                "role": "Owner"
            }
        ],
        "activity": [],
        "createdDate": "Jan 15, 2026",
        "updatedDate": "Feb 10, 2026",
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
            "appreciations": 31,
            "comments": 3,
            "votes": 23
        },
        "tags": [
            "QA Automation",
            "GPT-4",
            "Jira"
        ],
        "summary": "Accelerate QA delivery by introducing an AI tool that automatically generates high-quality test cases directly in Jira.",
        "problemStatement": "Test case creation is largely manual, time-consuming, and heavily dependent on individual QA expertise. This results in inconsistent test coverage and delayed software delivery cycles. There is limited alignment between Jira user stories, Figma UX designs, and the resulting QA artifacts.",
        "expectedOutcome": "Drastically accelerate QA delivery by introducing an AI tool that automatically generates high-quality, comprehensive test cases directly in Jira by analyzing Jira stories and Figma layouts, boosting coverage and speed.",
        "businessUnit": "BecSee",
        "department": "Ecommerce",
        "priority": "High",
        "estimatedImpact": "TBD",
        "challengeTags": [
            "QA Automation",
            "GPT-4",
            "Jira"
        ],
        "timeline": "3-6 months",
        "portfolioOption": "Maintenance",
        "constraints": "None",
        "stakeholders": "TBD",
        "ideas": [
            {
                "id": "ID-0013",
                "title": "GenAI-Powered Test Case Generator",
                "author": "Pooja Hegde",
                "status": "Accepted",
                "appreciations": 9,
                "comments": 4,
                "views": 25
            }
        ],
        "team": [
            {
                "name": "Chandan Kumar",
                "avatar": "CK",
                "avatarColor": "var(--accent-teal)",
                "role": "Owner"
            }
        ],
        "activity": [],
        "createdDate": "Jan 15, 2026",
        "updatedDate": "Feb 10, 2026",
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
            "appreciations": 22,
            "comments": 12,
            "votes": 93
        },
        "tags": [
            "Agile",
            "Sprint Planning",
            "AI Assistant"
        ],
        "summary": "Automate and optimize the agile sprint planning lifecycle using AI to pull user stories and assign tasks based on skills.",
        "problemStatement": "Agile Sprint planning is currently repetitive and manual, requiring Scrum Masters to constantly coordinate prioritized epics, user stories, dependencies, and team availability. Matching the correct team members' skills to complicated user story requirements is particularly challenging and often leads to suboptimal assignments.",
        "expectedOutcome": "Automate and optimize the sprint planning lifecycle using AI to intelligently pull prioritized user stories, resolve dependencies, define concise sprint goals, and recommend story assignments perfectly matched to the team's current skill sets and capacity.",
        "businessUnit": "Albert Heijn",
        "department": "RBP",
        "priority": "High",
        "estimatedImpact": "TBD",
        "challengeTags": [
            "Agile",
            "Sprint Planning",
            "AI Assistant"
        ],
        "timeline": "3-6 months",
        "portfolioOption": "Customer Value Driver",
        "constraints": "None",
        "stakeholders": "TBD",
        "ideas": [
            {
                "id": "ID-0014",
                "title": "AI-Powered Sprint Planner",
                "author": "Arjun Sharma",
                "status": "Accepted",
                "appreciations": 17,
                "comments": 2,
                "views": 19
            }
        ],
        "team": [
            {
                "name": "Chandan Kumar",
                "avatar": "CK",
                "avatarColor": "var(--accent-blue)",
                "role": "Owner"
            }
        ],
        "activity": [],
        "createdDate": "Jan 15, 2026",
        "updatedDate": "Feb 10, 2026",
        "approvalStatus": "Approved"
    }
];

export const ideaDetails: Idea[] = [
    {
        "id": "ID-0001",
        "title": "Multi agent dashboard generator",
        "description": "This proposal leverages LangChain, SQL database agents, and advanced LLMs to create a Multi-Agent Dashboard Generator. Users describe their data needs in natural language, and the agents intelligently fetch metadata, formulate complex SQL queries against our data warehouse, and construct dynamic visual dashboards—all without manual coding or DB administration involvement.",
        "problemStatement": "Due to varied and constantly evolving reporting needs from the Ad Tech team, relying on manual SQL querying and static dashboards is no longer viable. There is a strong need to create an AI-backed dynamic SQL query generator and a set of runtime dashboards to support ad-hoc analytics without engineering dependencies.",
        "proposedSolution": "Design a Multi-Agent architecture using LangChain, giving agents read-only SQL access and data visualization tools to generate dashboards upon receiving natural language requests.",
        "status": "Accepted",
        "owner": {
            "name": "Dibyendu Das",
            "avatar": "DD",
            "avatarColor": "var(--accent-teal)",
            "role": "Member"
        },
        "linkedChallenge": {
            "id": "CH-001",
            "title": "Aham.ai"
        },
        "tags": [
            "GenAI",
            "SQL",
            "AdTech"
        ],
        "stats": {
            "appreciations": 13,
            "comments": 1,
            "views": 47
        },
        "impactLevel": "Medium",
        "submittedDate": "Feb 01, 2026",
        "lastUpdated": "Feb 15, 2026",
        "approvalStatus": "Approved"
    },
    {
        "id": "ID-0002",
        "title": "Agentic party planner optimizer",
        "description": "The Agentic Party Planner Optimizer utilizes Azure AI Speech-to-Text to capture user requirements seamlessly. A backend LLM orchestrator determines guest counts and dietary restrictions, querying grocery APIs to generate optimized shopping lists. Additionally, a Vision AI module analyzes photographs of post-party leftovers to generate creative, personalized recipes, actively reducing food wastage.",
        "problemStatement": "Planning a party involves complex logistics, and miscalculating attendee consumption often results in a significant amount of food waste the next day. There is currently no intelligent mechanism to optimize food and drink orders beforehand or to repurpose leftovers effectively after the event.",
        "proposedSolution": "Utilize AI planning algorithms and Azure AI voice recognition for pre-party optimization, paired with a Computer Vision recipe generator for post-party food waste reduction.",
        "status": "Accepted",
        "owner": {
            "name": "Riyal Guha",
            "avatar": "RG",
            "avatarColor": "var(--accent-teal)",
            "role": "Member"
        },
        "linkedChallenge": {
            "id": "CH-002",
            "title": "Party Planner"
        },
        "tags": [
            "AI Agents",
            "Azure AI",
            "Vision"
        ],
        "stats": {
            "appreciations": 3,
            "comments": 0,
            "views": 78
        },
        "impactLevel": "Medium",
        "submittedDate": "Feb 01, 2026",
        "lastUpdated": "Feb 15, 2026",
        "approvalStatus": "Approved"
    },
    {
        "id": "ID-0003",
        "title": "Pallas AI Assistance",
        "description": "We will build a React JS Copilot interface hosted on Azure, powered by Dual Agents (GPT-4.5). The Query Agent interprets user prompts and formulates precise database queries. These are securely executed by the independent DB Agent, which returns structured data directly to the user. This decoupled, agentic architecture guarantees accuracy, robust security, and eliminates engineering bottlenecks.",
        "problemStatement": "The current data fulfillment process is heavily manual, leading to delays and inefficiencies. Requests depend entirely on the IT team, causing multiple back-and-forth iterations before completion. Access to data and its related attributes is limited, restricting insights and slowing decision-making. Furthermore, the process requires specialized tool knowledge, preventing business users from operating independently.",
        "proposedSolution": "Deploy an Azure Web App Copilot supported by dedicated AI Query and Database Execution agents, completely separating reasoning layers from data retrieval logic.",
        "status": "Accepted",
        "owner": {
            "name": "Indrani Ghosh",
            "avatar": "IG",
            "avatarColor": "var(--accent-teal)",
            "role": "Member"
        },
        "linkedChallenge": {
            "id": "CH-003",
            "title": "Pallas Data Insights"
        },
        "tags": [
            "GenAI",
            "Data Insights",
            "Azure"
        ],
        "stats": {
            "appreciations": 16,
            "comments": 0,
            "views": 4
        },
        "impactLevel": "Medium",
        "submittedDate": "Feb 01, 2026",
        "lastUpdated": "Feb 15, 2026",
        "approvalStatus": "Approved"
    },
    {
        "id": "ID-0004",
        "title": "Operation Pilot AI Agent",
        "description": "Ops Pilot acts as an ultra-scalable digital SME. Integrating securely with our log management systems and Confluence SOPs, it uses Retrieval-Augmented Generation (RAG) to analyze live stack traces and reference past incidents. It provides first-line responders with clear explanations and step-by-step remediation commands, drastically improving resolution consistency across retail systems.",
        "problemStatement": "Our IT support and engineering teams lose significant time on repetitive troubleshooting tasks and navigating scattered knowledge sources. This leads to inconsistent issue resolutions, high dependency on subject matter experts, and an elevated L3 Mean Time To Resolve (MTTR) of 1.3 days, ultimately degrading service quality.",
        "proposedSolution": "Implement a unified Operation Pilot AI Agent that integrates runbooks, ticketing historicals, and live telemetry to provide real-time troubleshooting guidance.",
        "status": "Accepted",
        "owner": {
            "name": "Asmit Basu",
            "avatar": "AB",
            "avatarColor": "var(--accent-teal)",
            "role": "Member"
        },
        "linkedChallenge": {
            "id": "CH-004",
            "title": "Ops Copilot AI Agent"
        },
        "tags": [
            "AIOps",
            "Automation",
            "LLM"
        ],
        "stats": {
            "appreciations": 16,
            "comments": 3,
            "views": 15
        },
        "impactLevel": "Medium",
        "submittedDate": "Feb 01, 2026",
        "lastUpdated": "Feb 15, 2026",
        "approvalStatus": "Approved"
    },
    {
        "id": "ID-0005",
        "title": "Multi agent sponsored porducts manager",
        "description": "We propose an orchestrated multi-agent system utilizing the Model Context Protocol (MCP). Specialized MCP servers will act as interfaces for Campaign Management, Data Science pricing, Reporting Analytics, and Product Search. A centralized orchestrator agent will delegate natural language user intents (e.g., voice commands) to the relevant MCP sub-systems, automating end-to-end advertiser workflows.",
        "problemStatement": "Sponsored Product Campaign management is currently performed entirely via complex UIs, making it a lengthy and error-prone process for advertisers. Setting up, modifying, and tracking campaigns requires multiple manual steps that deter advertisers from scaling their efforts.",
        "proposedSolution": "Establish an agentic ecosystem utilizing the Model Context Protocol (MCP) to seamlessly connect AI agents to specialized advertising, reporting, and campaign backend services.",
        "status": "Accepted",
        "owner": {
            "name": "Pragya Bharati",
            "avatar": "PB",
            "avatarColor": "var(--accent-teal)",
            "role": "Member"
        },
        "linkedChallenge": {
            "id": "CH-005",
            "title": "Sponsored Products Agent"
        },
        "tags": [
            "Agents",
            "LlamaIndex",
            "MCP"
        ],
        "stats": {
            "appreciations": 17,
            "comments": 3,
            "views": 6
        },
        "impactLevel": "Medium",
        "submittedDate": "Feb 01, 2026",
        "lastUpdated": "Feb 15, 2026",
        "approvalStatus": "Approved"
    },
    {
        "id": "ID-0006",
        "title": "AH360 Conversational AI for Operational Impact Visibility",
        "description": "AH360 integrates a Conversational AI overlay on top of our existing observability stack. Users can immediately query active incidents or infrastructure health via natural language (e.g., is the payment gateway for Region A degraded?). The AI analyzes patterns across the entire operational chain, predicting downstream business impacts on Distribution Centres before they manifest into critical outages.",
        "problemStatement": "Distribution Centre operations lack a unified, real-time view that connects business processes with their underlying technology services and applications. Without clear observability into how technical components support operational workflows, it becomes difficult to quickly identify root causes, assess impact, and respond to disruptions.",
        "proposedSolution": "Integrate a conversational AI bot directly into the AH360 observability dashboard to query realtime logs and predict operational impacts using natural language.",
        "status": "Accepted",
        "owner": {
            "name": "Kabir Malhotra",
            "avatar": "KM",
            "avatarColor": "var(--accent-teal)",
            "role": "USER"
        },
        "linkedChallenge": {
            "id": "CH-006",
            "title": "AH360"
        },
        "tags": [
            "Observability",
            "Conversational AI",
            "Retail"
        ],
        "stats": {
            "appreciations": 15,
            "comments": 2,
            "views": 73
        },
        "impactLevel": "Medium",
        "submittedDate": "Feb 01, 2026",
        "lastUpdated": "Feb 15, 2026",
        "approvalStatus": "Approved"
    },
    {
        "id": "ID-0007",
        "title": "IGuru: Centralized AI Knowledge Assistant",
        "description": "Deploy IGuru, an AI assistant strictly grounded in internal documentation using advanced RAG and strict semantic search. When developers ask technical questions, IGuru actively searches Confluence and repo readmes, returning a synthesized answer that strictly cites its sources. By preventing hallucinations and forbidding generic web data, IGuru becomes a highly trusted institutional knowledge oracle.",
        "problemStatement": "The organization faces severe knowledge management challenges that limit scalability. Critical expertise is concentrated among a few Subject Matter Experts (SMEs), creating bottlenecks and single points of failure. Onboarding new developers is inefficient as information is scattered across Confluence, ServiceNow, and numerous codebases, leading to duplicated efforts and slow ramp-up times.",
        "proposedSolution": "Launch IGuru as a fully centralized AI Knowledge Assistant, relying exclusively on RAG over internal Confluence documentation to generate reliable, cited answers.",
        "status": "Accepted",
        "owner": {
            "name": "Aditya Rao",
            "avatar": "AR",
            "avatarColor": "var(--accent-teal)",
            "role": "USER"
        },
        "linkedChallenge": {
            "id": "CH-007",
            "title": "Myguru.ai"
        },
        "tags": [
            "Knowledge Base",
            "Semantic Search",
            "RAG"
        ],
        "stats": {
            "appreciations": 6,
            "comments": 0,
            "views": 91
        },
        "impactLevel": "Medium",
        "submittedDate": "Feb 01, 2026",
        "lastUpdated": "Feb 15, 2026",
        "approvalStatus": "Approved"
    },
    {
        "id": "ID-0008",
        "title": "Agentic Promotion Rules Manager",
        "description": "PromoPilot introduces a suite of AI agents deeply integrated into our promotion lifecycle. It ingests upcoming promotional campaigns and automatically parses product attributes to derive strict inclusion and exclusion logic. It proactively flags missing eligible items or contradictory rules, significantly decreasing the manual QA load required by pricing analysts prior to go-live.",
        "problemStatement": "Promotion item inclusion and exclusion lists are heavily maintained through manual spreadsheet processes and outdated legacy rules. This leads to frequent errors, financial losses from incorrect discounts, missed eligible items, and inconsistent execution that heavily impacts overall profitability and customer trust.",
        "proposedSolution": "Build a secure, scalable Agentic AI co-pilot focused purely on dissecting catalog metadata to dynamically generate and validate promotion inclusion/exclusion rules.",
        "status": "Accepted",
        "owner": {
            "name": "Smriti Kumar",
            "avatar": "SK",
            "avatarColor": "var(--accent-teal)",
            "role": "Member"
        },
        "linkedChallenge": {
            "id": "CH-008",
            "title": "Agentic PromoPilot"
        },
        "tags": [
            "Retail",
            "Pricing",
            "AI Rules"
        ],
        "stats": {
            "appreciations": 11,
            "comments": 2,
            "views": 82
        },
        "impactLevel": "Medium",
        "submittedDate": "Feb 01, 2026",
        "lastUpdated": "Feb 15, 2026",
        "approvalStatus": "Approved"
    },
    {
        "id": "ID-0009",
        "title": "GenAI-Powered RPA Framework",
        "description": "This proposal introduces an AI-enhanced next-generation Web RPA framework powered by Azure OpenAI. Business users can type prompts (e.g., download weekly excel reports from Vendor X and email to Team Y). The framework translates these intents into executable Pyppeteer or Selenium scripts on the fly, dramatically democratizing automation capabilities.",
        "problemStatement": "Traditional Robotic Process Automation (RPA) development within our ecosystem is time-consuming, requires specialized engineering skills, and lacks the agility needed for rapid automation of simple web-based tasks. This slows down our modernization efforts and leaves many manual tasks unautomated.",
        "proposedSolution": "Develop an Azure OpenAI-powered Text-to-Action framework that compiles user-friendly natural language prompts into executable UI automation scripts.",
        "status": "Accepted",
        "owner": {
            "name": "Nur Islam",
            "avatar": "NI",
            "avatarColor": "var(--accent-teal)",
            "role": "Member"
        },
        "linkedChallenge": {
            "id": "CH-009",
            "title": "Text-To-Action"
        },
        "tags": [
            "RPA",
            "Low Code",
            "Azure OpenAI"
        ],
        "stats": {
            "appreciations": 18,
            "comments": 2,
            "views": 91
        },
        "impactLevel": "Medium",
        "submittedDate": "Feb 01, 2026",
        "lastUpdated": "Feb 15, 2026",
        "approvalStatus": "Approved"
    },
    {
        "id": "ID-0010",
        "title": "Agentic AI–Driven Terraform Migration",
        "description": "The Agentic AI Terraform Migration tool will scan all 8,000 repositories, abstracting existing infrastructure definitions. Leveraging specialized LLM capabilities tailored for HCL (HashiCorp Configuration Language), it will automatically generate Pull Requests that refactor the code to utilize approved Azure Verified Modules, ensuring compliance while handling the sheer volume of code autonomously.",
        "problemStatement": "Ahold Delhaize manages over 8,000 Terraform repositories across various OpCos, creating massive governance, standardization, and cost-control challenges. Without a structured migration to Azure Verified Modules (AVM), we suffer from tech debt, security inconsistencies, and operational bloat.",
        "proposedSolution": "Construct an AI-driven repository crawling agent that identifies legacy Terraform code and automatically generates Azure Verified Module (AVM) replacement PRs.",
        "status": "Accepted",
        "owner": {
            "name": "Riyal Guha",
            "avatar": "RG",
            "avatarColor": "var(--accent-teal)",
            "role": "Member"
        },
        "linkedChallenge": {
            "id": "CH-010",
            "title": "Terraform to AVM Migration"
        },
        "tags": [
            "Terraform",
            "AVM",
            "Infrastructure"
        ],
        "stats": {
            "appreciations": 18,
            "comments": 3,
            "views": 68
        },
        "impactLevel": "Medium",
        "submittedDate": "Feb 01, 2026",
        "lastUpdated": "Feb 15, 2026",
        "approvalStatus": "Approved"
    },
    {
        "id": "ID-0011",
        "title": "Enterprise Observability with Grafana",
        "description": "Argus will utilize Grafana Labs enterprise solutions to build a unified pane of glass. By aggregating metrics from Prometheus, Datadog, and internal loggers, Argus correlates technical infrastructure telemetry (CPU/Memory) with business KPIs (Cart Checkout Rates). Intelligent alerting will use machine learning to detect anomalous behavior outside of standard seasonal thresholds.",
        "problemStatement": "The lack of a unified observability platform limits our ability to proactively monitor technical, operational, and business KPIs. This reduces our situational awareness, increasing the risk of major undetected outages and negatively impacting both internal operations and the end-customer experience.",
        "proposedSolution": "Design and implement the Argus platform built over Grafana Enterprise, serving as a centralized hub to correlate technical telemetry with vital business metrics.",
        "status": "Accepted",
        "owner": {
            "name": "Vikram Singh",
            "avatar": "VS",
            "avatarColor": "var(--accent-teal)",
            "role": "USER"
        },
        "linkedChallenge": {
            "id": "CH-011",
            "title": "Argus Observability Platform"
        },
        "tags": [
            "Grafana",
            "KPIs",
            "Observability"
        ],
        "stats": {
            "appreciations": 7,
            "comments": 2,
            "views": 53
        },
        "impactLevel": "Medium",
        "submittedDate": "Feb 01, 2026",
        "lastUpdated": "Feb 15, 2026",
        "approvalStatus": "Approved"
    },
    {
        "id": "ID-0012",
        "title": "Automated Access Provisioning Engine",
        "description": "The Automated Access Provisioning Engine intercepts ServiceNow requests for IAM provisioning. Using a serverless architecture executing secure PowerShell and TDI scripts, it validates the user's departmental context, auto-approves standard access patterns based on RBAC policies, and provisions Active Directory/SaaS permissions instantly without Helpdesk intervention.",
        "problemStatement": "Service request handling in the identity and access provisioning area remains highly manual and time-intensive. Engineers frequently execute repetitive bash and PowerShell scripts, leading to a higher MTTR, human errors, and a frustrating, inconsistent onboarding experience for new employees.",
        "proposedSolution": "Introduce an automated fulfillment pipeline linking ServiceNow tickets to automated TDI and PowerShell runbooks for zero-touch identity and access provisioning.",
        "status": "Accepted",
        "owner": {
            "name": "Rohan Mondal",
            "avatar": "RM",
            "avatarColor": "var(--accent-teal)",
            "role": "Member"
        },
        "linkedChallenge": {
            "id": "CH-012",
            "title": "SR Automation"
        },
        "tags": [
            "PowerShell",
            "Automation",
            "IAM"
        ],
        "stats": {
            "appreciations": 10,
            "comments": 1,
            "views": 96
        },
        "impactLevel": "Medium",
        "submittedDate": "Feb 01, 2026",
        "lastUpdated": "Feb 15, 2026",
        "approvalStatus": "Approved"
    },
    {
        "id": "ID-0013",
        "title": "GenAI-Powered Test Case Generator",
        "description": "We will develop a bidirectional integration utilizing Jira MCP and Figma MCP connected to GPT-4o. The AI automatically ingests user story descriptions and analyzes the linked Figma UI components. It then drafts comprehensive Gherkin-style BDD test cases, validating UI states, edge cases, and functional pathways, publishing them directly to Jira Zephyr/Xray.",
        "problemStatement": "Test case creation is largely manual, time-consuming, and heavily dependent on individual QA expertise. This results in inconsistent test coverage and delayed software delivery cycles. There is limited alignment between Jira user stories, Figma UX designs, and the resulting QA artifacts.",
        "proposedSolution": "Create a GenAI-Powered Test Case Generator that cross-references Jira functional requirements against Figma design layers using distinct MCP modules.",
        "status": "Accepted",
        "owner": {
            "name": "Pooja Hegde",
            "avatar": "PH",
            "avatarColor": "var(--accent-teal)",
            "role": "USER"
        },
        "linkedChallenge": {
            "id": "CH-013",
            "title": "AI-Driven Test Design Automation"
        },
        "tags": [
            "QA Automation",
            "GPT-4",
            "Jira"
        ],
        "stats": {
            "appreciations": 1,
            "comments": 0,
            "views": 55
        },
        "impactLevel": "Medium",
        "submittedDate": "Feb 01, 2026",
        "lastUpdated": "Feb 15, 2026",
        "approvalStatus": "Approved"
    },
    {
        "id": "ID-0014",
        "title": "AI-Powered Sprint Planner",
        "description": "The Jira Sprint Planning Assistant evaluates the backlog using historical team velocity, developer skill matrix mappings, and ticket dependency graphs. It proposes an optimized sprint backlog, auto-generates a cohesive Sprint Goal, and suggests an assignee for each ticket based on past commit history and current capacity, greatly simplifying sprint ceremonies.",
        "problemStatement": "Agile Sprint planning is currently repetitive and manual, requiring Scrum Masters to constantly coordinate prioritized epics, user stories, dependencies, and team availability. Matching the correct team members' skills to complicated user story requirements is particularly challenging and often leads to suboptimal assignments.",
        "proposedSolution": "Develop an AI-powered Sprint Planner plugin for Jira that calculates capacity, maps required expertise, and models optimal user story assignment configurations.",
        "status": "Accepted",
        "owner": {
            "name": "Arjun Sharma",
            "avatar": "AS",
            "avatarColor": "var(--accent-teal)",
            "role": "USER"
        },
        "linkedChallenge": {
            "id": "CH-014",
            "title": "JIRA Sprint Planning Assistant"
        },
        "tags": [
            "Agile",
            "Sprint Planning",
            "AI Assistant"
        ],
        "stats": {
            "appreciations": 8,
            "comments": 1,
            "views": 33
        },
        "impactLevel": "Medium",
        "submittedDate": "Feb 01, 2026",
        "lastUpdated": "Feb 15, 2026",
        "approvalStatus": "Approved"
    }
];

export const challengeCards: ChallengeCardData[] = [
    {
        "id": "CH-001",
        "challengeNumber": "CH-001",
        "title": "Aham.ai",
        "description": "Due to varied and constantly evolving reporting needs from the Ad Tech team, relying on manual SQL querying and static dashboards is no longer viable. There is a strong need to create an AI-backed dyn...",
        "stage": "POC & Pilot",
        "impact": "High",
        "ideasCount": 1,
        "effort": "12 weeks",
        "value": "TBD",
        "owner": {
            "name": "Asmit Basu",
            "initial": "AB",
            "color": "var(--accent-teal)"
        },
        "team": [
            {
                "name": "Asmit Basu",
                "initial": "AB",
                "color": "var(--accent-teal)"
            }
        ]
    },
    {
        "id": "CH-002",
        "challengeNumber": "CH-002",
        "title": "Party Planner",
        "description": "Planning a party involves complex logistics, and miscalculating attendee consumption often results in a significant amount of food waste the next day. There is currently no intelligent mechanism to op...",
        "stage": "Parking Lot",
        "impact": "High",
        "ideasCount": 1,
        "effort": "12 weeks",
        "value": "TBD",
        "owner": {
            "name": "Asmit Basu",
            "initial": "AB",
            "color": "var(--accent-blue)"
        },
        "team": [
            {
                "name": "Asmit Basu",
                "initial": "AB",
                "color": "var(--accent-blue)"
            }
        ]
    },
    {
        "id": "CH-003",
        "challengeNumber": "CH-003",
        "title": "Pallas Data Insights",
        "description": "The current data fulfillment process is heavily manual, leading to delays and inefficiencies. Requests depend entirely on the IT team, causing multiple back-and-forth iterations before completion. Acc...",
        "stage": "POC & Pilot",
        "impact": "High",
        "ideasCount": 1,
        "effort": "12 weeks",
        "value": "TBD",
        "owner": {
            "name": "Pritam Ghatak",
            "initial": "PG",
            "color": "var(--accent-green)"
        },
        "team": [
            {
                "name": "Pritam Ghatak",
                "initial": "PG",
                "color": "var(--accent-green)"
            }
        ]
    },
    {
        "id": "CH-004",
        "challengeNumber": "CH-004",
        "title": "Ops Copilot AI Agent",
        "description": "Our IT support and engineering teams lose significant time on repetitive troubleshooting tasks and navigating scattered knowledge sources. This leads to inconsistent issue resolutions, high dependency...",
        "stage": "POC & Pilot",
        "impact": "High",
        "ideasCount": 1,
        "effort": "12 weeks",
        "value": "TBD",
        "owner": {
            "name": "Indrani Ghosh",
            "initial": "IG",
            "color": "var(--accent-orange)"
        },
        "team": [
            {
                "name": "Indrani Ghosh",
                "initial": "IG",
                "color": "var(--accent-orange)"
            }
        ]
    },
    {
        "id": "CH-005",
        "challengeNumber": "CH-005",
        "title": "Sponsored Products Agent",
        "description": "Sponsored Product Campaign management is currently performed entirely via complex UIs, making it a lengthy and error-prone process for advertisers. Setting up, modifying, and tracking campaigns requir...",
        "stage": "POC & Pilot",
        "impact": "High",
        "ideasCount": 1,
        "effort": "12 weeks",
        "value": "TBD",
        "owner": {
            "name": "Asmit Basu",
            "initial": "AB",
            "color": "var(--accent-purple)"
        },
        "team": [
            {
                "name": "Asmit Basu",
                "initial": "AB",
                "color": "var(--accent-purple)"
            }
        ]
    },
    {
        "id": "CH-006",
        "challengeNumber": "CH-006",
        "title": "AH360",
        "description": "Distribution Centre operations lack a unified, real-time view that connects business processes with their underlying technology services and applications. Without clear observability into how technica...",
        "stage": "POC & Pilot",
        "impact": "High",
        "ideasCount": 1,
        "effort": "12 weeks",
        "value": "TBD",
        "owner": {
            "name": "Pragya Bharati",
            "initial": "PB",
            "color": "var(--accent-pink)"
        },
        "team": [
            {
                "name": "Pragya Bharati",
                "initial": "PB",
                "color": "var(--accent-pink)"
            }
        ]
    },
    {
        "id": "CH-007",
        "challengeNumber": "CH-007",
        "title": "Myguru.ai",
        "description": "The organization faces severe knowledge management challenges that limit scalability. Critical expertise is concentrated among a few Subject Matter Experts (SMEs), creating bottlenecks and single poin...",
        "stage": "POC & Pilot",
        "impact": "High",
        "ideasCount": 1,
        "effort": "12 weeks",
        "value": "TBD",
        "owner": {
            "name": "Dibyendu Das",
            "initial": "DD",
            "color": "var(--accent-teal)"
        },
        "team": [
            {
                "name": "Dibyendu Das",
                "initial": "DD",
                "color": "var(--accent-teal)"
            }
        ]
    },
    {
        "id": "CH-008",
        "challengeNumber": "CH-008",
        "title": "Agentic PromoPilot",
        "description": "Promotion item inclusion and exclusion lists are heavily maintained through manual spreadsheet processes and outdated legacy rules. This leads to frequent errors, financial losses from incorrect disco...",
        "stage": "Ideation & Evaluation",
        "impact": "High",
        "ideasCount": 1,
        "effort": "12 weeks",
        "value": "TBD",
        "owner": {
            "name": "Smriti Kumar",
            "initial": "SK",
            "color": "var(--accent-blue)"
        },
        "team": [
            {
                "name": "Smriti Kumar",
                "initial": "SK",
                "color": "var(--accent-blue)"
            }
        ]
    },
    {
        "id": "CH-009",
        "challengeNumber": "CH-009",
        "title": "Text-To-Action",
        "description": "Traditional Robotic Process Automation (RPA) development within our ecosystem is time-consuming, requires specialized engineering skills, and lacks the agility needed for rapid automation of simple we...",
        "stage": "Scaled & Deployed",
        "impact": "High",
        "ideasCount": 1,
        "effort": "12 weeks",
        "value": "TBD",
        "owner": {
            "name": "Smriti Kumar",
            "initial": "SK",
            "color": "var(--accent-green)"
        },
        "team": [
            {
                "name": "Smriti Kumar",
                "initial": "SK",
                "color": "var(--accent-green)"
            }
        ]
    },
    {
        "id": "CH-010",
        "challengeNumber": "CH-010",
        "title": "Terraform to AVM Migration",
        "description": "Ahold Delhaize manages over 8,000 Terraform repositories across various OpCos, creating massive governance, standardization, and cost-control challenges. Without a structured migration to Azure Verifi...",
        "stage": "Scaled & Deployed",
        "impact": "High",
        "ideasCount": 1,
        "effort": "12 weeks",
        "value": "TBD",
        "owner": {
            "name": "Dibyendu Das",
            "initial": "DD",
            "color": "var(--accent-orange)"
        },
        "team": [
            {
                "name": "Dibyendu Das",
                "initial": "DD",
                "color": "var(--accent-orange)"
            }
        ]
    },
    {
        "id": "CH-011",
        "challengeNumber": "CH-011",
        "title": "Argus Observability Platform",
        "description": "The lack of a unified observability platform limits our ability to proactively monitor technical, operational, and business KPIs. This reduces our situational awareness, increasing the risk of major u...",
        "stage": "Scaled & Deployed",
        "impact": "High",
        "ideasCount": 1,
        "effort": "12 weeks",
        "value": "TBD",
        "owner": {
            "name": "Dibyendu Das",
            "initial": "DD",
            "color": "var(--accent-purple)"
        },
        "team": [
            {
                "name": "Dibyendu Das",
                "initial": "DD",
                "color": "var(--accent-purple)"
            }
        ]
    },
    {
        "id": "CH-012",
        "challengeNumber": "CH-012",
        "title": "SR Automation",
        "description": "Service request handling in the identity and access provisioning area remains highly manual and time-intensive. Engineers frequently execute repetitive bash and PowerShell scripts, leading to a higher...",
        "stage": "Scaled & Deployed",
        "impact": "High",
        "ideasCount": 1,
        "effort": "12 weeks",
        "value": "TBD",
        "owner": {
            "name": "Dibyendu Das",
            "initial": "DD",
            "color": "var(--accent-pink)"
        },
        "team": [
            {
                "name": "Dibyendu Das",
                "initial": "DD",
                "color": "var(--accent-pink)"
            }
        ]
    },
    {
        "id": "CH-013",
        "challengeNumber": "CH-013",
        "title": "AI-Driven Test Design Automation",
        "description": "Test case creation is largely manual, time-consuming, and heavily dependent on individual QA expertise. This results in inconsistent test coverage and delayed software delivery cycles. There is limite...",
        "stage": "Scaled & Deployed",
        "impact": "High",
        "ideasCount": 1,
        "effort": "12 weeks",
        "value": "TBD",
        "owner": {
            "name": "Chandan Kumar",
            "initial": "CK",
            "color": "var(--accent-teal)"
        },
        "team": [
            {
                "name": "Chandan Kumar",
                "initial": "CK",
                "color": "var(--accent-teal)"
            }
        ]
    },
    {
        "id": "CH-014",
        "challengeNumber": "CH-014",
        "title": "JIRA Sprint Planning Assistant",
        "description": "Agile Sprint planning is currently repetitive and manual, requiring Scrum Masters to constantly coordinate prioritized epics, user stories, dependencies, and team availability. Matching the correct te...",
        "stage": "Challenge Submitted",
        "impact": "High",
        "ideasCount": 1,
        "effort": "12 weeks",
        "value": "TBD",
        "owner": {
            "name": "Chandan Kumar",
            "initial": "CK",
            "color": "var(--accent-blue)"
        },
        "team": [
            {
                "name": "Chandan Kumar",
                "initial": "CK",
                "color": "var(--accent-blue)"
            }
        ]
    }
];
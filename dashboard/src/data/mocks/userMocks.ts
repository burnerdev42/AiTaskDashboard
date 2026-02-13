import type { User } from '../../types/user';
// import { OpCo, Platform, Interest } from '../../enums/profileEnums'; // Types only, using string literals

export const MOCK_USERS: User[] = [
    {
        id: 'U-001',
        name: 'Admin User',
        avatar: 'AU',
        role: 'Administrator',
        email: 'admin@example.com',
        department: 'IT',
        location: 'New York',
        opCo: 'TCS — USA', // Was OpCo.Tech (invalid)
        platforms: ['BFSI', 'Technology & Services'], // Was Platform.Web...
        interests: ['Product & Data', 'Sustainability']
    },
    {
        id: 'U-002',
        name: 'Ravi Patel',
        avatar: 'RP',
        role: 'Product Manager',
        email: 'ravi.patel@example.com',
        department: 'Product',
        location: 'London',
        opCo: 'TCS — UK',
        platforms: ['Retail & CPG'],
        interests: ['Customer Experience', 'Product & Data']
    }
];

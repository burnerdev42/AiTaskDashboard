import type { SwimLaneCard } from '../../types/swimlane';

export const MOCK_SWIMLANES: SwimLaneCard[] = [
    {
        id: 'SL-001',
        title: 'Q1 Innovation Review',
        description: 'Quarterly review of all active innovation POCs.',
        stage: 'Ideation',
        priority: 'High',
        owner: 'Sarah Connor',
        type: 'standard'
    },
    {
        id: 'SL-002',
        title: 'Setup Analytics Dashboard',
        description: 'Implement new metrics for tracking idea engagement.',
        stage: 'Prototype',
        priority: 'Medium',
        owner: 'John Doe',
        type: 'validation'
    },
    {
        id: 'SL-003',
        title: 'Migrate Legacy Data',
        description: 'Move old innovation data to the new system.',
        stage: 'Parking Lot',
        priority: 'Low',
        owner: 'Jane Smith',
        type: 'pilot'
    }
];

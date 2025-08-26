import type { AiInteraction } from './types';

// This mock data simulates a log of interactions with the AI Genie.
// In a real application, this would be a proper database table.
export const MOCK_AI_INTERACTIONS: AiInteraction[] = [
    {
        id: 'interaction-1725112800000-abc',
        partId: 'part-001',
        partName: 'OEM Brake Pads',
        userQuery: 'brake pads for toyota',
        timestamp: new Date('2024-08-31T14:00:00Z'),
        clicked: true,
        ordered: true,
    },
    {
        id: 'interaction-1725113100000-def',
        partId: 'part-003',
        partName: 'Performance Air Filter',
        userQuery: 'how to improve performance',
        timestamp: new Date('2024-08-31T14:05:00Z'),
        clicked: true,
        ordered: false,
    },
     {
        id: 'interaction-1725113400000-ghi',
        partId: 'part-005',
        partName: 'New Spark Plugs (4-pack)',
        userQuery: 'spark plugs',
        timestamp: new Date('2024-08-31T14:10:00Z'),
        clicked: false,
        ordered: false,
    },
     {
        id: 'interaction-1725113700000-jkl',
        partId: 'part-007',
        partName: 'OEM Oil Filter',
        userQuery: 'oil filter for mazda',
        timestamp: new Date('2024-08-31T14:15:00Z'),
        clicked: true,
        ordered: true,
    },
     {
        id: 'interaction-1725114000000-mno',
        partId: 'part-002',
        partName: 'Used Alternator - Toyota Camry',
        userQuery: 'alternator for camry 2018',
        timestamp: new Date('2024-08-31T14:20:00Z'),
        clicked: true,
        ordered: false,
    }
];

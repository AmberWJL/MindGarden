import { ThoughtCard } from './types';

export const SEED_THOUGHTS: ThoughtCard[] = [
    {
        id: 'seed-goal-1',
        originalText: "I want to finish this hackathon project and make it beautiful.",
        imageUrl: "https://images.unsplash.com/photo-1470509037663-253afd7f0fdd?w=800&q=80",
        reflection: "Your dedication is clear. Remember that beauty often comes from the care you put into the details, not just the final polish.",
        growthStage: 'bloom',
        meta: {
            emotion: 'determined',
            intensity: 'medium',
            category: 'goal',
            topic: 'Context',
            hasNextStep: true,
            nextStep: { type: 'do', text: 'Review the styling one last time.', confidence: 0.9 },
            plantSpecies: 'Sunflower',
            // metaphors removed as per interface, if needed add empty array but interface says optional/legacy
            metaphors: []
        },
        music: {
            trackId: 'mock-1',
            name: 'Cornfield Chase',
            artist: 'Hans Zimmer',
            spotifyUrl: '#',
            reasoning: "Driving rhythm to keep you moving forward.",
            albumArt: 'https://images.unsplash.com/photo-1514525253440-b393452e8d26?w=300&q=80'
        },
        createdAt: Date.now() - 86400000 * 2,
        position: { x: 50, y: 50 },
        hasViewed: true,
        updates: []
    },
    {
        id: 'seed-feeling-1',
        originalText: "Feeling a bit overwhelmed by how much is left to do.",
        imageUrl: "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800&q=80",
        reflection: "It's natural to feel the weight of what's ahead. Take a breath. You are capable, and it's okay to take things one step at a time.",
        growthStage: 'sprout',
        meta: {
            emotion: 'overwhelmed',
            intensity: 'high',
            category: 'feeling',
            topic: 'Workload',
            hasNextStep: true,
            nextStep: { type: 'reflect', text: 'Pause for 1 minute and breathe.', confidence: 0.95 },
            plantSpecies: 'Cherry Blossom',
            metaphors: []
        },
        music: {
            trackId: 'mock-2',
            name: 'Weightless',
            artist: 'Marconi Union',
            spotifyUrl: '#',
            reasoning: "Soft textures to help steady your mind.",
            albumArt: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&q=80'
        },
        createdAt: Date.now() - 86400000,
        position: { x: 50, y: 50 },
        hasViewed: true,
        updates: []
    },
    {
        id: 'seed-idea-1',
        originalText: "What if the garden changed colors with the time of day?",
        imageUrl: "https://images.unsplash.com/photo-1613539246066-78db6ec4d61d?w=800&q=80",
        reflection: "A lovely thought! It would make the garden feel even more alive and connected to your own rhythm.",
        growthStage: 'seed',
        meta: {
            emotion: 'curious',
            intensity: 'low',
            category: 'idea',
            topic: 'App Feature',
            hasNextStep: false,
            nextStep: null,
            plantSpecies: 'Tulip',
            metaphors: []
        },
        music: {
            trackId: 'mock-3',
            name: 'Daydreaming',
            artist: 'Radiohead',
            spotifyUrl: '#',
            reasoning: "Light and playful to match your curiosity."
        },
        createdAt: Date.now() - 43200000,
        position: { x: 50, y: 50 }, // Position logic will be overridden by App's slot allocator
        hasViewed: true,
        updates: []
    },
    {
        id: 'seed-memory-1',
        originalText: "Walking in the rain yesterday was so refreshing.",
        imageUrl: "https://images.unsplash.com/photo-1596726915206-559d81d2746c?w=800&q=80",
        reflection: "The rain has a way of washing things clean. Hold onto that feeling of refreshment.",
        growthStage: 'mature',
        meta: {
            emotion: 'peaceful',
            intensity: 'medium',
            category: 'memory',
            topic: 'Nature',
            hasNextStep: false,
            nextStep: null,
            plantSpecies: 'Bluebell',
            metaphors: []
        },
        createdAt: Date.now() - 172800000,
        position: { x: 50, y: 50 },
        hasViewed: true,
        updates: [
            {
                id: 'update-1',
                timestamp: Date.now() - 86400000,
                text: "I want to do it again soon.",
                aiResponse: "A wonderful intention. The rain will be waiting for you.",
                previousStage: 'bloom',
                newStage: 'mature',
                nextStep: null
            }
        ]
    }
];

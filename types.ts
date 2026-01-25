export type ThoughtCategory = 'idea' | 'todo' | 'worry' | 'feeling' | 'goal' | 'memory' | 'other';

export interface ThoughtMeta {
  emotion: string;
  intent: string; // specialized intent from AI
  intensity: 'low' | 'medium' | 'high';
  metaphors: string[];
  category: ThoughtCategory;
  topic: string; // Short 3-6 word label
}

export interface GeneratedContent {
  imageUrl: string;
  reflection: string;
  meta: ThoughtMeta;
}

export interface Position {
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
}

export interface ThoughtCard extends GeneratedContent {
  id: string;
  originalText: string;
  createdAt: number;
  position: Position;
  hasViewed: boolean;
}

export enum AppView {
  GARDEN = 'GARDEN',
  LIST = 'LIST'
}

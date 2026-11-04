import type { GateName } from '../quantum';

export type TrackId = 'mathematics' | 'fundamentals' | 'applications';
export type AlgorithmName = 'bell' | 'grover' | 'qft' | 'optimization' | 'chemistry';
export type Lab =
  { kind: 'gates'; sequence: GateName[] } | { kind: 'algorithm'; name: AlgorithmName };

export interface Lesson {
  id: string;
  title: string;
  time: number;
  level: 'Introduction' | 'Core' | 'Application';
  topics: string[];
  body: string[];
  math: { formula: string; explanation: string };
  example: string;
  practice: { prompt: string; answer: string };
  question: string;
  answers: [string, string, string];
  correct: number;
  why: string;
  lab?: Lab;
  followUp?: string[];
}

export interface Course {
  id: string;
  title: string;
  track: TrackId;
  description: string;
  icon: string;
  color: 'mint' | 'blue' | 'peach' | 'lavender';
  prerequisites: string[];
  outcomes: string[];
  lessons: Lesson[];
}

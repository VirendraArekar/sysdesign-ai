export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  roles: string[];
  targetRole?: string;
  experienceYears?: number;
  targetCompanies?: string[];
  preferredLevel?: string;
  interviewReadinessScore?: number;
  dailyStreak?: number;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export interface WorkingStep {
  stepNumber: number;
  component: string;
  action: string;
  protocol: string;
  latency: string;
  interviewerTalkingPoint: string;
}

export interface RelatedAnswer {
  question: string;
  interviewerIntent: string;
  modelAnswer: string;
  keyPoints: string[];
  tradeOffs?: string;
  edgeCases?: string;
}

export interface CodeOptions {
  java: string;
  python: string;
  cpp: string;
  go: string;
}

export interface TopicHubSummary {
  id: string;
  title: string;
  type: 'HLD' | 'LLD' | string;
  category: string;
  difficulty: string;
  summary: string;
  tags: string[];
}

export interface TopicHubDetail {
  id: string;
  title: string;
  type: 'HLD' | 'LLD' | string;
  category: string;
  difficulty: string;
  description: string;
  hldPoints?: string[];
  systemDesignDiagram: string;
  hldExplanation?: string;
  lldPoints?: string[];
  umlClassDiagram: string;
  umlSequenceDiagram: string;
  lldExplanation?: string;
  codeOptions: CodeOptions;
  workingSteps: WorkingStep[];
  relatedAnswers: RelatedAnswer[];
  deepDiveTopics: string[];
  tradeOffs: string[];
}


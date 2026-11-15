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

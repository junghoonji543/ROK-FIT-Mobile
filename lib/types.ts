/**
 * ROK-FIT 데이터 타입 정의
 */

export type ExerciseType = "counting" | "distance" | "time";

export interface Exercise {
  id: string;
  name: string;
  icon: string;
  type: ExerciseType;
  description?: string;
}

export interface WorkoutRecord {
  id: string;
  exerciseId: string;
  count?: number; // for counting exercises
  distance?: number; // for distance exercises (meters)
  duration?: number; // for time exercises (seconds)
  date: string; // ISO date string
  timestamp: number;
  notes?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  rank: string; // 계급 (예: 상병, 일병 등)
  profileImage?: string;
  targetLevel: string; // 목표 등급 (예: 특급, 1급 등)
  currentLevel: string; // 현재 등급
  achievementRate: number; // 목표 달성률 (0-100)
}

export interface WorkoutStats {
  exerciseId: string;
  totalCount: number;
  averageCount: number;
  bestCount: number;
  totalWorkouts: number;
  lastWorkoutDate?: string;
}

export interface CalendarDay {
  date: string; // YYYY-MM-DD
  hasWorkout: boolean;
  workoutCount: number;
}

import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Exercise, WorkoutRecord, UserProfile } from "./types";

/**
 * AsyncStorage 키 상수
 */
const KEYS = {
  EXERCISES: "@rok-fit/exercises",
  WORKOUT_RECORDS: "@rok-fit/workout-records",
  USER_PROFILE: "@rok-fit/user-profile",
};

/**
 * 운동 종목 관리
 */
export const ExerciseStorage = {
  async getAll(): Promise<Exercise[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.EXERCISES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Failed to load exercises:", error);
      return [];
    }
  },

  async save(exercises: Exercise[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.EXERCISES, JSON.stringify(exercises));
    } catch (error) {
      console.error("Failed to save exercises:", error);
      throw error;
    }
  },

  async add(exercise: Exercise): Promise<void> {
    const exercises = await this.getAll();
    exercises.push(exercise);
    await this.save(exercises);
  },

  async update(id: string, updates: Partial<Exercise>): Promise<void> {
    const exercises = await this.getAll();
    const index = exercises.findIndex((e) => e.id === id);
    if (index !== -1) {
      exercises[index] = { ...exercises[index], ...updates };
      await this.save(exercises);
    }
  },

  async delete(id: string): Promise<void> {
    const exercises = await this.getAll();
    const filtered = exercises.filter((e) => e.id !== id);
    await this.save(filtered);
  },

  async getById(id: string): Promise<Exercise | null> {
    const exercises = await this.getAll();
    return exercises.find((e) => e.id === id) || null;
  },
};

/**
 * 운동 기록 관리
 */
export const WorkoutRecordStorage = {
  async getAll(): Promise<WorkoutRecord[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.WORKOUT_RECORDS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Failed to load workout records:", error);
      return [];
    }
  },

  async save(records: WorkoutRecord[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.WORKOUT_RECORDS, JSON.stringify(records));
    } catch (error) {
      console.error("Failed to save workout records:", error);
      throw error;
    }
  },

  async add(record: WorkoutRecord): Promise<void> {
    const records = await this.getAll();
    records.push(record);
    // 최신 순으로 정렬
    records.sort((a, b) => b.timestamp - a.timestamp);
    await this.save(records);
  },

  async delete(id: string): Promise<void> {
    const records = await this.getAll();
    const filtered = records.filter((r) => r.id !== id);
    await this.save(filtered);
  },

  async getByExerciseId(exerciseId: string): Promise<WorkoutRecord[]> {
    const records = await this.getAll();
    return records.filter((r) => r.exerciseId === exerciseId);
  },

  async getByDateRange(startDate: string, endDate: string): Promise<WorkoutRecord[]> {
    const records = await this.getAll();
    return records.filter((r) => r.date >= startDate && r.date <= endDate);
  },

  async getLatestByExerciseId(exerciseId: string): Promise<WorkoutRecord | null> {
    const records = await this.getByExerciseId(exerciseId);
    return records.length > 0 ? records[0] : null;
  },
};

/**
 * 사용자 프로필 관리
 */
export const UserProfileStorage = {
  async get(): Promise<UserProfile | null> {
    try {
      const data = await AsyncStorage.getItem(KEYS.USER_PROFILE);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Failed to load user profile:", error);
      return null;
    }
  },

  async save(profile: UserProfile): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(profile));
    } catch (error) {
      console.error("Failed to save user profile:", error);
      throw error;
    }
  },

  async update(updates: Partial<UserProfile>): Promise<void> {
    const profile = await this.get();
    if (profile) {
      await this.save({ ...profile, ...updates });
    }
  },
};

/**
 * 초기 데이터 시드
 */
export async function seedInitialData(): Promise<void> {
  // 운동 종목 초기화
  const exercises = await ExerciseStorage.getAll();
  if (exercises.length === 0) {
    const defaultExercises: Exercise[] = [
      {
        id: "pushup",
        name: "팔굽혀펴기",
        icon: "💪",
        type: "counting",
        description: "팔을 어깨 너비로 벌리고 팔굽혀펴기를 수행합니다.",
      },
      {
        id: "situp",
        name: "윗몸일으키기",
        icon: "🏋️",
        type: "counting",
        description: "누운 자세에서 상체를 일으켜 윗몸일으키기를 수행합니다.",
      },
      {
        id: "run-3km",
        name: "3km 달리기",
        icon: "🏃",
        type: "time",
        description: "3km 거리를 달리는 시간을 측정합니다.",
      },
    ];
    await ExerciseStorage.save(defaultExercises);
  }

  // 사용자 프로필 초기화
  const profile = await UserProfileStorage.get();
  if (!profile) {
    const defaultProfile: UserProfile = {
      id: "user-1",
      name: "김육군",
      rank: "상병",
      targetLevel: "특급",
      currentLevel: "1급",
      achievementRate: 85,
    };
    await UserProfileStorage.save(defaultProfile);
  }
}

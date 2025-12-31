import { describe, it, expect, beforeEach } from "vitest";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ExerciseStorage, WorkoutRecordStorage, UserProfileStorage } from "@/lib/storage";
import type { Exercise, WorkoutRecord, UserProfile } from "@/lib/types";

// Mock AsyncStorage
beforeEach(async () => {
  await AsyncStorage.clear();
});

describe("ExerciseStorage", () => {
  it("should save and retrieve exercises", async () => {
    const exercises: Exercise[] = [
      {
        id: "pushup",
        name: "팔굽혀펴기",
        icon: "💪",
        type: "counting",
      },
    ];

    await ExerciseStorage.save(exercises);
    const retrieved = await ExerciseStorage.getAll();

    expect(retrieved).toEqual(exercises);
  });

  it("should add a new exercise", async () => {
    const exercise: Exercise = {
      id: "situp",
      name: "윗몸일으키기",
      icon: "🏋️",
      type: "counting",
    };

    await ExerciseStorage.add(exercise);
    const exercises = await ExerciseStorage.getAll();

    expect(exercises).toHaveLength(1);
    expect(exercises[0]).toEqual(exercise);
  });

  it("should get exercise by id", async () => {
    const exercise: Exercise = {
      id: "pushup",
      name: "팔굽혀펴기",
      icon: "💪",
      type: "counting",
    };

    await ExerciseStorage.add(exercise);
    const retrieved = await ExerciseStorage.getById("pushup");

    expect(retrieved).toEqual(exercise);
  });
});

describe("WorkoutRecordStorage", () => {
  it("should save and retrieve workout records", async () => {
    const records: WorkoutRecord[] = [
      {
        id: "record-1",
        exerciseId: "pushup",
        count: 50,
        date: "2026-01-01",
        timestamp: Date.now(),
      },
    ];

    await WorkoutRecordStorage.save(records);
    const retrieved = await WorkoutRecordStorage.getAll();

    expect(retrieved).toEqual(records);
  });

  it("should add a new workout record", async () => {
    const record: WorkoutRecord = {
      id: "record-1",
      exerciseId: "pushup",
      count: 50,
      date: "2026-01-01",
      timestamp: Date.now(),
    };

    await WorkoutRecordStorage.add(record);
    const records = await WorkoutRecordStorage.getAll();

    expect(records).toHaveLength(1);
    expect(records[0]).toEqual(record);
  });

  it("should filter records by exercise id", async () => {
    const records: WorkoutRecord[] = [
      {
        id: "record-1",
        exerciseId: "pushup",
        count: 50,
        date: "2026-01-01",
        timestamp: Date.now(),
      },
      {
        id: "record-2",
        exerciseId: "situp",
        count: 60,
        date: "2026-01-01",
        timestamp: Date.now(),
      },
    ];

    await WorkoutRecordStorage.save(records);
    const pushupRecords = await WorkoutRecordStorage.getByExerciseId("pushup");

    expect(pushupRecords).toHaveLength(1);
    expect(pushupRecords[0].exerciseId).toBe("pushup");
  });
});

describe("UserProfileStorage", () => {
  it("should save and retrieve user profile", async () => {
    const profile: UserProfile = {
      id: "user-1",
      name: "김육군",
      rank: "상병",
      targetLevel: "특급",
      currentLevel: "1급",
      achievementRate: 85,
    };

    await UserProfileStorage.save(profile);
    const retrieved = await UserProfileStorage.get();

    expect(retrieved).toEqual(profile);
  });

  it("should update user profile", async () => {
    const profile: UserProfile = {
      id: "user-1",
      name: "김육군",
      rank: "상병",
      targetLevel: "특급",
      currentLevel: "1급",
      achievementRate: 85,
    };

    await UserProfileStorage.save(profile);
    await UserProfileStorage.update({ achievementRate: 90 });

    const updated = await UserProfileStorage.get();
    expect(updated?.achievementRate).toBe(90);
  });
});

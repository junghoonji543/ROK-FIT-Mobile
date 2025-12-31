import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Exercise, WorkoutRecord, UserProfile } from "./types";
import { ExerciseStorage, WorkoutRecordStorage, UserProfileStorage, seedInitialData } from "./storage";

interface DataContextType {
  exercises: Exercise[];
  workoutRecords: WorkoutRecord[];
  userProfile: UserProfile | null;
  isLoading: boolean;
  refreshExercises: () => Promise<void>;
  refreshWorkoutRecords: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
  addWorkoutRecord: (record: WorkoutRecord) => Promise<void>;
  deleteWorkoutRecord: (id: string) => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [workoutRecords, setWorkoutRecords] = useState<WorkoutRecord[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshExercises = async () => {
    const data = await ExerciseStorage.getAll();
    setExercises(data);
  };

  const refreshWorkoutRecords = async () => {
    const data = await WorkoutRecordStorage.getAll();
    setWorkoutRecords(data);
  };

  const refreshUserProfile = async () => {
    const data = await UserProfileStorage.get();
    setUserProfile(data);
  };

  const addWorkoutRecord = async (record: WorkoutRecord) => {
    await WorkoutRecordStorage.add(record);
    await refreshWorkoutRecords();
  };

  const deleteWorkoutRecord = async (id: string) => {
    await WorkoutRecordStorage.delete(id);
    await refreshWorkoutRecords();
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    await UserProfileStorage.update(updates);
    await refreshUserProfile();
  };

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        // 초기 데이터 시드
        await seedInitialData();
        
        // 모든 데이터 로드
        await Promise.all([
          refreshExercises(),
          refreshWorkoutRecords(),
          refreshUserProfile(),
        ]);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <DataContext.Provider
      value={{
        exercises,
        workoutRecords,
        userProfile,
        isLoading,
        refreshExercises,
        refreshWorkoutRecords,
        refreshUserProfile,
        addWorkoutRecord,
        deleteWorkoutRecord,
        updateUserProfile,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}

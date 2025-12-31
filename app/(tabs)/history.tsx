import { ScrollView, Text, View, TouchableOpacity, FlatList, Alert } from "react-native";
import { useState, useMemo } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useData } from "@/lib/data-provider";
import { useColors } from "@/hooks/use-colors";

export default function HistoryScreen() {
  const colors = useColors();
  const { exercises, workoutRecords, deleteWorkoutRecord } = useData();
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  // 필터링된 기록
  const filteredRecords = useMemo(() => {
    if (selectedFilter === "all") {
      return workoutRecords;
    }
    return workoutRecords.filter((record) => record.exerciseId === selectedFilter);
  }, [workoutRecords, selectedFilter]);

  // 운동 종목 이름 가져오기
  const getExerciseName = (exerciseId: string) => {
    const exercise = exercises.find((e) => e.id === exerciseId);
    return exercise?.name || "알 수 없음";
  };

  // 운동 종목 아이콘 가져오기
  const getExerciseIcon = (exerciseId: string) => {
    const exercise = exercises.find((e) => e.id === exerciseId);
    return exercise?.icon || "❓";
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
    const weekday = weekdays[date.getDay()];
    return `${month}월 ${day}일 (${weekday})`;
  };

  // 기록 삭제
  const handleDelete = (id: string, exerciseName: string) => {
    Alert.alert(
      "기록 삭제",
      `${exerciseName} 기록을 삭제하시겠습니까?`,
      [
        { text: "취소", style: "cancel" },
        {
          text: "삭제",
          style: "destructive",
          onPress: () => deleteWorkoutRecord(id),
        },
      ]
    );
  };

  return (
    <ScreenContainer>
      {/* 상단 헤더 */}
      <View className="px-6 py-4 bg-background border-b border-border">
        <Text className="text-2xl font-bold text-foreground">기록실</Text>
      </View>

      {/* 필터 버튼 */}
      <View className="px-6 py-4">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-2">
          <TouchableOpacity
            onPress={() => setSelectedFilter("all")}
            className={`px-4 py-2 rounded-full mr-2 ${
              selectedFilter === "all" ? "bg-primary" : "bg-surface border border-border"
            }`}
          >
            <Text
              className={`font-semibold ${
                selectedFilter === "all" ? "text-background" : "text-foreground"
              }`}
            >
              전체
            </Text>
          </TouchableOpacity>
          {exercises.map((exercise) => (
            <TouchableOpacity
              key={exercise.id}
              onPress={() => setSelectedFilter(exercise.id)}
              className={`px-4 py-2 rounded-full mr-2 ${
                selectedFilter === exercise.id ? "bg-primary" : "bg-surface border border-border"
              }`}
            >
              <Text
                className={`font-semibold ${
                  selectedFilter === exercise.id ? "text-background" : "text-foreground"
                }`}
              >
                {exercise.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 기록 리스트 */}
      <View className="flex-1 px-6">
        {filteredRecords.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-xl text-muted">기록이 없습니다</Text>
            <Text className="text-sm text-muted mt-2">운동을 시작해보세요!</Text>
          </View>
        ) : (
          <FlatList
            data={filteredRecords}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View className="bg-surface rounded-2xl p-4 mb-4 border border-border">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center flex-1">
                    <View className="w-12 h-12 rounded-full bg-background items-center justify-center mr-4">
                      <Text className="text-2xl">{getExerciseIcon(item.exerciseId)}</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-lg font-bold text-foreground">
                        {getExerciseName(item.exerciseId)}
                      </Text>
                      <Text className="text-sm text-muted">{formatDate(item.date)}</Text>
                    </View>
                  </View>
                  <View className="items-end">
                    <Text className="text-2xl font-bold text-primary">{item.count}</Text>
                    <Text className="text-sm text-muted">회</Text>
                  </View>
                </View>
                <View className="flex-row justify-end mt-2">
                  <TouchableOpacity
                    onPress={() => handleDelete(item.id, getExerciseName(item.exerciseId))}
                    className="px-4 py-2 rounded-full bg-error/10"
                  >
                    <Text className="text-error font-semibold text-sm">삭제</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </ScreenContainer>
  );
}

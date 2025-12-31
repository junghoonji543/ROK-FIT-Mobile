import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useState, useMemo } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useData } from "@/lib/data-provider";
import { useColors } from "@/hooks/use-colors";

type Period = "week" | "month" | "all";

export default function StatsScreen() {
  const colors = useColors();
  const { exercises, workoutRecords, userProfile } = useData();
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("week");

  // 기간별 필터링
  const filteredRecords = useMemo(() => {
    const now = new Date();
    const records = [...workoutRecords];

    if (selectedPeriod === "week") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return records.filter((r) => new Date(r.date) >= weekAgo);
    } else if (selectedPeriod === "month") {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return records.filter((r) => new Date(r.date) >= monthAgo);
    }
    return records;
  }, [workoutRecords, selectedPeriod]);

  // 운동별 통계 계산
  const exerciseStats = useMemo(() => {
    return exercises.map((exercise) => {
      const records = filteredRecords.filter((r) => r.exerciseId === exercise.id);
      const counts = records.map((r) => r.count || 0);
      const totalCount = counts.reduce((sum, count) => sum + count, 0);
      const averageCount = counts.length > 0 ? Math.round(totalCount / counts.length) : 0;
      const bestCount = counts.length > 0 ? Math.max(...counts) : 0;

      return {
        exercise,
        totalCount,
        averageCount,
        bestCount,
        workoutCount: records.length,
      };
    });
  }, [exercises, filteredRecords]);

  // 체력 등급 정보
  const fitnessLevels = [
    { name: "특급", minPushups: 72, minSitups: 86, color: "#FFD700" },
    { name: "1급", minPushups: 65, minSitups: 78, color: "#C0C0C0" },
    { name: "2급", minPushups: 58, minSitups: 70, color: "#CD7F32" },
    { name: "3급", minPushups: 50, minSitups: 62, color: "#8B4513" },
  ];

  // 현재 등급 계산 (팔굽혀펴기 기준)
  const getCurrentLevel = () => {
    const pushupStats = exerciseStats.find((s) => s.exercise.id === "pushup");
    const bestCount = pushupStats?.bestCount || 0;

    for (const level of fitnessLevels) {
      if (bestCount >= level.minPushups) {
        return level;
      }
    }
    return { name: "미달", minPushups: 0, minSitups: 0, color: "#999999" };
  };

  const currentLevel = getCurrentLevel();

  // 다음 등급까지 필요한 횟수
  const getNextLevelInfo = () => {
    const pushupStats = exerciseStats.find((s) => s.exercise.id === "pushup");
    const bestCount = pushupStats?.bestCount || 0;

    const currentIndex = fitnessLevels.findIndex((l) => l.name === currentLevel.name);
    if (currentIndex > 0) {
      const nextLevel = fitnessLevels[currentIndex - 1];
      const remaining = nextLevel.minPushups - bestCount;
      return { nextLevel, remaining };
    }
    return null;
  };

  const nextLevelInfo = getNextLevelInfo();

  return (
    <ScreenContainer>
      {/* 상단 헤더 */}
      <View className="px-6 py-4 bg-background border-b border-border">
        <Text className="text-2xl font-bold text-foreground">체력지표</Text>
      </View>

      <ScrollView className="flex-1">
        <View className="p-6 gap-6">
          {/* 현재 체력 등급 */}
          <View className="bg-surface rounded-2xl p-6 shadow-sm border border-border">
            <Text className="text-lg font-bold text-foreground mb-4">현재 체력 등급</Text>
            <View className="items-center">
              <View
                className="w-32 h-32 rounded-full items-center justify-center mb-4"
                style={{ backgroundColor: currentLevel.color + "20" }}
              >
                <Text className="text-5xl font-bold" style={{ color: currentLevel.color }}>
                  {currentLevel.name}
                </Text>
              </View>
              <Text className="text-xl font-bold text-foreground mb-2">
                {userProfile?.name} {userProfile?.rank}님
              </Text>
              {nextLevelInfo && (
                <Text className="text-sm text-muted text-center">
                  {nextLevelInfo.nextLevel.name}까지 팔굽혀펴기 {nextLevelInfo.remaining}회 남았습니다
                </Text>
              )}
            </View>
          </View>

          {/* 기간 필터 */}
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => setSelectedPeriod("week")}
              className={`flex-1 py-3 rounded-full ${
                selectedPeriod === "week" ? "bg-primary" : "bg-surface border border-border"
              }`}
            >
              <Text
                className={`text-center font-semibold ${
                  selectedPeriod === "week" ? "text-background" : "text-foreground"
                }`}
              >
                주간
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedPeriod("month")}
              className={`flex-1 py-3 rounded-full ${
                selectedPeriod === "month" ? "bg-primary" : "bg-surface border border-border"
              }`}
            >
              <Text
                className={`text-center font-semibold ${
                  selectedPeriod === "month" ? "text-background" : "text-foreground"
                }`}
              >
                월간
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedPeriod("all")}
              className={`flex-1 py-3 rounded-full ${
                selectedPeriod === "all" ? "bg-primary" : "bg-surface border border-border"
              }`}
            >
              <Text
                className={`text-center font-semibold ${
                  selectedPeriod === "all" ? "text-background" : "text-foreground"
                }`}
              >
                전체
              </Text>
            </TouchableOpacity>
          </View>

          {/* 운동별 통계 */}
          <View>
            <Text className="text-lg font-bold text-foreground mb-4">운동별 통계</Text>
            {exerciseStats.map((stat) => (
              <View
                key={stat.exercise.id}
                className="bg-surface rounded-2xl p-6 mb-4 shadow-sm border border-border"
              >
                <View className="flex-row items-center mb-4">
                  <View className="w-12 h-12 rounded-full bg-background items-center justify-center mr-4">
                    <Text className="text-2xl">{stat.exercise.icon}</Text>
                  </View>
                  <Text className="text-xl font-bold text-foreground">{stat.exercise.name}</Text>
                </View>
                <View className="flex-row justify-between">
                  <View className="flex-1 items-center">
                    <Text className="text-2xl font-bold text-primary">{stat.bestCount}</Text>
                    <Text className="text-sm text-muted mt-1">최고 기록</Text>
                  </View>
                  <View className="flex-1 items-center">
                    <Text className="text-2xl font-bold text-foreground">{stat.averageCount}</Text>
                    <Text className="text-sm text-muted mt-1">평균</Text>
                  </View>
                  <View className="flex-1 items-center">
                    <Text className="text-2xl font-bold text-foreground">{stat.workoutCount}</Text>
                    <Text className="text-sm text-muted mt-1">총 운동</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* 체력 등급 기준표 */}
          <View className="bg-surface rounded-2xl p-6 shadow-sm border border-border">
            <Text className="text-lg font-bold text-foreground mb-4">체력 등급 기준</Text>
            {fitnessLevels.map((level) => (
              <View key={level.name} className="flex-row items-center justify-between py-3 border-b border-border">
                <View className="flex-row items-center">
                  <View
                    className="w-8 h-8 rounded-full mr-3"
                    style={{ backgroundColor: level.color }}
                  />
                  <Text className="text-base font-semibold text-foreground">{level.name}</Text>
                </View>
                <View className="items-end">
                  <Text className="text-sm text-foreground">팔굽혀펴기 {level.minPushups}회</Text>
                  <Text className="text-sm text-muted">윗몸일으키기 {level.minSitups}회</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

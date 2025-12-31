import { ScrollView, Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import { useState, useMemo } from "react";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useData } from "@/lib/data-provider";

export default function HomeScreen() {
  const colors = useColors();
  const { exercises, workoutRecords, userProfile, isLoading } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // 캘린더 데이터 생성
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = currentDate.getDate();
  
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // 운동한 날짜 (임시 데이터)
  const workoutDays = [1, 3, 5, 8, 10, 12, 15, 17];
  
  // 각 운동의 최근 기록 계산
  const exercisesWithRecords = useMemo(() => {
    return exercises.map((exercise) => {
      const records = workoutRecords.filter((r) => r.exerciseId === exercise.id);
      const lastRecord = records.length > 0 ? records[0].count || 0 : 0;
      return { ...exercise, lastRecord };
    });
  }, [exercises, workoutRecords]);
  
  // 캘린더 렌더링을 위한 배열 생성
  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }
  
  const monthNames = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  if (isLoading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="text-foreground mt-4">데이터 로딩 중...</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      {/* 상단 헤더 */}
      <View className="flex-row items-center justify-between px-6 py-4 bg-background border-b border-border">
        <Text className="text-2xl font-bold text-foreground">ROK-FIT</Text>
        <View className="flex-row items-center gap-4">
          <TouchableOpacity>
            <IconSymbol name="bell.fill" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <TouchableOpacity>
            <IconSymbol name="person.circle.fill" size={32} color={colors.foreground} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1">
        <View className="p-6 gap-6">
          {/* 환영 메시지 카드 */}
          <View className="bg-surface rounded-2xl p-6 shadow-sm border border-border">
            <Text className="text-xl font-bold text-foreground mb-2">
              {userProfile?.name} {userProfile?.rank}님,
            </Text>
            <Text className="text-xl font-bold text-foreground mb-3">
              {userProfile?.targetLevel}까지 한 걸음 남았습니다!
            </Text>
            <Text className="text-sm text-muted">
              현재 상태: {userProfile?.currentLevel} 🔥 (목표 달성률 {userProfile?.achievementRate}%)
            </Text>
          </View>

          {/* 캘린더 뷰 */}
          <View className="bg-surface rounded-2xl p-6 shadow-sm border border-border">
            {/* 캘린더 헤더 */}
            <View className="flex-row items-center justify-between mb-4">
              <TouchableOpacity
                onPress={() => {
                  const newDate = new Date(year, month - 1, 1);
                  setCurrentDate(newDate);
                }}
              >
                <IconSymbol name="chevron.left" size={24} color={colors.foreground} />
              </TouchableOpacity>
              <Text className="text-xl font-bold text-foreground">
                {year}년 {monthNames[month]}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  const newDate = new Date(year, month + 1, 1);
                  setCurrentDate(newDate);
                }}
              >
                <IconSymbol name="chevron.right" size={24} color={colors.foreground} />
              </TouchableOpacity>
            </View>

            {/* 요일 헤더 */}
            <View className="flex-row mb-2">
              {dayNames.map((day, index) => (
                <View key={index} className="flex-1 items-center">
                  <Text className="text-sm text-muted font-medium">{day}</Text>
                </View>
              ))}
            </View>

            {/* 캘린더 그리드 */}
            <View className="flex-row flex-wrap">
              {calendarDays.map((day, index) => {
                const isToday = day === today;
                const hasWorkout = day && workoutDays.includes(day);
                
                return (
                  <View key={index} className="w-[14.28%] aspect-square items-center justify-center p-1">
                    {day ? (
                      <View className="w-full h-full items-center justify-center">
                        <View
                          className={`w-10 h-10 rounded-full items-center justify-center ${
                            isToday ? "bg-primary" : ""
                          }`}
                        >
                          <Text
                            className={`text-base font-medium ${
                              isToday ? "text-background" : "text-foreground"
                            }`}
                          >
                            {day}
                          </Text>
                        </View>
                        {hasWorkout && !isToday && (
                          <View className="w-1.5 h-1.5 rounded-full bg-primary mt-1" />
                        )}
                      </View>
                    ) : null}
                  </View>
                );
              })}
            </View>
          </View>

          {/* 오늘의 측정 종목 */}
          <View>
            <Text className="text-xl font-bold text-foreground mb-4">
              오늘의 측정 종목
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-4">
              {exercisesWithRecords.map((exercise, index) => (
                <View
                  key={exercise.id}
                  className="bg-surface rounded-2xl p-6 shadow-sm border border-border w-48"
                  style={{ marginLeft: index === 0 ? 0 : 16 }}
                >
                  <View className="w-16 h-16 rounded-full bg-background items-center justify-center mb-4">
                    <Text className="text-3xl">{exercise.icon}</Text>
                  </View>
                  <Text className="text-lg font-bold text-foreground mb-2">
                    {exercise.name}
                  </Text>
                  <Text className="text-sm text-muted mb-4">
                    최근 기록: {exercise.lastRecord}
                  </Text>
                  <TouchableOpacity
                    className="bg-primary rounded-full py-3 px-6 items-center active:opacity-80"
                    onPress={() => router.push(`/workout/${exercise.id}` as any)}
                  >
                    <Text className="text-background font-semibold">측정 시작</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

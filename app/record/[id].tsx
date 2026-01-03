import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useData } from "@/lib/data-provider";

export default function RecordDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const { workoutRecords, exercises, deleteWorkoutRecord } = useData();

  const record = workoutRecords.find((r) => r.id === id);
  const exercise = exercises.find((e) => e.id === record?.exerciseId);

  if (!record || !exercise) {
    return (
      <ScreenContainer className="items-center justify-center">
        <Text className="text-foreground">기록을 찾을 수 없습니다.</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 bg-primary px-6 py-3 rounded-full"
        >
          <Text className="text-background font-semibold">돌아가기</Text>
        </TouchableOpacity>
      </ScreenContainer>
    );
  }

  const handleDelete = () => {
    Alert.alert("삭제 확인", "이 기록을 삭제하시겠습니까?", [
      {
        text: "취소",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "삭제",
        onPress: async () => {
          await deleteWorkoutRecord(record.id);
          router.back();
        },
        style: "destructive",
      },
    ]);
  };

  const date = new Date(record.date);
  const formattedDate = date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return (
    <ScreenContainer>
      {/* 상단 헤더 */}
      <View className="flex-row items-center justify-between px-6 py-4 bg-background border-b border-border">
        <TouchableOpacity onPress={() => router.back()}>
          <IconSymbol name="chevron.left" size={24} color={colors.foreground} />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-foreground">기록 상세</Text>
        <TouchableOpacity onPress={handleDelete}>
          <IconSymbol name="trash.fill" size={24} color={colors.error} />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1">
        <View className="p-6 gap-6">
          {/* 운동 정보 카드 */}
          <View className="bg-surface rounded-2xl p-6 shadow-sm border border-border">
            <View className="flex-row items-center gap-4 mb-4">
              <Text className="text-4xl">{exercise.icon}</Text>
              <View className="flex-1">
                <Text className="text-2xl font-bold text-foreground">
                  {exercise.name}
                </Text>
                <Text className="text-sm text-muted">{formattedDate}</Text>
              </View>
            </View>
          </View>

          {/* 운동 결과 카드 */}
          <View className="bg-surface rounded-2xl p-6 shadow-sm border border-border">
            <Text className="text-lg font-bold text-foreground mb-6">
              운동 결과
            </Text>

            {/* 카운트 */}
            {record.count !== undefined && (
              <View className="mb-6 pb-6 border-b border-border">
                <Text className="text-sm text-muted mb-2">횟수</Text>
                <Text className="text-4xl font-bold text-primary">
                  {record.count}
                </Text>
                <Text className="text-sm text-muted mt-2">회</Text>
              </View>
            )}

            {/* 거리 */}
            {record.distance !== undefined && (
              <View className="mb-6 pb-6 border-b border-border">
                <Text className="text-sm text-muted mb-2">거리</Text>
                <Text className="text-4xl font-bold text-primary">
                  {record.distance}
                </Text>
                <Text className="text-sm text-muted mt-2">km</Text>
              </View>
            )}

            {/* 시간 */}
            {record.duration !== undefined && (
              <View className="mb-6">
                <Text className="text-sm text-muted mb-2">소요 시간</Text>
                <Text className="text-4xl font-bold text-primary">
                  {Math.floor(record.duration / 60)}:{String(record.duration % 60).padStart(2, "0")}
                </Text>
                <Text className="text-sm text-muted mt-2">분:초</Text>
              </View>
            )}
          </View>

          {/* 메모 */}
          {record.notes && (
            <View className="bg-surface rounded-2xl p-6 shadow-sm border border-border">
              <Text className="text-lg font-bold text-foreground mb-3">
                메모
              </Text>
              <Text className="text-foreground leading-relaxed">
                {record.notes}
              </Text>
            </View>
          )}

          {/* 기록 정보 */}
          <View className="bg-surface rounded-2xl p-6 shadow-sm border border-border">
            <Text className="text-lg font-bold text-foreground mb-4">
              기록 정보
            </Text>

            <View className="gap-3">
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">기록 ID</Text>
                <Text className="text-sm text-foreground font-mono">
                  {record.id.substring(0, 12)}...
                </Text>
              </View>

              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">기록 날짜</Text>
                <Text className="text-sm text-foreground">{formattedDate}</Text>
              </View>

              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">기록 시간</Text>
                <Text className="text-sm text-foreground">
                  {new Date(record.timestamp).toLocaleTimeString("ko-KR")}
                </Text>
              </View>
            </View>
          </View>

          {/* 삭제 버튼 */}
          <TouchableOpacity
            onPress={handleDelete}
            className="bg-error/10 border border-error rounded-full py-4 mb-6"
          >
            <Text className="text-error font-semibold text-center">
              기록 삭제
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

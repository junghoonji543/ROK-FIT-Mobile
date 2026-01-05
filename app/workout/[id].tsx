import { View, Text, TouchableOpacity, Alert, Platform } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useState, useEffect, useRef, useCallback } from "react";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useData } from "@/lib/data-provider";
import type { WorkoutRecord } from "@/lib/types";
import * as Haptics from "expo-haptics";

export default function WorkoutScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const { exercises, addWorkoutRecord } = useData();
  
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>("back");
  const [isActive, setIsActive] = useState(false);
  const [count, setCount] = useState(0);
  const [angle, setAngle] = useState(0);
  const [status, setStatus] = useState<"Ready" | "Down" | "Up">("Ready");
  
  const exercise = exercises.find((e) => e.id === id);
  
  // 간단한 카운팅 시뮬레이션 (실제로는 포즈 감지 필요)
  const simulateWorkout = () => {
    if (!isActive) return;
    
    // 임시: 3초마다 자동으로 카운트 증가
    const interval = setInterval(() => {
      setCount((prev) => {
        const newCount = prev + 1;
        if (Platform.OS !== "web") {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        setStatus(newCount % 2 === 0 ? "Down" : "Up");
        setAngle(newCount % 2 === 0 ? 90 : 160);
        return newCount;
      });
    }, 3000);
    
    return () => clearInterval(interval);
  };
  
  useEffect(() => {
    if (isActive) {
      return simulateWorkout();
    }
  }, [isActive]);
  
  const handleStart = () => {
    setIsActive(true);
    setCount(0);
    setStatus("Ready");
  };
  
  const handleStop = () => {
    setIsActive(false);
  };
  
  const handleReset = () => {
    setCount(0);
    setAngle(0);
    setStatus("Ready");
    setIsActive(false);
  };
  
  const handleRequestPermission = useCallback(async () => {
    try {
      // 웹 환경에서는 권한 요청 스킵
      if (Platform.OS === "web") {
        Alert.alert("알림", "웹 환경에서는 카메라 권한이 자동으로 허용됩니다.");
        return;
      }
      
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert("권한 거부", "카메라 권한이 필요합니다.");
      }
    } catch (error) {
      console.error("권한 요청 오류:", error);
      Alert.alert("오류", "권한 요청 중 오류가 발생했습니다.");
    }
  }, [requestPermission]);
  
  const handleComplete = async () => {
    if (count === 0) {
      Alert.alert("알림", "운동 기록이 없습니다.");
      return;
    }
    
    const record: WorkoutRecord = {
      id: `record-${Date.now()}`,
      exerciseId: id,
      count,
      date: new Date().toISOString().split("T")[0],
      timestamp: Date.now(),
    };
    
    await addWorkoutRecord(record);
    
    Alert.alert(
      "완료",
      `${exercise?.name} ${count}회 기록이 저장되었습니다!`,
      [{ text: "확인", onPress: () => router.back() }]
    );
  };
  
  // 웹 환경에서는 권한 확인 스킵
  if (Platform.OS !== "web") {
    if (!permission) {
      return (
        <ScreenContainer className="items-center justify-center">
          <Text className="text-foreground">카메라 권한을 확인하는 중...</Text>
        </ScreenContainer>
      );
    }
    
    if (!permission.granted) {
      return (
        <ScreenContainer className="items-center justify-center p-6">
          <Text className="text-foreground text-center mb-4">
            운동 측정을 위해 카메라 권한이 필요합니다.
          </Text>
          <TouchableOpacity
            onPress={handleRequestPermission}
            className="bg-primary px-6 py-3 rounded-full"
            style={{ paddingHorizontal: 24, paddingVertical: 12 }}
          >
            <Text className="text-background font-semibold">권한 허용</Text>
          </TouchableOpacity>
        </ScreenContainer>
      );
    }
  }
  
  return (
    <ScreenContainer edges={["top", "left", "right"]}>
      {/* 상단 헤더 */}
      <View className="flex-row items-center justify-between px-6 py-4 bg-background border-b border-border">
        <TouchableOpacity onPress={() => router.back()}>
          <IconSymbol name="chevron.left" size={24} color={colors.foreground} />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-foreground">{exercise?.name}</Text>
        <View style={{ width: 24 }} />
      </View>
      
      {/* 카메라 뷰 */}
      <View className="flex-1 bg-black">
        <CameraView
          style={{ flex: 1 }}
          facing={facing}
        >
          {/* 오버레이 정보 */}
          <View className="absolute inset-0 items-center justify-center">
            <View className="bg-black/50 rounded-2xl p-4">
              <Text className="text-white text-6xl font-bold text-center mb-2">
                {count}
              </Text>
              <Text className="text-white text-lg text-center">
                {status}
              </Text>
            </View>
          </View>
          
          {/* 하단 상태 카드 */}
          <View className="absolute bottom-0 left-0 right-0 p-6">
            <View className="flex-row gap-4 mb-4">
              <View className="flex-1 bg-surface/90 rounded-xl p-4 items-center">
                <Text className="text-muted text-sm mb-1">COUNT</Text>
                <Text className="text-foreground text-2xl font-bold">{count}</Text>
              </View>
              <View className="flex-1 bg-surface/90 rounded-xl p-4 items-center">
                <Text className="text-muted text-sm mb-1">ANGLE</Text>
                <Text className="text-foreground text-2xl font-bold">{angle}°</Text>
              </View>
              <View className="flex-1 bg-surface/90 rounded-xl p-4 items-center">
                <Text className="text-muted text-sm mb-1">STATUS</Text>
                <Text className="text-foreground text-lg font-bold">{status}</Text>
              </View>
            </View>
            
            {/* 컨트롤 버튼 */}
            <View className="flex-row gap-4">
              {!isActive ? (
                <TouchableOpacity
                  onPress={handleStart}
                  className="flex-1 bg-primary rounded-full py-4 items-center"
                >
                  <Text className="text-background font-bold text-lg">시작</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={handleStop}
                  className="flex-1 bg-error rounded-full py-4 items-center"
                >
                  <Text className="text-background font-bold text-lg">중지</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={handleReset}
                className="flex-1 bg-surface/90 rounded-full py-4 items-center"
              >
                <Text className="text-foreground font-bold text-lg">리셋</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleComplete}
                className="flex-1 bg-success rounded-full py-4 items-center"
              >
                <Text className="text-background font-bold text-lg">완료</Text>
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      </View>
    </ScreenContainer>
  );
}

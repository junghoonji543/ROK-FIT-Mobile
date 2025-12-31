import { ScrollView, Text, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";

export default function MoreScreen() {
  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-8">
          <View className="items-center gap-2">
            <Text className="text-4xl font-bold text-foreground">더보기</Text>
            <Text className="text-base text-muted text-center">
              설정 및 프로필 관리
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

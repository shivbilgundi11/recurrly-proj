import { colors, spacing } from "@/constants/theme";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { styled } from "react-native-css";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const Onboarding = () => {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/(auth)/sign-in");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.accent }}>
      <View
        style={{
          flex: 1,
          justifyContent: "space-between",
          paddingBottom: spacing[8],
        }}
      >
        <View
          style={{
            height: "80%",
            width: "100%",
            overflow: "hidden",
          }}
        >
          <Image
            source={require("@/assets/images/splash-pattern.png")}
            style={{ width: "99%", height: "100%", marginInline: "auto" }}
            contentFit="contain"
          />
        </View>

        <View
          style={{
            paddingHorizontal: spacing[6],
            alignItems: "center",
            gap: spacing[6],
          }}
        >
          <View style={{ gap: spacing[2], alignItems: "center" }}>
            <Text
              style={{
                fontSize: 32,
                fontFamily: "sans-bold",
                color: "white",
                textAlign: "center",
              }}
              numberOfLines={1}
            >
              Gain Financial Clarity
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: "sans-regular",
                color: "rgba(255, 255, 255, 0.8)",
                textAlign: "center",
              }}
            >
              Track, analyze and cancel with ease
            </Text>
          </View>

          <Pressable
            onPress={handleGetStarted}
            style={({ pressed }) => ({
              backgroundColor: "white",
              paddingVertical: spacing[4],
              paddingHorizontal: spacing[6],
              borderRadius: spacing[12],
              width: "100%",
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: 16,
                fontFamily: "sans-extrabold",
                color: colors.primary,
              }}
            >
              Get Started
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Onboarding;

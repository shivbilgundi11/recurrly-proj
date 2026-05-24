import "@/global.css";
import { Link } from "expo-router";
import { Text, View } from "react-native";
import { styled } from "react-native-css";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-background p-5">
      <Text className="text-xl font-bold text-success">
        Welcome to Nativewind!
      </Text>

      <Link
        href={"/onboarding"}
        className="mt-4 bg-primary text-white p-4 rounded"
      >
        Go to Onboarding
      </Link>

      <View>
        <Link
          href={"/(auth)/sign-in"}
          className="mt-4 bg-accent text-white p-4 rounded"
        >
          Go to Sign In
        </Link>

        <Link
          href={"/(auth)/sign-up"}
          className="mt-4 bg-accent text-white p-4 rounded"
        >
          Go to Sign Up
        </Link>
      </View>
    </SafeAreaView>
  );
}

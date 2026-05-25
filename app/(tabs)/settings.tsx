import { useClerk, useUser } from "@clerk/expo";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { styled } from "react-native-css";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const Settings = () => {
  const { signOut } = useClerk();
  const { user } = useUser();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.replace("/(auth)/sign-in");
  };

  return (
    <SafeAreaView className="flex-1 bg-background p-5 pt-8">
      <View className="gap-6">
        <View>
          <Text className="text-3xl font-sans-bold text-primary">
            Settings
          </Text>
          <Text className="mt-2 text-base font-sans-medium text-muted-foreground">
            Manage your Recurrly access.
          </Text>
        </View>

        <View className="rounded-2xl border border-border bg-card p-5">
          <Text className="text-lg font-sans-bold text-primary">
            {user?.fullName || user?.primaryEmailAddress?.emailAddress}
          </Text>
          <Text className="mt-1 text-sm font-sans-medium text-muted-foreground">
            {user?.primaryEmailAddress?.emailAddress}
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          className="items-center rounded-2xl bg-primary py-4"
          onPress={handleSignOut}
        >
          <Text className="font-sans-bold text-background">Sign out</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default Settings;

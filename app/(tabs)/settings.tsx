import { useClerk, useSession, useUser } from "@clerk/expo";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { styled } from "react-native-css";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

function formatDate(date?: Date | null) {
  return date ? dayjs(date).format("MMM D, YYYY") : "Not available";
}

function getInitials(user?: ReturnType<typeof useUser>["user"]) {
  const firstInitial = user?.firstName?.trim().charAt(0);
  const lastInitial = user?.lastName?.trim().charAt(0);

  if (firstInitial || lastInitial) {
    return `${firstInitial ?? ""}${lastInitial ?? ""}`.toUpperCase();
  }

  return (
    user?.fullName
      ?.trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join("") ||
    user?.primaryEmailAddress?.emailAddress?.charAt(0) ||
    "R"
  ).toUpperCase();
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="settings-row">
      <Text className="settings-row-label">{label}</Text>
      <Text className="settings-row-value">{value}</Text>
    </View>
  );
}

const Settings = () => {
  const { signOut } = useClerk();
  const { session } = useSession();
  const { user } = useUser();
  const router = useRouter();

  const displayName =
    user?.fullName ||
    user?.primaryEmailAddress?.emailAddress?.split("@")[0] ||
    "Recurrly user";
  const profileImageUrl = user?.hasImage ? user.imageUrl : undefined;
  const emailAddress = user?.primaryEmailAddress?.emailAddress || "Not added";
  const phoneNumber = user?.primaryPhoneNumber?.phoneNumber || "Not added";
  const joinedDate = formatDate(user?.createdAt);
  const lastActiveDate = formatDate(user?.lastSignInAt || session?.lastActiveAt);
  const emailStatus =
    user?.primaryEmailAddress?.verification?.status === "verified"
      ? "Verified"
      : "Needs verification";
  const profileStatus = user?.hasImage ? "Photo added" : "Initials avatar";

  const handleSignOut = async () => {
    await signOut();
    router.replace("/(auth)/sign-in");
  };

  const handleRefresh = async () => {
    await user?.reload();
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        contentContainerClassName="settings-content"
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text className="settings-title">Settings</Text>
          <Text className="settings-subtitle">
            Manage your profile, access, and account details.
          </Text>
        </View>

        <View className="settings-profile-card">
          {profileImageUrl ? (
            <Image
              source={{ uri: profileImageUrl }}
              className="settings-avatar"
            />
          ) : (
            <View className="settings-avatar-initials">
              <Text className="settings-avatar-initials-text">
                {getInitials(user)}
              </Text>
            </View>
          )}

          <View className="min-w-0 flex-1">
            <Text className="settings-profile-name">{displayName}</Text>
            <Text className="settings-profile-email">{emailAddress}</Text>
          </View>
        </View>

        <View className="settings-card">
          <Text className="settings-card-title">Account</Text>
          <DetailRow label="Joined" value={joinedDate} />
          <DetailRow label="Last active" value={lastActiveDate} />
          <DetailRow label="User ID" value={user?.id || "Not available"} />
        </View>

        <View className="settings-card">
          <Text className="settings-card-title">Contact</Text>
          <DetailRow label="Email" value={emailAddress} />
          <DetailRow label="Email status" value={emailStatus} />
          <DetailRow label="Phone" value={phoneNumber} />
        </View>

        <View className="settings-card">
          <Text className="settings-card-title">Security</Text>
          <DetailRow label="Session" value={session?.id ? "Active" : "Unknown"} />
          <DetailRow label="Profile image" value={profileStatus} />
          <DetailRow
            label="Password"
            value={user?.passwordEnabled ? "Enabled" : "Not enabled"}
          />
        </View>

        <View className="settings-actions">
          <Pressable
            accessibilityRole="button"
            className="settings-secondary-action"
            onPress={handleRefresh}
          >
            <Text className="settings-secondary-action-text">Refresh info</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            className="settings-sign-out"
            onPress={handleSignOut}
          >
            <Text className="settings-sign-out-text">Sign out</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;

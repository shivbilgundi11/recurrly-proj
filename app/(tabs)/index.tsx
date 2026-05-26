import CreateSubscriptionModal from "@/components/CreateSubscriptionModal";
import ListHeading from "@/components/ListHeading";
import SubscriptionCard from "@/components/SubscriptionCard";
import UpComingSubscription from "@/components/UpComingSubscription";
import {
  HOME_BALANCE,
  HOME_SUBSCRIPTIONS,
  UPCOMING_SUBSCRIPTIONS,
} from "@/constants/data";
import { icons } from "@/constants/icons";
import "@/global.css";
import { formatCurrency } from "@/lib/utils";
import { useUser } from "@clerk/expo";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { styled } from "react-native-css";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

function getUserInitials(user?: ReturnType<typeof useUser>["user"]) {
  const firstInitial = user?.firstName?.trim().charAt(0);
  const lastInitial = user?.lastName?.trim().charAt(0);

  if (firstInitial || lastInitial) {
    return `${firstInitial ?? ""}${lastInitial ?? ""}`.toUpperCase();
  }

  const nameParts = user?.fullName?.trim().split(/\s+/) ?? [];
  const nameInitials = nameParts
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("");

  return (
    nameInitials ||
    user?.primaryEmailAddress?.emailAddress?.charAt(0) ||
    "R"
  ).toUpperCase();
}

export default function App() {
  const { user } = useUser();
  const router = useRouter();
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<
    string | null
  >(null);
  const [subscriptions, setSubscriptions] =
    useState<Subscription[]>(HOME_SUBSCRIPTIONS);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const displayName =
    user?.firstName ||
    user?.primaryEmailAddress?.emailAddress?.split("@")[0] ||
    "there";

  const userInitials = getUserInitials(user);
  const profileImageUrl = user?.hasImage ? user.imageUrl : undefined;

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <CreateSubscriptionModal
        visible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        onCreate={(subscription) => {
          setSubscriptions((current) => [subscription, ...current]);
          setExpandedSubscriptionId(subscription.id);
        }}
      />

      <FlatList
        ListHeaderComponent={() => {
          return (
            <>
              <View className="home-header">
                <View className="home-user">
                  {profileImageUrl ? (
                    <Image
                      source={{ uri: profileImageUrl }}
                      className="home-avatar"
                    />
                  ) : (
                    <View className="home-avatar-initials">
                      <Text className="home-avatar-initials-text">
                        {userInitials}
                      </Text>
                    </View>
                  )}
                  <Text className="home-user-name">{displayName}</Text>
                </View>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Create subscription"
                  onPress={() => setIsCreateModalVisible(true)}
                >
                  <Image source={icons.add} className="home-add-icon" />
                </Pressable>
              </View>

              <View className="home-balance-card">
                <Text className="home-balance-label">Balance</Text>

                <View className="home-balance-row">
                  <Text className="home-balance-amount">
                    {formatCurrency(HOME_BALANCE.amount)}
                  </Text>
                  <Text className="home-balance-date">
                    {dayjs(HOME_BALANCE.nextRenewalDate).format("DD/MM")}
                  </Text>
                </View>
              </View>

              <View className="mb-1">
                <ListHeading title="Upcoming"></ListHeading>
                <FlatList
                  data={UPCOMING_SUBSCRIPTIONS}
                  renderItem={({ item }) => <UpComingSubscription {...item} />}
                  keyExtractor={(item) => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  ListEmptyComponent={
                    <Text className="home-empty-state">
                      No upcoming renewals yet.
                    </Text>
                  }
                />
              </View>

              <ListHeading
                title="All Subscriptions"
                onActionPress={() => router.push("/subscriptions")}
              />
            </>
          );
        }}
        showsVerticalScrollIndicator={false}
        data={subscriptions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            expanded={expandedSubscriptionId === item?.id}
            onPress={() =>
              setExpandedSubscriptionId((current) =>
                current === item?.id ? null : item?.id,
              )
            }
          />
        )}
        extraData={{ expandedSubscriptionId, subscriptions }}
        ItemSeparatorComponent={() => <View className="h-3" />}
        contentContainerClassName="pb-14"
      />
    </SafeAreaView>
  );
}

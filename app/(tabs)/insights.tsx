import { HOME_SUBSCRIPTIONS } from "@/constants/data";
import { colors, spacing } from "@/constants/theme";
import { formatCurrency } from "@/lib/utils";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { styled } from "react-native-css";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

interface DailySpending {
  day: string;
  amount: number;
  label: string;
}

const dailyData: DailySpending[] = [
  { day: "Mon", amount: 35, label: "Mon" },
  { day: "Tue", amount: 20, label: "Tue" },
  { day: "Wed", amount: 15, label: "Wed" },
  { day: "Thu", amount: 10, label: "Thu" },
  { day: "Fri", amount: 40, label: "Fri" },
  { day: "Sat", amount: 25, label: "Sat" },
  { day: "Sun", amount: 20, label: "Sun" },
];

const BarChart = () => {
  const maxAmount = Math.max(...dailyData.map((d) => d.amount));

  return (
    <View className="bg-card rounded-2xl p-5 mb-5">
      <Text className="text-lg font-semibold text-foreground mb-6">
        Daily Spending
      </Text>

      <View className="flex-row items-flex-end justify-between h-48 gap-2">
        {dailyData.map((data, index) => {
          const heightPercentage = (data.amount / maxAmount) * 100;
          const isHighlighted = index === 4; // Friday is highlighted

          return (
            <View key={data.day} className="flex-1 items-center">
              <View
                className="w-full rounded-md mb-3"
                style={{
                  height: `${heightPercentage}%`,
                  backgroundColor: isHighlighted
                    ? colors.accent
                    : colors.primary,
                  minHeight: 10,
                }}
              />
              <Text className="text-xs text-mutedForeground">{data.label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const ExpensesSummary = () => {
  const totalExpenses = 424.63;
  const percentageChange = 12;

  return (
    <View className="bg-card rounded-2xl p-5 mb-5">
      <View className="flex-row justify-between items-start mb-2">
        <Text className="text-lg font-semibold text-foreground">Expenses</Text>
        <View className="flex-row items-center gap-1">
          <Text className="text-sm text-success">+{percentageChange}%</Text>
        </View>
      </View>
      <Text className="text-xs text-mutedForeground mb-3">March 2026</Text>
      <Text className="text-3xl font-bold text-foreground">
        -{formatCurrency(totalExpenses)}
      </Text>
    </View>
  );
};

const HistorySection = () => {
  const recentSubscriptions = HOME_SUBSCRIPTIONS.slice(0, 3);

  return (
    <View className="mb-5">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-semibold text-foreground">History</Text>
        <Pressable>
          <Text className="text-sm text-accent font-semibold">View all</Text>
        </Pressable>
      </View>

      {recentSubscriptions.map((subscription) => (
        <Pressable
          key={subscription.id}
          className="flex-row items-center bg-card rounded-2xl p-4 mb-3"
          style={
            subscription.color ? { backgroundColor: subscription.color } : {}
          }
        >
          <View
            className="w-12 h-12 rounded-full items-center justify-center mr-4"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.1)",
            }}
          >
            <Image
              source={subscription.icon}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </View>

          <View className="flex-1">
            <Text className="font-semibold text-foreground mb-1">
              {subscription.name}
            </Text>
            <Text className="text-xs text-mutedForeground">
              {subscription.category}
            </Text>
          </View>

          <View className="items-end">
            <Text className="font-semibold text-foreground">
              {formatCurrency(subscription.price, subscription.currency)}
            </Text>
            <Text className="text-xs text-mutedForeground">per month</Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
};

const Insights = () => {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: spacing[5],
          paddingTop: spacing[5],
          paddingBottom: spacing[20],
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-6">
          <Text className="text-3xl font-bold text-foreground">
            Monthly Insights
          </Text>
          <Text className="text-sm text-mutedForeground mt-1">
            Track your spending patterns
          </Text>
        </View>

        <BarChart />
        <ExpensesSummary />
        <HistorySection />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Insights;

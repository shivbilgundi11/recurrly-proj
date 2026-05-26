import SubscriptionCard from "@/components/SubscriptionCard";
import { useSubscriptions } from "@/lib/subscriptions";
import { useMemo, useState } from "react";
import { FlatList, Keyboard, Text, TextInput, View } from "react-native";
import { styled } from "react-native-css";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const Subscriptions = () => {
  const [query, setQuery] = useState("");
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<
    string | null
  >(null);
  const { subscriptions } = useSubscriptions();

  const filteredSubscriptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) return subscriptions;

    return subscriptions.filter((subscription) => {
      const searchableText = [
        subscription.name,
        subscription.plan,
        subscription.category,
        subscription.billing,
        subscription.paymentMethod,
        subscription.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedQuery);
    });
  }, [query, subscriptions]);

  const dismissKeyboardOnScroll = () => {
    if (query.trim()) {
      Keyboard.dismiss();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <FlatList
        ListHeaderComponent={
          <View className="subscriptions-header">
            <Text className="subscriptions-title">Subscriptions</Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              className="subscriptions-search"
              onChangeText={setQuery}
              placeholder="Search subscriptions"
              placeholderTextColor="rgba(8, 17, 38, 0.45)"
              returnKeyType="search"
              selectionColor="#ea7a53"
              value={query}
            />
          </View>
        }
        ListEmptyComponent={
          <Text className="subscriptions-empty">
            No subscriptions match your search.
          </Text>
        }
        contentContainerClassName="subscriptions-list"
        data={filteredSubscriptions}
        extraData={expandedSubscriptionId}
        ItemSeparatorComponent={() => <View className="h-3" />}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        keyExtractor={(item) => item.id}
        onScrollBeginDrag={dismissKeyboardOnScroll}
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            expanded={expandedSubscriptionId === item.id}
            onPress={() =>
              setExpandedSubscriptionId((current) =>
                current === item.id ? null : item.id,
              )
            }
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default Subscriptions;

import { icons } from "@/constants/icons";
import { clsx } from "clsx";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

type Frequency = "Monthly" | "Yearly";

type CreateSubscriptionModalProps = {
  visible: boolean;
  onClose: () => void;
  onCreate: (subscription: Subscription) => void;
};

const frequencies: Frequency[] = ["Monthly", "Yearly"];

const categories = [
  "Entertainment",
  "AI Tools",
  "Developer Tools",
  "Design",
  "Productivity",
  "Cloud",
  "Music",
  "Other",
];

const categoryColors: Record<string, string> = {
  Entertainment: "#f7b7a3",
  "AI Tools": "#b8d4e3",
  "Developer Tools": "#e8def8",
  Design: "#f5c542",
  Productivity: "#b8e8d0",
  Cloud: "#a8d8f0",
  Music: "#c8e6a0",
  Other: "#f2d6b3",
};

const defaultCategory = categories[0];

const CreateSubscriptionModal = ({
  visible,
  onClose,
  onCreate,
}: CreateSubscriptionModalProps) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [frequency, setFrequency] = useState<Frequency>("Monthly");
  const [category, setCategory] = useState(defaultCategory);
  const [error, setError] = useState("");

  const numericPrice = Number.parseFloat(price);
  const canSubmit = useMemo(
    () => name.trim().length > 0 && Number.isFinite(numericPrice) && numericPrice > 0,
    [name, numericPrice],
  );

  const resetForm = () => {
    setName("");
    setPrice("");
    setFrequency("Monthly");
    setCategory(defaultCategory);
    setError("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = () => {
    const cleanName = name.trim();
    const parsedPrice = Number.parseFloat(price);

    if (!cleanName) {
      setError("Enter a subscription name.");
      return;
    }

    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      setError("Enter a positive price.");
      return;
    }

    const startDate = dayjs();
    const renewalDate =
      frequency === "Monthly" ? startDate.add(1, "month") : startDate.add(1, "year");

    onCreate({
      id: `${cleanName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${startDate.valueOf()}`,
      icon: icons.wallet,
      name: cleanName,
      category,
      status: "active",
      startDate: startDate.toISOString(),
      price: parsedPrice,
      currency: "USD",
      billing: frequency,
      renewalDate: renewalDate.toISOString(),
      color: categoryColors[category] ?? categoryColors.Other,
    });

    resetForm();
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      onRequestClose={handleClose}
      transparent
      visible={visible}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <View className="modal-overlay">
          <Pressable className="flex-1" onPress={handleClose} />

          <View className="modal-container">
            <View className="modal-header">
              <Text className="modal-title">New Subscription</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close new subscription modal"
                className="modal-close"
                onPress={handleClose}
              >
                <Text className="modal-close-text">x</Text>
              </Pressable>
            </View>

            <ScrollView
              className="modal-body"
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View className="auth-field">
                <Text className="auth-label">Name</Text>
                <TextInput
                  autoCapitalize="words"
                  className="auth-input"
                  onChangeText={(value) => {
                    setName(value);
                    setError("");
                  }}
                  placeholder="Netflix"
                  placeholderTextColor="rgba(8, 17, 38, 0.45)"
                  returnKeyType="next"
                  selectionColor="#ea7a53"
                  value={name}
                />
              </View>

              <View className="auth-field">
                <Text className="auth-label">Price</Text>
                <TextInput
                  className="auth-input"
                  keyboardType="decimal-pad"
                  onChangeText={(value) => {
                    setPrice(value);
                    setError("");
                  }}
                  placeholder="9.99"
                  placeholderTextColor="rgba(8, 17, 38, 0.45)"
                  returnKeyType="done"
                  selectionColor="#ea7a53"
                  value={price}
                />
              </View>

              <View className="auth-field">
                <Text className="auth-label">Frequency</Text>
                <View className="picker-row">
                  {frequencies.map((option) => {
                    const isActive = frequency === option;

                    return (
                      <Pressable
                        key={option}
                        accessibilityRole="button"
                        className={clsx(
                          "picker-option",
                          isActive && "picker-option-active",
                        )}
                        onPress={() => setFrequency(option)}
                      >
                        <Text
                          className={clsx(
                            "picker-option-text",
                            isActive && "picker-option-text-active",
                          )}
                        >
                          {option}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <View className="auth-field">
                <Text className="auth-label">Category</Text>
                <View className="category-scroll">
                  {categories.map((option) => {
                    const isActive = category === option;

                    return (
                      <Pressable
                        key={option}
                        accessibilityRole="button"
                        className={clsx(
                          "category-chip",
                          isActive && "category-chip-active",
                        )}
                        onPress={() => setCategory(option)}
                      >
                        <Text
                          className={clsx(
                            "category-chip-text",
                            isActive && "category-chip-text-active",
                          )}
                        >
                          {option}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {error ? <Text className="auth-error">{error}</Text> : null}

              <Pressable
                accessibilityRole="button"
                className={clsx("auth-button", !canSubmit && "auth-button-disabled")}
                onPress={handleSubmit}
              >
                <Text className="auth-button-text">Create subscription</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default CreateSubscriptionModal;

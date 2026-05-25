import { clsx } from "clsx";
import type React from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { styled } from "react-native-css";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

type AuthFieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
  placeholder: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  autoComplete?:
    | "email"
    | "password"
    | "new-password"
    | "one-time-code"
    | "username";
  textContentType?: "emailAddress" | "password" | "newPassword" | "oneTimeCode";
  returnKeyType?: "next" | "done";
  onSubmitEditing?: () => void;
};

type AuthButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary";
};

export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <SafeAreaView className="auth-safe-area">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="auth-screen"
      >
        <ScrollView
          className="auth-scroll"
          contentContainerClassName="auth-content"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="auth-brand-block">
            <View className="auth-logo-wrap">
              <View className="auth-logo-mark">
                <Text className="auth-logo-mark-text">R</Text>
              </View>
              <View>
                <Text className="auth-wordmark">Recurrly</Text>
                <Text className="auth-wordmark-sub">Smart billing</Text>
              </View>
            </View>
            <Text className="auth-title">{title}</Text>
            <Text className="auth-subtitle">{subtitle}</Text>
          </View>

          <View className="auth-card">{children}</View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export function AuthField({
  label,
  value,
  onChangeText,
  error,
  placeholder,
  secureTextEntry,
  keyboardType = "default",
  autoComplete,
  textContentType,
  returnKeyType,
  onSubmitEditing,
}: AuthFieldProps) {
  return (
    <View className="auth-field">
      <Text className="auth-label">{label}</Text>
      <TextInput
        accessibilityLabel={label}
        autoCapitalize="none"
        autoComplete={autoComplete}
        autoCorrect={false}
        className={clsx("auth-input", error && "auth-input-error")}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        placeholder={placeholder}
        placeholderTextColor="rgba(8, 17, 38, 0.45)"
        returnKeyType={returnKeyType}
        secureTextEntry={secureTextEntry}
        selectionColor="#ea7a53"
        textContentType={textContentType}
        value={value}
      />
      {error ? <Text className="auth-error">{error}</Text> : null}
    </View>
  );
}

export function AuthButton({
  label,
  onPress,
  disabled,
  loading,
  variant = "primary",
}: AuthButtonProps) {
  const isSecondary = variant === "secondary";

  return (
    <Pressable
      accessibilityRole="button"
      className={clsx(
        isSecondary ? "auth-secondary-button" : "auth-button",
        disabled && !isSecondary && "auth-button-disabled",
      )}
      disabled={disabled}
      onPress={onPress}
    >
      {loading ? (
        <ActivityIndicator color={isSecondary ? "#ea7a53" : "#081126"} />
      ) : (
        <Text
          className={
            isSecondary ? "auth-secondary-button-text" : "auth-button-text"
          }
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

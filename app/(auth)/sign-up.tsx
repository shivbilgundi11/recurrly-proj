import { AuthButton, AuthField, AuthShell } from "@/components/AuthShell";
import {
  cleanEmail,
  emailPattern,
  getAuthErrorMessage,
  goToApp,
} from "@/lib/auth";
import { useAuth, useSignUp } from "@clerk/expo";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";

type FormErrors = {
  email?: string;
  password?: string;
  confirmPassword?: string;
  code?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  phoneNumber?: string;
};

const missingFieldLabels: Record<string, string> = {
  email_address: "email address",
  first_name: "first name",
  last_name: "last name",
  legal_accepted: "terms acceptance",
  password: "password",
  phone_number: "phone number",
  username: "username",
};

function formatMissingFields(fields: string[]) {
  return fields.map((field) => missingFieldLabels[field] || field).join(", ");
}

const SignUp = () => {
  const { isSignedIn } = useAuth();
  const { signUp, errors, fetchStatus } = useSignUp();
  const router = useRouter();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [legalAccepted, setLegalAccepted] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [message, setMessage] = useState("");
  const [verificationSent, setVerificationSent] = useState(false);
  const [showMissingRequirements, setShowMissingRequirements] =
    useState(false);
  const isFetching = fetchStatus === "fetching";
  const emailForDisplay = cleanEmail(emailAddress);
  const missingFields = signUp.missingFields ?? [];

  const passwordHint = useMemo(() => {
    if (!password) return "Use at least 8 characters.";
    if (password.length < 8) return "Add a few more characters.";
    return "Strong enough to protect your billing workspace.";
  }, [password]);

  const validateSignup = () => {
    const nextErrors: FormErrors = {};
    const email = cleanEmail(emailAddress);

    if (!email) nextErrors.email = "Enter your email address.";
    else if (!emailPattern.test(email))
      nextErrors.email = "Enter a valid email address.";

    if (password.length < 8)
      nextErrors.password = "Password must be at least 8 characters.";
    if (confirmPassword !== password)
      nextErrors.confirmPassword = "Passwords must match.";

    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const finishSignUp = async () => {
    const { error } = await signUp.finalize({
      navigate: ({ session }) => {
        if (session?.currentTask) {
          goToApp(router);
          return;
        }

        goToApp(router);
      },
    });

    if (error) {
      setMessage(
        getAuthErrorMessage(error, "We could not finish your account."),
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    setMessage("");
    if (!validateSignup()) return;

    try {
      const { error } = await signUp.password({
        emailAddress: cleanEmail(emailAddress),
        password,
      });

      if (error) {
        setMessage(
          getAuthErrorMessage(error, "We could not create your account."),
        );
        return;
      }

      await signUp.verifications.sendEmailCode();
      setVerificationSent(true);
      setMessage("We sent a verification code to your email.");
    } catch (error) {
      setMessage(
        getAuthErrorMessage(error, "Something went wrong. Try again."),
      );
    }
  };

  const handleVerify = async () => {
    setMessage("");

    if (code.trim().length < 6) {
      setFormErrors({ code: "Enter the 6-digit code from your email." });
      return;
    }

    try {
      const verification = await signUp.verifications.verifyEmailCode({
        code: code.trim(),
      });
      const { error } = verification;
      const nextStatus = (verification as { status?: string }).status;

      if (error) {
        setMessage(getAuthErrorMessage(error, "That code did not work."));
        return;
      }

      if (nextStatus === "complete" || signUp.status === "complete") {
        await finishSignUp();
        return;
      }

      if (
        nextStatus === "missing_requirements" ||
        signUp.status === "missing_requirements"
      ) {
        setVerificationSent(false);
        setShowMissingRequirements(true);
        setMessage("");
        return;
      }

      await finishSignUp();
    } catch (error) {
      setMessage(getAuthErrorMessage(error, "That code did not work."));
    }
  };

  const handleCompleteAccount = async () => {
    setMessage("");

    const nextErrors: FormErrors = {};
    if (missingFields.includes("first_name") && !firstName.trim()) {
      nextErrors.firstName = "Enter your first name.";
    }
    if (missingFields.includes("last_name") && !lastName.trim()) {
      nextErrors.lastName = "Enter your last name.";
    }
    if (missingFields.includes("username") && !username.trim()) {
      nextErrors.username = "Choose a username.";
    }
    if (missingFields.includes("phone_number") && !phoneNumber.trim()) {
      nextErrors.phoneNumber = "Enter your phone number.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setFormErrors(nextErrors);
      return;
    }

    if (missingFields.includes("legal_accepted") && !legalAccepted) {
      setMessage("Accept the terms to finish creating your account.");
      return;
    }

    const updatePayload = {} as Parameters<typeof signUp.update>[0] & {
      firstName?: string;
      lastName?: string;
      legalAccepted?: boolean;
      username?: string;
    };

    if (missingFields.includes("first_name")) {
      updatePayload.firstName = firstName.trim();
    }
    if (missingFields.includes("last_name")) {
      updatePayload.lastName = lastName.trim();
    }
    if (missingFields.includes("username")) {
      updatePayload.username = username.trim();
    }
    if (missingFields.includes("phone_number")) {
      updatePayload.phoneNumber = phoneNumber.trim();
    }
    if (missingFields.includes("legal_accepted")) {
      updatePayload.legalAccepted = true;
    }

    try {
      const { error } = await signUp.update(updatePayload);

      if (error) {
        setMessage(
          getAuthErrorMessage(error, "We could not finish your account."),
        );
        return;
      }

      const finalized = await finishSignUp();
      if (finalized) {
        return;
      }

      const remainingFields = signUp.missingFields ?? [];
      if (remainingFields.length > 0) {
        setMessage(
          `Still needed: ${formatMissingFields(remainingFields)}.`,
        );
        return;
      }
    } catch (error) {
      setMessage(
        getAuthErrorMessage(error, "We could not finish your account."),
      );
    }
  };

  const handleResend = async () => {
    setMessage("");

    try {
      await signUp.verifications.sendEmailCode();
      setMessage("A fresh code is on its way.");
    } catch (error) {
      setMessage(getAuthErrorMessage(error, "We could not send a new code."));
    }
  };

  if (signUp.status === "complete" || isSignedIn) {
    return null;
  }

  if (
    showMissingRequirements ||
    (signUp.status === "missing_requirements" &&
      missingFields.length > 0 &&
      !signUp.unverifiedFields.includes("email_address"))
  ) {
    return (
      <AuthShell
        title="Complete your account"
        subtitle="Your email is verified. Add the final details to open Recurrly."
      >
        <View className="auth-form">
          {missingFields.includes("first_name") ? (
            <AuthField
              error={formErrors.firstName}
              label="First name"
              onChangeText={setFirstName}
              placeholder="Enter your first name"
              returnKeyType="next"
              value={firstName}
            />
          ) : null}
          {missingFields.includes("last_name") ? (
            <AuthField
              error={formErrors.lastName}
              label="Last name"
              onChangeText={setLastName}
              placeholder="Enter your last name"
              returnKeyType="next"
              value={lastName}
            />
          ) : null}
          {missingFields.includes("username") ? (
            <AuthField
              autoComplete="username"
              error={formErrors.username}
              label="Username"
              onChangeText={setUsername}
              placeholder="Choose a username"
              returnKeyType="done"
              value={username}
            />
          ) : null}
          {missingFields.includes("phone_number") ? (
            <AuthField
              error={formErrors.phoneNumber}
              keyboardType="phone-pad"
              label="Phone number"
              onChangeText={setPhoneNumber}
              placeholder="+1 555 000 0000"
              returnKeyType="done"
              value={phoneNumber}
            />
          ) : null}
          {missingFields.includes("legal_accepted") ? (
            <Pressable
              accessibilityRole="checkbox"
              accessibilityState={{ checked: legalAccepted }}
              className="flex-row items-center gap-3 rounded-2xl border border-border bg-background p-4"
              onPress={() => setLegalAccepted((current) => !current)}
            >
              <View
                className={`size-5 items-center justify-center rounded-md border ${
                  legalAccepted
                    ? "border-accent bg-accent"
                    : "border-muted-foreground"
                }`}
              >
                {legalAccepted ? (
                  <Text className="text-xs font-sans-extrabold text-primary">
                    ✓
                  </Text>
                ) : null}
              </View>
              <Text className="min-w-0 flex-1 text-sm font-sans-medium text-primary">
                I agree to the Terms of Service and Privacy Policy.
              </Text>
            </Pressable>
          ) : null}

          {message ? <Text className="auth-error">{message}</Text> : null}

          <AuthButton
            disabled={isFetching}
            label="Finish account"
            loading={isFetching}
            onPress={handleCompleteAccount}
          />
        </View>
      </AuthShell>
    );
  }

  if (
    verificationSent ||
    signUp.unverifiedFields.includes("email_address")
  ) {
    return (
      <AuthShell
        title="Verify your email"
        subtitle={`We sent a verification code to ${emailForDisplay}`}
      >
        <View className="auth-form">
          <AuthField
            autoComplete="one-time-code"
            error={formErrors.code || errors.fields.code?.message}
            keyboardType="numeric"
            label="Verification code"
            onChangeText={setCode}
            onSubmitEditing={handleVerify}
            placeholder="Enter 6-digit code"
            returnKeyType="done"
            textContentType="oneTimeCode"
            value={code}
          />

          {message ? <Text className="auth-helper">{message}</Text> : null}

          <AuthButton
            disabled={isFetching}
            label="Verify email"
            loading={isFetching}
            onPress={handleVerify}
          />
          <AuthButton
            disabled={isFetching}
            label="Send a new code"
            onPress={handleResend}
            variant="secondary"
          />
        </View>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Start tracking every subscription with one calm billing home."
    >
      <View className="auth-form">
        <AuthField
          autoComplete="email"
          error={formErrors.email || errors.fields.emailAddress?.message}
          keyboardType="email-address"
          label="Email"
          onChangeText={setEmailAddress}
          placeholder="Enter your email"
          returnKeyType="next"
          textContentType="emailAddress"
          value={emailAddress}
        />
        <AuthField
          autoComplete="new-password"
          error={formErrors.password || errors.fields.password?.message}
          label="Password"
          onChangeText={setPassword}
          placeholder="Create a password"
          returnKeyType="next"
          secureTextEntry
          textContentType="newPassword"
          value={password}
        />
        <Text className="auth-helper">{passwordHint}</Text>
        <AuthField
          autoComplete="new-password"
          error={formErrors.confirmPassword}
          label="Confirm password"
          onChangeText={setConfirmPassword}
          onSubmitEditing={handleSubmit}
          placeholder="Confirm your password"
          returnKeyType="done"
          secureTextEntry
          textContentType="newPassword"
          value={confirmPassword}
        />

        {message ? <Text className="auth-error">{message}</Text> : null}

        <AuthButton
          disabled={isFetching}
          label="Create account"
          loading={isFetching}
          onPress={handleSubmit}
        />

        <View className="auth-link-row">
          <Text className="auth-link-copy">Already have an account?</Text>
          <Pressable onPress={() => router.push("/(auth)/sign-in")}>
            <Text className="auth-link">Sign in</Text>
          </Pressable>
        </View>

        <View nativeID="clerk-captcha" />
      </View>
    </AuthShell>
  );
};

export default SignUp;

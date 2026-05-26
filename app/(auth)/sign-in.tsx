import { AuthButton, AuthField, AuthShell } from "@/components/AuthShell";
import {
  cleanEmail,
  emailPattern,
  getAuthErrorMessage,
  goToApp,
} from "@/lib/auth";
import { useSignIn } from "@clerk/expo";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

type FormErrors = {
  email?: string;
  password?: string;
  code?: string;
};

const SignIn = () => {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [message, setMessage] = useState("");
  const isFetching = fetchStatus === "fetching";

  const validateCredentials = () => {
    const nextErrors: FormErrors = {};
    const email = cleanEmail(emailAddress);

    if (!email) nextErrors.email = "Enter the email linked to your account.";
    else if (!emailPattern.test(email))
      nextErrors.email = "Enter a valid email address.";

    if (!password) nextErrors.password = "Enter your password.";
    else if (password.length < 8)
      nextErrors.password = "Password must be at least 8 characters.";

    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const finishSignIn = async () => {
    await signIn.finalize({
      navigate: ({ session }) => {
        if (session?.currentTask) {
          setMessage("One more account step is required before continuing.");
          return;
        }

        goToApp(router);
      },
    });
  };

  const handleSubmit = async () => {
    setMessage("");
    if (!validateCredentials()) return;

    const email = cleanEmail(emailAddress);

    try {
      const { error } = await signIn.password({
        emailAddress: email,
        password,
      });

      if (error) {
        setMessage(
          getAuthErrorMessage(error, "We could not verify those details."),
        );
        return;
      }

      if (signIn.status === "complete") {
        await finishSignIn();
        return;
      }

      if (signIn.status === "needs_client_trust") {
        const emailCodeFactor = signIn.supportedSecondFactors.find(
          (factor) => factor.strategy === "email_code",
        );

        if (emailCodeFactor) {
          await signIn.mfa.sendEmailCode();
          setMessage("We sent a security code to your email.");
          return;
        }
      }

      if (signIn.status === "needs_second_factor") {
        setMessage("Use your second security step to continue.");
        return;
      }

      setMessage("We need a little more information before continuing.");
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
      const { error } = await signIn.mfa.verifyEmailCode({
        code: code.trim(),
      });

      if (error) {
        setMessage(getAuthErrorMessage(error, "That code did not work."));
        return;
      }

      if (signIn.status === "complete") {
        await finishSignIn();
        return;
      }

      setMessage("That security check is not complete yet.");
    } catch (error) {
      setMessage(getAuthErrorMessage(error, "That code did not work."));
    }
  };

  const handleResend = async () => {
    setMessage("");

    try {
      await signIn.mfa.sendEmailCode();
      setMessage("A fresh code is on its way.");
    } catch (error) {
      setMessage(getAuthErrorMessage(error, "We could not send a new code."));
    }
  };

  if (signIn.status === "needs_client_trust") {
    return (
      <AuthShell
        title="Check your email"
        subtitle="Enter the security code we sent to continue managing your subscriptions."
      >
        <View className="auth-form">
          <AuthField
            autoComplete="one-time-code"
            error={formErrors.code || errors.fields.code?.message}
            keyboardType="numeric"
            label="Security code"
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
            label="Continue"
            loading={isFetching}
            onPress={handleVerify}
          />
          <AuthButton
            disabled={isFetching}
            label="Send a new code"
            onPress={handleResend}
            variant="secondary"
          />
          <AuthButton
            disabled={isFetching}
            label="Start over"
            onPress={() => signIn.reset()}
            variant="secondary"
          />
        </View>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to keep every renewal, charge, and plan under control."
    >
      <View className="auth-form">
        <AuthField
          autoComplete="email"
          error={formErrors.email || errors.fields.identifier?.message}
          keyboardType="email-address"
          label="Email"
          onChangeText={setEmailAddress}
          placeholder="Enter your email"
          returnKeyType="next"
          textContentType="emailAddress"
          value={emailAddress}
        />
        <AuthField
          autoComplete="password"
          error={formErrors.password || errors.fields.password?.message}
          label="Password"
          onChangeText={setPassword}
          onSubmitEditing={handleSubmit}
          placeholder="Enter your password"
          returnKeyType="done"
          secureTextEntry
          textContentType="password"
          value={password}
        />

        {message ? <Text className="auth-error">{message}</Text> : null}

        <AuthButton
          disabled={isFetching}
          label="Sign in"
          loading={isFetching}
          onPress={handleSubmit}
        />

        <View className="auth-link-row">
          <Text className="auth-link-copy">New to Recurrly?</Text>
          <Pressable onPress={() => router.push("/(auth)/sign-up")}>
            <Text className="auth-link">Create an account</Text>
          </Pressable>
        </View>
      </View>
    </AuthShell>
  );
};

export default SignIn;

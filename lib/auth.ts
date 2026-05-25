import type { Href, Router } from "expo-router";

export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function cleanEmail(value: string) {
  return value.trim().toLowerCase();
}

export function getAuthErrorMessage(error: unknown, fallback: string) {
  if (!error || typeof error !== "object") return fallback;

  const clerkError = error as {
    errors?: Array<{ longMessage?: string; message?: string }>;
    longMessage?: string;
    message?: string;
  };

  return (
    clerkError.errors?.[0]?.longMessage ||
    clerkError.errors?.[0]?.message ||
    clerkError.longMessage ||
    clerkError.message ||
    fallback
  );
}

export function goToApp(router: Router) {
  router.replace("/" as Href);
}

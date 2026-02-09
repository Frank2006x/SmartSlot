import { createAuthClient } from "better-auth/react";

const baseURL =
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000";
console.log("Auth client baseURL:", baseURL);

export const authClient = createAuthClient({
  baseURL,
});

export const { signUp, signIn, signOut, useSession, getSession } = authClient;

export const signInWithGoogle = async (callbackURL?: string) => {
  try {
    await signIn.social({
      provider: "google",
      callbackURL: callbackURL || window.location.origin + "/options",
    });
  } catch (error) {
    console.error("Google sign-in error:", error);
    throw error;
  }
};

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signInWithGoogle, useSession } from "@/lib/auth-client";

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const { data: session } = useSession();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (session?.user) {
      router.push("/options");
    }
  }, [session, router]);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError("");
      await signInWithGoogle("/options"); // Redirect to options page after login
    } catch (err) {
      console.error("Login error:", err);
      setError("Failed to sign in with Google. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div
        className="w-2/5 flex flex-col items-center justify-center gap-12 text-white
                  bg-no-repeat bg-center bg-cover"
        style={{ backgroundImage: "url('/lp_imgs/login.png')" }}
      >
        <h1 className="text-5xl font-bold">Welcome Back!</h1>
        <p className="text-xl text-center leading-relaxed">
          To keep connected with us please
          <br />
          login with your personal info
        </p>
      </div>

      <div className="w-3/5 bg-white flex flex-col items-center justify-center px-20">
        <h1 className="text-4xl font-extrabold text-[#4FC08D] mb-6">
          Create Account
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <button
          className="border border-gray-300 px-10 py-3 rounded-full flex items-center gap-3 hover:shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
        >
          <span>
            <Image
              src="/lp_contact_icons/google.png"
              alt="google"
              width={28}
              height={28}
            />
          </span>
          <span className="text-black">
            {isLoading ? "Signing in..." : "Continue with Google"}
          </span>
        </button>

        <div className="mt-10 space-y-4 text-gray-600 text-lg">
          <p>✓ Book appointments 24×7</p>
          <p>✓ Manage clients & schedules</p>
          <p>✓ Automated reminders</p>
          <p>✓ Secure & cloud-based</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";

function UserDashboard() {
  const [code, setCode] = useState("");
  const router = useRouter();
  const { data: session } = useSession();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const handleJoin = () => {
    if (code.length === 6) {
      router.push(`/user/meet?code=${code}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      {/* Avatar and Logout */}
      <div className="absolute top-4 right-4">
        <div className="relative group">
          <img
            src={session?.user?.image || "/default-avatar.png"}
            alt="User Avatar"
            className="w-10 h-10 rounded-full cursor-pointer border-2 border-white shadow-md"
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
            <div className="py-2">
              <div className="px-4 py-2 text-sm text-gray-700 border-b">
                {session?.user?.name || session?.user?.email}
              </div>
              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-[420px] bg-white rounded-3xl p-10 shadow-lg flex flex-col gap-6">
        <div className="text-center">
          <div className="flex justify-between items-center mb-4">
            <div></div>
            <h1 className="text-3xl font-bold text-emerald-400">SmartSlot</h1>
            <button
              onClick={handleSignOut}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Sign Out
            </button>
          </div>
          <p className="text-gray-500 mb-2">
            Welcome, {session?.user?.name || "User"}!
          </p>
          <p className="text-gray-500">Enter your 6-digit appointment code</p>
        </div>

        <input
          type="text"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ""))}
          placeholder="XXXXXX"
          className="
            text-center text-2xl tracking-widest
            border border-gray-300 rounded-xl
            py-4 outline-none
            focus:border-emerald-400
          "
        />

        <button
          onClick={handleJoin}
          disabled={code.length !== 6}
          className={`
            py-4 rounded-xl text-lg font-semibold
            transition
            ${
              code.length === 6
                ? "bg-emerald-400 text-white hover:bg-emerald-500"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }
          `}
        >
          Join Meet
        </button>

        <p className="text-xs text-center text-gray-400">
          Ask your service provider for the 6-digit code
        </p>
        </div>
      </div>
    </div>
  );
}

export default function UserPage() {
  return <UserDashboard />;
}

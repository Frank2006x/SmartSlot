"use client";

import { useRouter } from "next/navigation";
import { Calendar, Clock, Users, Plus, ListChecks } from "lucide-react";
import axios, { AxiosError } from "axios";
import { authClient } from "@/lib/auth-client";
import { FormEvent, useEffect, useState } from "react";

const Page = () => {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [phoneInput, setPhoneInput] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [savingPhone, setSavingPhone] = useState(false);

  useEffect(() => {
    if (!session?.user) {
      return;
    }

    const checkPhone = async () => {
      try {
        const res = await axios.get<{
          hasPhone: boolean;
          phoneNumber: string | null;
        }>("/api/phone", { withCredentials: true });

        const data = res.data;

        if (!data.hasPhone) {
          setShowPhoneModal(true);
          setPhoneInput(data.phoneNumber ?? "");
        } else {
          setShowPhoneModal(false);
        }
      } catch (error) {
        const err = error as AxiosError<{ error?: string }>;
        if (err.response?.status === 401) {
          router.push("/login");
          return;
        }
        console.error("Phone check failed", err);
      }
    };

    checkPhone();
  }, [session, router]);
  useEffect(() => {
    setTimeout(() => {
      if (!session?.user) {
        router.push("/login");
      }
    }, 1500);
  }, [session, router]);

  const handleSavePhone = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedPhone = phoneInput.trim();

    if (!trimmedPhone) {
      setPhoneError("Please enter a phone number");
      return;
    }

    setSavingPhone(true);
    setPhoneError(null);

    try {
      await axios.post(
        "/api/phone",
        { phoneNumber: trimmedPhone },
        { withCredentials: true },
      );

      setShowPhoneModal(false);
    } catch (error) {
      const err = error as AxiosError<{ error?: string }>;
      if (err.response?.status === 401) {
        router.push("/login");
        return;
      }
      const message =
        err.response?.data?.error || "Something went wrong. Please try again.";
      console.error("Failed to save phone number", err);
      setPhoneError(message);
    } finally {
      setSavingPhone(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 flex items-center justify-center p-6">
      <div className="max-w-6xl w-full">
        {showPhoneModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 space-y-4">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-gray-800">
                  Add your phone
                </h2>
                <p className="text-sm text-gray-600">
                  We use your phone number for important booking updates. Please
                  add it to continue.
                </p>
              </div>

              <form className="space-y-4" onSubmit={handleSavePhone}>
                <label className="block text-sm font-medium text-gray-700">
                  Phone number
                  <input
                    className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    value={phoneInput}
                    onChange={(event) => setPhoneInput(event.target.value)}
                    placeholder="e.g. +1 555 123 4567"
                    autoFocus
                  />
                </label>

                {phoneError && (
                  <p className="text-sm text-red-600">{phoneError}</p>
                )}

                <button
                  type="submit"
                  disabled={savingPhone}
                  className="w-full py-3 px-4 rounded-lg bg-emerald-500 text-white font-semibold hover:bg-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed transition"
                >
                  {savingPhone ? "Saving..." : "Save and continue"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to <span className="text-emerald-500">SmartSlot</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Streamline your appointment management with our professional booking
            system. Choose your role to get started.
          </p>
        </div>

        {/* Options Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Create Appointments Card */}
          <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-bl-full opacity-10"></div>

            <div className="p-8 relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-emerald-100 rounded-full">
                  <Plus className="w-6 h-6 text-emerald-600" />
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium">
                  For Businesses
                </span>
              </div>

              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                Create Appointments
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Manage your schedule, create appointment slots, and organize
                your business calendar efficiently.
              </p>

              <div className="space-y-2 mb-8">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4 text-emerald-500" />
                  <span>Schedule management</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4 text-emerald-500" />
                  <span>Time slot creation</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4 text-emerald-500" />
                  <span>Client management</span>
                </div>
              </div>

              <button
                onClick={() => router.push("/create")}
                className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Create Appointments →
              </button>
            </div>
          </div>

          {/* My Bookings Card */}
          <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-bl-full opacity-10"></div>

            <div className="p-8 relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <ListChecks className="w-6 h-6 text-blue-600" />
                </div>
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                  For Customers
                </span>
              </div>

              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                My Booked Slots
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                View all the slots you’ve booked and their current status.
              </p>

              <div className="space-y-2 mb-8">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <span>See upcoming times</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span>Status at a glance</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span>Details of each booking</span>
                </div>
              </div>

              <button
                onClick={() => router.push("/bookings")}
                className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                View My Bookings →
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-sm text-gray-500">
            Trusted by thousands of businesses worldwide
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;

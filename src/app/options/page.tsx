"use client";

import { useRouter } from "next/navigation";
import { Calendar, Clock, Users, Plus } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useEffect } from "react";

const Page = () => {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  useEffect(() => {
    if (!session?.user) {
      router.push("/login");
    }
  }, [session, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 flex items-center justify-center p-6">
      <div className="max-w-6xl w-full">
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

          {/* Book Appointments Card */}
          <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-bl-full opacity-10"></div>

            <div className="p-8 relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                  For Customers
                </span>
              </div>

              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                Book Appointments
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Find and book available appointment slots quickly and easily
                with our user-friendly interface.
              </p>

              <div className="space-y-2 mb-8">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <span>Easy booking process</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span>Real-time availability</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span>Instant confirmation</span>
                </div>
              </div>

              <button
                onClick={() => router.push("/book")}
                className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Book Appointments →
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

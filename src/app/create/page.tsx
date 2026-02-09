"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import { Search } from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";

type Appointment = {
  id: string;
  patientName: string;
  treatment: string;
  date: string;
  startTime: string;
  endTime: string;
  notes: string;
  status: string;
};

export default function AdminPage() {
  return <AdminDashboard />;
}

function AdminDashboard() {
  const router = useRouter();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const { data: session } = useSession();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("appointments") || "[]");
    setAppointments(stored);
  }, []);

  const deleteAppointment = (id: string) => {
    const updated = appointments.filter((a) => a.id !== id);
    setAppointments(updated);
    localStorage.setItem("appointments", JSON.stringify(updated));
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      <aside className="w-60 bg-white flex flex-col justify-between p-5">
        <div>
          <div className="text-2xl font-bold text-emerald-400 mb-8">
            SmartSlot
          </div>

          <button
            onClick={() => router.push("/admin/form")}
            className="bg-emerald-400 hover:bg-emerald-500 text-white font-semibold rounded-full px-4 py-2 w-full mb-8"
          >
            Create
          </button>

          <div className="text-gray-500 font-semibold">Appointments</div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col p-6 overflow-hidden">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-5">
          <div className="bg-white px-4 py-2 rounded-lg w-80 flex items-center gap-2">
            <Search size={18} />
            <input
              className="outline-none w-full"
              placeholder="Search for anything"
            />
          </div>

          {/* Avatar and Logout */}
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

        <div className="flex gap-6 mb-5">
          <div className="flex-1 bg-emerald-200 rounded-2xl p-6">
            <div className="text-2xl font-bold text-white mb-4">
              Add appointment in your schedule now
            </div>

            <button
              onClick={() => router.push("/admin/form")}
              className="bg-emerald-400 text-white px-4 py-2 rounded-lg hover:bg-emerald-500"
            >
              + Add Appointment
            </button>
          </div>

          <div className="w-72 space-y-4">
            <Stat label="Total appointments" value={appointments.length} />
            <Stat
              label="Pending"
              value={appointments.filter((a) => a.status === "Upcoming").length}
            />
            <Stat
              label="Completed"
              value={
                appointments.filter((a) => a.status === "Completed").length
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 flex-1 min-h-0">
          {/* CALENDAR */}
          <div className="bg-white rounded-xl p-6 flex flex-col">
            <div className="font-semibold mb-4">Calendar</div>

            <div className="flex-1 overflow-hidden">
              <Calendar mode="single" selected={date} onSelect={setDate} />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 flex flex-col">
            <div className="font-semibold text-lg mb-4">
              Current Appointments
            </div>

            {appointments.length === 0 ? (
              <div className="text-gray-400 text-sm">No appointments yet</div>
            ) : (
              <div className="space-y-3 overflow-hidden">
                {appointments.map((a) => (
                  <div
                    key={a.id}
                    className="border rounded-lg px-4 py-3 flex justify-between items-center hover:bg-gray-50"
                  >
                    <div>
                      <div className="font-semibold">{a.patientName}</div>
                      <div className="text-sm text-gray-400">{a.treatment}</div>
                      <div className="text-sm text-gray-500">
                        {a.startTime} – {a.endTime}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-gray-100 text-sm">
                        {a.status}
                      </span>

                      <button
                        onClick={() => router.push(`/admin/${a.id}`)}
                        className="text-emerald-500 font-semibold hover:bg-emerald-200 rounded-md p-3"
                      >
                        View
                      </button>

                      <button
                        onClick={() => deleteAppointment(a.id)}
                        className="text-red-500 font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white rounded-xl p-4">
      <div className="text-sm">{label}</div>
      <div className="text-3xl font-bold">{value}</div>
    </div>
  );
}

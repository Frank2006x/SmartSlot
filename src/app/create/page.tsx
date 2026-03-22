"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import { Search } from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";
import axios, { AxiosError } from "axios";

type FormSummary = {
  id: string;
  slug: string;
  title: string;
  startsOn: string;
  endsOn: string;
  dayStartTime: string;
  dayEndTime: string;
  timezone: string;
  isActive: boolean;
  createdAt: string;
  shareUrl?: string;
};

export default function AdminPage() {
  return <AdminDashboard />;
}

function AdminDashboard() {
  const router = useRouter();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [forms, setForms] = useState<FormSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
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
    const fetchForms = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axios.get<{ forms: FormSummary[] }>(
          "/api/appointments",
          { withCredentials: true },
        );
        setForms(data.forms ?? []);
      } catch (err) {
        const error = err as AxiosError<{ error?: string }>;
        if (error.response?.status === 401) {
          router.push("/login");
          return;
        }
        setError(error.response?.data?.error || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, [router]);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      <aside className="w-60 bg-white flex flex-col justify-between p-5">
        <div>
          <div className="text-2xl font-bold text-emerald-400 mb-8">
            SmartSlot
          </div>

          <button
            onClick={() => router.push("/create/form")}
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
              onClick={() => router.push("/create/form")}
              className="bg-emerald-400 text-white px-4 py-2 rounded-lg hover:bg-emerald-500"
            >
              + Add Appointment
            </button>
          </div>

          <div className="w-72 space-y-4">
            <Stat label="Forms" value={forms.length} />
            <Stat
              label="Active"
              value={forms.filter((f) => f.isActive).length}
            />
            <Stat
              label="Inactive"
              value={forms.filter((f) => !f.isActive).length}
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
              Your Appointment Forms
            </div>

            {loading ? (
              <div className="text-gray-400 text-sm">Loading forms…</div>
            ) : error ? (
              <div className="text-red-500 text-sm">{error}</div>
            ) : forms.length === 0 ? (
              <div className="text-gray-400 text-sm">No forms yet</div>
            ) : (
              <div className="space-y-3 overflow-hidden">
                {forms.map((form) => (
                  <div
                    key={form.id}
                    className="border rounded-lg px-4 py-3 flex justify-between items-center hover:bg-gray-50"
                  >
                    <div>
                      <div className="font-semibold">{form.title}</div>
                      <div className="text-sm text-gray-500">
                        {form.startsOn} – {form.endsOn}
                      </div>
                      <div className="text-xs text-gray-400">
                        {form.dayStartTime} – {form.dayEndTime} ({form.timezone}
                        )
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${form.isActive ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}
                      >
                        {form.isActive ? "Active" : "Inactive"}
                      </span>

                      <button
                        onClick={() =>
                          router.push(`/create/form?slug=${form.slug}`)
                        }
                        className="text-emerald-500 font-semibold hover:bg-emerald-200 rounded-md p-3"
                      >
                        Open
                      </button>

                      <button
                        onClick={async () => {
                          const url =
                            form.shareUrl ||
                            `${window.location.origin}/book?form=${form.slug}`;
                          await navigator.clipboard.writeText(url);
                          setCopiedId(form.id);
                          setTimeout(() => setCopiedId(null), 1500);
                        }}
                        className="text-emerald-600 font-semibold hover:bg-emerald-100 rounded-md p-3"
                        title="Copy share link"
                      >
                        {copiedId === form.id ? "Copied" : "Copy link"}
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

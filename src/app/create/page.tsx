"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import { Copy, LogOut, Plus, Search } from "lucide-react";
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

export default function Page() {
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
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  useEffect(() => {
    const fetchForms = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get<{ forms: FormSummary[] }>(
          "/api/appointments",
        );
        setForms(response.data?.forms ?? []);
      } catch (err) {
        const message =
          err instanceof AxiosError
            ? err.response?.data?.error || err.message
            : "Failed to load forms";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-emerald-500">
              SmartSlot
            </span>
            <span className="text-sm text-gray-400">Dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-gray-100 rounded-full px-3 py-2 text-sm text-gray-600 hidden sm:flex items-center gap-2">
              <Search size={16} className="text-gray-400" />
              <span>Find forms</span>
            </div>
            <div className="flex items-center gap-2 bg-white border rounded-full px-3 py-1 shadow-sm">
              <img
                src={session?.user?.image || "/default-avatar.png"}
                alt="User Avatar"
                className="w-8 h-8 rounded-full border"
              />
              <div className="text-xs text-gray-600 hidden sm:block">
                <div className="font-semibold text-gray-800">
                  {session?.user?.name || "User"}
                </div>
                <div className="text-gray-500">{session?.user?.email}</div>
              </div>
              <button
                onClick={handleSignOut}
                className="text-gray-500 hover:text-red-500 p-1"
                title="Sign out"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-6 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Appointment Forms
            </h1>
            <p className="text-sm text-gray-500">
              Create, share, and manage your booking links.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <Stat label="Total" value={forms.length} />
            </div>
            <button
              onClick={() => router.push("/create/form")}
              className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-white font-semibold shadow hover:bg-emerald-600"
            >
              <Plus size={18} />
              New form
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="font-semibold text-gray-800">
                Your Appointment Forms
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block"></span>
                <span>Share links to collect bookings</span>
              </div>
            </div>

            {loading ? (
              <div className="text-gray-400 text-sm">Loading forms...</div>
            ) : error ? (
              <div className="text-red-500 text-sm">{error}</div>
            ) : forms.length === 0 ? (
              <div className="text-gray-500 text-sm">
                No forms yet. Create one to get a shareable link.
              </div>
            ) : (
              <div className="space-y-3">
                {forms.map((form) => (
                  <div
                    key={form.id}
                    className="border rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:border-emerald-200 hover:bg-emerald-50/40 transition"
                  >
                    <div className="space-y-1">
                      <div className="font-semibold text-gray-900">
                        {form.title}
                      </div>
                      <div className="text-sm text-gray-600">
                        {form.startsOn} - {form.endsOn}
                      </div>
                      <div className="text-xs text-gray-500">
                        {form.dayStartTime} - {form.dayEndTime} ({form.timezone}
                        )
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          form.isActive
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {form.isActive ? "Active" : "Inactive"}
                      </span>

                      <button
                        onClick={() =>
                          router.push(`/create/form?slug=${form.slug}`)
                        }
                        className="text-emerald-600 font-semibold hover:bg-emerald-100 rounded-md px-3 py-2 text-sm"
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
                        className="inline-flex items-center gap-2 text-emerald-700 hover:bg-emerald-100 rounded-md px-3 py-2 text-sm"
                        title="Copy share link"
                      >
                        <Copy size={16} />
                        {copiedId === form.id ? "Copied" : "Copy link"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <div className="font-semibold text-gray-800 mb-4">Calendar</div>
              <Calendar mode="single" selected={date} onSelect={setDate} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Stat label="Forms" value={forms.length} />
              <Stat
                label="Active"
                value={forms.filter((f) => f.isActive).length}
              />
              <Stat
                label="Inactive"
                value={forms.filter((f) => !f.isActive).length}
              />
              <Stat
                label="Timezone"
                value={new Set(forms.map((f) => f.timezone)).size || 0}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border text-center">
      <div className="text-xs uppercase tracking-wide text-gray-500">
        {label}
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
    </div>
  );
}

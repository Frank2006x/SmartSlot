"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import { Copy, LogOut, Plus, ListChecks } from "lucide-react";
import Link from "next/link";
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

  const isFilteringByDate = Boolean(date);

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

  const filteredForms = forms.filter((form) => {
    if (!date) return true;

    const selectedStart = new Date(date);
    selectedStart.setHours(0, 0, 0, 0);
    const selectedEnd = new Date(date);
    selectedEnd.setHours(23, 59, 59, 999);

    const starts = new Date(form.startsOn);
    const ends = new Date(form.endsOn);

    if (Number.isNaN(starts.getTime()) || Number.isNaN(ends.getTime())) {
      return true;
    }

    return (
      (starts <= selectedEnd && ends >= selectedStart) ||
      starts.toDateString() === selectedStart.toDateString() ||
      ends.toDateString() === selectedStart.toDateString()
    );
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex items-center justify-between gap-6 px-6 py-4 max-w-6xl">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-2xl font-semibold text-emerald-600 transition hover:text-emerald-700"
            >
              SmartSlot
            </Link>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
              Dashboard
            </span>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-gray-600 md:flex"></nav>
          <div className="flex items-center gap-3">
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
            <button
              onClick={() => router.push("/create/form")}
              className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-white font-semibold shadow hover:bg-emerald-600"
            >
              <Plus size={19} />
              Create Appoinment
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="space-y-1">
                <div className="font-semibold text-gray-800">
                  Your Appointment Forms
                </div>
                <div className="text-xs text-gray-500">
                  {isFilteringByDate && date
                    ? `Showing forms for ${date.toLocaleDateString()}`
                    : "Showing all forms"}
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block"></span>
                <span>Share links to collect bookings</span>
                <button
                  onClick={() => setDate(undefined)}
                  className="ml-2 rounded-full border px-3 py-1 text-xs font-semibold text-gray-700 hover:border-emerald-200 hover:text-emerald-700"
                >
                  Show all
                </button>
              </div>
            </div>

            {loading ? (
              <div className="text-gray-400 text-sm">Loading forms...</div>
            ) : error ? (
              <div className="text-red-500 text-sm">{error}</div>
            ) : filteredForms.length === 0 ? (
              <div className="text-gray-500 text-sm">
                {date
                  ? "No forms match the selected date."
                  : "No forms yet. Create one to get a shareable link."}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredForms.map((form) => (
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
                          router.push(`/create/bookings?slug=${form.slug}`)
                        }
                        className="inline-flex items-center gap-1 text-emerald-700 hover:bg-emerald-100 rounded-md px-3 py-2 text-sm"
                        title="View bookings"
                      >
                        <ListChecks size={16} />
                        Bookings
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
              <div className="flex items-center justify-between mb-4">
                <div className="font-semibold text-gray-800">Calendar</div>
                <button
                  onClick={() => setDate(undefined)}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                >
                  Show all
                </button>
              </div>
              <Calendar mode="single" selected={date} onSelect={setDate} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

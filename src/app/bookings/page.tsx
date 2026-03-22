"use client";

import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { Calendar, Clock, Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import { useSession } from "@/lib/auth-client";

type Booking = {
  id: string;
  formId: string;
  slotId: string | null;
  guestName: string;
  guestEmail: string;
  guestPhone: string | null;
  startsAt: string;
  endsAt: string;
  status: string;
  formTitle: string;
  formSlug: string;
  timezone: string;
};

const formatDateTime = (value: string, timezone?: string) => {
  const d = new Date(value);
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: timezone,
  });
};

export default function BookingsPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get<{ bookings: Booking[] }>("/api/bookings/me", {
          withCredentials: true,
        });
        setBookings(res.data.bookings || []);
      } catch (err) {
        const message = err instanceof AxiosError ? err.response?.data?.error || err.message : "Failed to load bookings";
        if ((err as AxiosError)?.response?.status === 401) {
          router.push("/login");
          return;
        }
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500">Your bookings</p>
            <h1 className="text-2xl font-bold text-gray-900">Booked slots</h1>
            <p className="text-sm text-gray-500">Signed in as {session?.user?.email || "guest"}</p>
          </div>
          <button
            onClick={() => router.push("/book")}
            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
          >
            Book another slot →
          </button>
        </div>

        <div className="bg-white border rounded-2xl shadow-sm p-6">
          {loading ? (
            <div className="text-sm text-gray-500">Loading bookings...</div>
          ) : error ? (
            <div className="text-sm text-red-600">{error}</div>
          ) : bookings.length === 0 ? (
            <div className="text-sm text-gray-600">No bookings yet.</div>
          ) : (
            <div className="space-y-3">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="border rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="text-sm uppercase tracking-wide text-gray-500">{b.formTitle}</div>
                    <div className="text-base font-semibold text-gray-900">
                      {formatDateTime(b.startsAt, b.timezone)} - {formatDateTime(b.endsAt, b.timezone)}
                    </div>
                    <div className="flex gap-3 text-xs text-gray-500">
                      <span className="inline-flex items-center gap-1"><Calendar size={14} /> {b.timezone}</span>
                      <span className="inline-flex items-center gap-1 capitalize"><Clock size={14} /> {b.status}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:underline"
                      href={`/book?form=${b.formSlug}`}
                    >
                      <LinkIcon size={14} /> Open link
                    </a>
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-semibold",
                        b.status === "cancelled"
                          ? "bg-gray-100 text-gray-500"
                          : b.status === "pending"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-emerald-100 text-emerald-700",
                      )}
                    >
                      {b.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

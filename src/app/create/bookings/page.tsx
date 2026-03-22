"use client";

import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { Calendar, Clock, Mail, Phone, User, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/auth-client";

// Booking entries returned for a creator's form
// slug in searchParams identifies which form to fetch
// owner-only data: guest contact info and slot times

type FormBooking = {
  id: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string | null;
  startsAt: string;
  endsAt: string;
  status: string;
  slotId: string | null;
  slotStart: string | null;
  slotEnd: string | null;
};

const formatDateTime = (value: string | null | undefined) => {
  if (!value) return "";
  const d = new Date(value);
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

export default function CreatorBookingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const slug = searchParams.get("slug");

  const [bookings, setBookings] = useState<FormBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get<{ bookings: FormBooking[] }>(
          `/api/appointments/${slug}/bookings`,
          {
            withCredentials: true,
          },
        );
        setBookings(res.data.bookings || []);
      } catch (err) {
        const message =
          err instanceof AxiosError
            ? err.response?.data?.error || err.message
            : "Failed to load bookings";
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
  }, [router, slug]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500">Form bookings</p>
            <h1 className="text-2xl font-bold text-gray-900">Guest details</h1>
            <p className="text-sm text-gray-500">
              Signed in as {session?.user?.email || "guest"}
            </p>
            {slug ? (
              <p className="text-xs text-gray-500 mt-1">Form: {slug}</p>
            ) : (
              <p className="text-xs text-red-600 mt-1">Missing form slug</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/create")}
              className="text-sm font-semibold text-gray-600 hover:text-gray-800"
            >
              Back to dashboard
            </button>
          </div>
        </div>

        <div className="bg-white border rounded-2xl shadow-sm p-6">
          {!slug ? (
            <div className="text-sm text-red-600">
              Add ?slug=your-form-slug to view bookings.
            </div>
          ) : loading ? (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Loader2 size={16} className="animate-spin" /> Loading bookings...
            </div>
          ) : error ? (
            <div className="text-sm text-red-600">{error}</div>
          ) : bookings.length === 0 ? (
            <div className="text-sm text-gray-600">No bookings yet.</div>
          ) : (
            <div className="space-y-3">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="border rounded-xl px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-700 font-semibold">
                      <User size={14} /> {b.guestName}
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                      <span className="inline-flex items-center gap-1">
                        <Mail size={14} /> {b.guestEmail}
                      </span>
                      {b.guestPhone ? (
                        <span className="inline-flex items-center gap-1">
                          <Phone size={14} /> {b.guestPhone}
                        </span>
                      ) : null}
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      {formatDateTime(b.startsAt)} - {formatDateTime(b.endsAt)}
                    </div>
                    <div className="flex gap-3 text-xs text-gray-500">
                      <span className="inline-flex items-center gap-1 capitalize">
                        <Clock size={14} /> {b.status}
                      </span>
                      {b.slotStart ? (
                        <span className="inline-flex items-center gap-1">
                          <Calendar size={14} /> Slot:{" "}
                          {formatDateTime(b.slotStart)}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-semibold",
                        b.status === "cancelled"
                          ? "bg-gray-100 text-gray-600"
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

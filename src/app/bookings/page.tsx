"use client";

import { useEffect, useMemo, useState } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  Link as LinkIcon,
  LogOut,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { useSession, signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

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
  formDescription?: string;
  coverColor?: string;
  formStartsOn?: string;
  formEndsOn?: string;
  dayStartTime?: string;
  dayEndTime?: string;
  durationMinutes?: number;
  slotGapMinutes?: number;
  formActive?: boolean;
  creatorName?: string;
  creatorEmail?: string;
  creatorImage?: string;
};

const formatDateTime = (value: string, timezone?: string) => {
  const d = new Date(value);
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: timezone,
  });
};

const formatDuration = (start: string, end: string) => {
  const diffMs = new Date(end).getTime() - new Date(start).getTime();
  if (Number.isNaN(diffMs) || diffMs <= 0) return "--";
  const totalMinutes = Math.round(diffMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
};

const safeAccent = (color?: string) => {
  const hexRegex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
  if (!color) return "#10b981";
  return hexRegex.test(color) ? color : "#10b981";
};

export default function BookingsPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const bookingCount = useMemo(() => bookings.length, [bookings]);
  const selectedBooking = useMemo(() => {
    if (bookings.length === 0) return null;
    const found = bookings.find((b) => b.id === selectedId);
    return found || bookings[0];
  }, [bookings, selectedId]);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get<{ bookings: Booking[] }>(
          "/api/bookings/me",
          {
            withCredentials: true,
          },
        );
        const list = res.data.bookings || [];
        setBookings(list);
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
  }, [router]);

  useEffect(() => {
    if (bookings.length === 0) return;
    if (!selectedId) {
      setSelectedId(bookings[0].id);
    }
  }, [bookings, selectedId]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12 space-y-6">
        <div className="rounded-2xl border bg-white shadow-sm p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <img
              src={session?.user?.image || "/default-avatar.png"}
              alt={session?.user?.name || "Profile"}
              className="w-12 h-12 rounded-full border border-slate-200 object-cover"
            />
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">
                Your bookings
              </p>
              <h1 className="text-2xl font-bold text-slate-900">
                Booked slots
              </h1>
              <p className="text-sm text-slate-600">
                Signed in as {session?.user?.email || "guest"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              className="text-slate-600 hover:text-slate-800"
              onClick={async () => {
                try {
                  await signOut();
                  router.push("/login");
                } catch (err) {
                  console.error("Sign out failed", err);
                }
              }}
            >
              <LogOut size={16} className="mr-2" /> Sign out
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="bg-white border rounded-2xl shadow-sm p-6 text-sm text-gray-500">
            Loading bookings...
          </div>
        ) : error ? (
          <div className="bg-white border rounded-2xl shadow-sm p-6 text-sm text-red-600">
            {error}
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white border rounded-2xl shadow-sm p-8 flex flex-col items-center text-center gap-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 120 120"
              className="h-16 w-16 text-gray-300"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
            >
              <circle cx="60" cy="60" r="42" className="text-gray-200" />
              <path d="M45 80c5 4 25 4 30 0" strokeLinecap="round" />
              <path d="M45 52h.01M75 52h.01" strokeLinecap="round" />
            </svg>
            <div className="space-y-1">
              <div className="text-sm font-semibold text-gray-900">
                No bookings yet.
              </div>
              <div className="text-sm text-gray-600">
                Your confirmed bookings will appear here.
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-[320px_1fr] lg:grid-cols-[360px_1fr]">
            <div className="bg-white border rounded-2xl shadow-sm p-4 flex flex-col gap-3 max-h-[70vh] md:max-h-[75vh] overflow-auto">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>
                  {bookingCount} booking{bookingCount === 1 ? "" : "s"}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700">
                  {session?.user?.name || session?.user?.email || "You"}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {bookings.map((b) => {
                  const active = selectedBooking?.id === b.id;
                  return (
                    <button
                      key={b.id}
                      onClick={() => setSelectedId(b.id)}
                      className={cn(
                        "w-full text-left rounded-xl border px-3 py-3 flex flex-col gap-1 transition",
                        active
                          ? "bg-emerald-50 border-emerald-200 ring-1 ring-emerald-200"
                          : "bg-white border-slate-200 hover:bg-slate-50",
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold text-slate-900 line-clamp-1">
                          {b.formTitle}
                        </span>
                        <span
                          className={cn(
                            "px-2 py-1 rounded-full text-[11px] font-semibold capitalize border",
                            b.status === "cancelled"
                              ? "bg-gray-50 text-gray-600 border-gray-200"
                              : b.status === "pending"
                                ? "bg-amber-50 text-amber-800 border-amber-200"
                                : "bg-emerald-50 text-emerald-700 border-emerald-200",
                          )}
                        >
                          {b.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600">
                        {formatDateTime(b.startsAt, b.timezone)}
                      </div>
                      <div className="inline-flex items-center gap-1 text-[11px] text-slate-600">
                        <Calendar size={12} /> {b.timezone}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-white border rounded-2xl shadow-sm p-0 flex flex-col min-h-[360px] overflow-hidden">
              {!selectedBooking ? (
                <div className="text-sm text-slate-500">
                  Select a booking to view details.
                </div>
              ) : (
                <>
                  <div
                    className="px-6 py-5 flex items-start justify-between gap-3"
                    style={{
                      background: `linear-gradient(135deg, ${safeAccent(selectedBooking.coverColor)}22, ${safeAccent(selectedBooking.coverColor)})`,
                      color: "#0f172a",
                    }}
                  >
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-wide font-semibold opacity-80">
                        {selectedBooking.formTitle}
                      </p>
                      <h2 className="text-xl font-semibold">
                        {formatDateTime(
                          selectedBooking.startsAt,
                          selectedBooking.timezone,
                        )}
                      </h2>
                      <p className="text-sm opacity-80">
                        Ends{" "}
                        {formatDateTime(
                          selectedBooking.endsAt,
                          selectedBooking.timezone,
                        )}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-semibold capitalize border bg-white/70",
                        selectedBooking.status === "cancelled"
                          ? "text-gray-700 border-gray-200"
                          : selectedBooking.status === "pending"
                            ? "text-amber-800 border-amber-200"
                            : "text-emerald-700 border-emerald-200",
                      )}
                    >
                      {selectedBooking.status}
                    </span>
                  </div>

                  <div className="px-6 py-5 space-y-4">
                    <div className="grid gap-3 sm:grid-cols-2 text-sm text-slate-700">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-slate-500" />
                        <span>{selectedBooking.timezone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-slate-500" />
                        <span>
                          {formatDuration(
                            selectedBooking.startsAt,
                            selectedBooking.endsAt,
                          )}
                        </span>
                      </div>
                      {selectedBooking.formStartsOn &&
                        selectedBooking.formEndsOn && (
                          <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-slate-500" />
                            <span>
                              {selectedBooking.formStartsOn} –{" "}
                              {selectedBooking.formEndsOn}
                            </span>
                          </div>
                        )}
                      {(selectedBooking.dayStartTime ||
                        selectedBooking.dayEndTime) && (
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-slate-500" />
                          <span>
                            Daily hours: {selectedBooking.dayStartTime || "--"}{" "}
                            – {selectedBooking.dayEndTime || "--"}
                          </span>
                        </div>
                      )}
                      {(selectedBooking.durationMinutes ||
                        selectedBooking.slotGapMinutes) && (
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-slate-500" />
                          <span>
                            Slot: {selectedBooking.durationMinutes ?? "--"}m ·
                            Gap: {selectedBooking.slotGapMinutes ?? "--"}m
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <LinkIcon size={16} className="text-slate-500" />
                        <a
                          className="text-emerald-600 hover:underline"
                          href={`/book?form=${selectedBooking.formSlug}`}
                        >
                          {selectedBooking.formSlug}
                        </a>
                      </div>
                    </div>

                    <div
                      className="rounded-xl border p-3 text-sm text-slate-700 space-y-1"
                      style={{ borderColor: "#e2e8f0" }}
                    >
                      <div className="font-semibold text-slate-900">
                        Appointment overview
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Starts</span>
                        <span className="font-semibold text-slate-900">
                          {formatDateTime(
                            selectedBooking.startsAt,
                            selectedBooking.timezone,
                          )}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Ends</span>
                        <span className="font-semibold text-slate-900">
                          {formatDateTime(
                            selectedBooking.endsAt,
                            selectedBooking.timezone,
                          )}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Duration</span>
                        <span className="font-semibold text-slate-900">
                          {formatDuration(
                            selectedBooking.startsAt,
                            selectedBooking.endsAt,
                          )}
                        </span>
                      </div>
                    </div>

                    <div
                      className="rounded-xl border p-3 text-sm text-slate-700"
                      style={{ borderColor: "#e2e8f0" }}
                    >
                      <div className="font-semibold text-slate-900 mb-1">
                        Appointment details
                      </div>
                      <p className="leading-relaxed">
                        {selectedBooking.formDescription ||
                          "No additional description was provided for this appointment."}
                      </p>
                    </div>

                    <div
                      className="rounded-xl border p-3 flex flex-col gap-2 text-sm text-slate-700"
                      style={{ borderColor: "#e2e8f0" }}
                    >
                      <div className="font-semibold text-slate-900">
                        Created by
                      </div>
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            selectedBooking.creatorImage ||
                            "/default-avatar.png"
                          }
                          alt={selectedBooking.creatorName || "Creator"}
                          className="w-10 h-10 rounded-full border border-slate-200 object-cover"
                        />
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-900">
                            {selectedBooking.creatorName || "Account owner"}
                          </span>
                          <span className="text-slate-600 text-xs">
                            {selectedBooking.creatorEmail || "No email"}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-slate-500">
                        Form status:{" "}
                        {selectedBooking.formActive ? "Active" : "Inactive"}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xs text-slate-500">
                        Booking ID: {selectedBooking.id}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

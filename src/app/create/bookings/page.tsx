"use client";

import React, { useEffect, useState } from "react";
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

type Slot = {
  id: string;
  startAt: string;
  endAt: string;
  status: string;
};

type FormMeta = {
  slug: string;
  title: string;
  description?: string | null;
  startsOn?: string | null;
  endsOn?: string | null;
  dayStartTime?: string | null;
  dayEndTime?: string | null;
  timezone?: string | null;
};

const formatDateTime = (value: string | null | undefined) => {
  if (!value) return "";
  const d = new Date(value);
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const formatDate = (value: string | null | undefined) => {
  if (!value) return "";
  const d = new Date(value);
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

export default function CreatorBookingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const slug = searchParams.get("slug");

  const [bookings, setBookings] = useState<FormBooking[]>([]);
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
  const [formMeta, setFormMeta] = useState<FormMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    if (!slug) return;

    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        const [bookingsRes, slotsRes, formsRes] = await Promise.all([
          axios.get<{ bookings: FormBooking[] }>(
            `/api/appointments/${slug}/bookings`,
            {
              withCredentials: true,
            },
          ),
          axios.get<{ slots: Slot[] }>(`/api/appointments/${slug}/slots`, {
            withCredentials: true,
          }),
          axios.get<{ forms: FormMeta[] }>("/api/appointments"),
        ]);

        setBookings(bookingsRes.data.bookings || []);
        setAvailableSlots(slotsRes.data.slots || []);

        const match = (formsRes.data.forms || []).find((f) => f.slug === slug);
        if (match) setFormMeta(match);
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

  const confirmedCount = bookings.filter(
    (b) => b.status === "confirmed",
  ).length;
  const pendingCount = bookings.filter((b) => b.status === "pending").length;
  const cancelledCount = bookings.filter(
    (b) => b.status === "cancelled",
  ).length;
  const firstBookingDate = bookings[0]?.startsAt
    ? formatDate(bookings[0].startsAt)
    : null;
  const slotCount = availableSlots.length;
  const bookedCount = bookings.length;
  const openCount = availableSlots.length;

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = searchTerm
      ? `${b.guestName} ${b.guestEmail}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      : true;
    const matchesDate = dateFilter
      ? new Date(b.startsAt).toISOString().slice(0, 10) === dateFilter
      : true;
    return matchesSearch && matchesDate;
  });

  const statusTone = (status: string) => {
    if (status === "cancelled") return "bg-gray-100 text-gray-700";
    if (status === "pending") return "bg-amber-100 text-amber-800";
    return "bg-emerald-100 text-emerald-700";
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8 md:py-12 space-y-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              Live overview
              {firstBookingDate ? (
                <span className="text-[11px] text-emerald-600">
                  from {firstBookingDate}
                </span>
              ) : null}
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Slots & Guests</h1>
            <p className="text-sm text-gray-600">
              Signed in as {session?.user?.email || "guest"}
            </p>
            {slug ? (
              <p className="text-xs text-gray-500">Form: {slug}</p>
            ) : (
              <p className="text-xs text-red-600">Missing form slug</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-full border border-emerald-100 bg-white px-4 py-2 text-xs font-semibold text-emerald-700 shadow-sm">
              {slotCount} open slots
            </div>
            <button
              onClick={() => router.push("/create")}
              className="rounded-full border px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:border-emerald-200 hover:text-emerald-700"
            >
              Back to dashboard
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Appointment
            </p>
            <h2 className="mt-1 text-xl font-semibold text-gray-900">
              {formMeta?.title || "Appointment"}
            </h2>
            {formMeta?.description ? (
              <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                {formMeta.description}
              </p>
            ) : (
              <p className="mt-2 text-sm text-gray-500">
                No description provided.
              </p>
            )}
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Window
            </p>
            <div className="mt-2 space-y-1 text-sm text-gray-800">
              <div className="font-semibold text-gray-900">
                {formMeta?.startsOn || "—"} → {formMeta?.endsOn || "—"}
              </div>
              <div className="text-gray-600">
                {formMeta?.dayStartTime || "—"} - {formMeta?.dayEndTime || "—"}
                {formMeta?.timezone ? ` (${formMeta.timezone})` : ""}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Slots
              </p>
              <div className="mt-2 flex items-center gap-3 text-sm font-semibold text-gray-900">
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                  Booked {bookedCount}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-gray-700">
                  Open {openCount}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Confirmed {confirmedCount} · Pending {pendingCount} · Cancelled{" "}
                {cancelledCount}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3 space-y-4">
            <SectionCard
              title="Booked slots"
              subtitle="Guest reservations and statuses"
              loading={loading}
              error={error}
              emptyText={
                !slug
                  ? "Add ?slug=your-form-slug to view bookings."
                  : "No bookings yet."
              }
            >
              <div className="flex flex-col gap-3 rounded-2xl border bg-white p-3 shadow-sm md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search guest or email"
                    className="w-full rounded-xl border px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-emerald-400 focus:outline-none sm:w-48"
                  />
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full rounded-xl border px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-emerald-400 focus:outline-none sm:w-40"
                  />
                  {(searchTerm || dateFilter) && (
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setDateFilter("");
                      }}
                      className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              </div>

              {filteredBookings.length === 0 ? (
                <div className="rounded-xl border border-dashed px-4 py-6 text-sm text-gray-500 text-center">
                  No bookings match these filters.
                </div>
              ) : (
                filteredBookings.map((b) => (
                  <div
                    key={b.id}
                    className="border rounded-xl px-4 py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between hover:border-emerald-200 hover:bg-emerald-50/50 transition"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-800 font-semibold">
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
                        {formatDateTime(b.startsAt)} -{" "}
                        {formatDateTime(b.endsAt)}
                      </div>
                      <div className="flex flex-wrap gap-3 text-xs text-gray-500">
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
                          "px-3 py-1 rounded-full text-xs font-semibold capitalize",
                          statusTone(b.status),
                        )}
                      >
                        {b.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </SectionCard>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white border rounded-2xl shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Availability
                  </p>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Open slots
                  </h2>
                </div>
                <span className="text-xs font-semibold text-emerald-700">
                  {availableSlots.length} open
                </span>
              </div>

              {loading ? (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Loader2 size={16} className="animate-spin" /> Loading
                  slots...
                </div>
              ) : error ? (
                <div className="text-sm text-red-600">{error}</div>
              ) : availableSlots.length === 0 ? (
                <div className="text-sm text-gray-600">
                  No open slots available.
                </div>
              ) : (
                <div className="space-y-3">
                  {availableSlots.map((slot) => (
                    <div
                      key={slot.id}
                      className="border rounded-xl px-4 py-3 flex items-center justify-between hover:border-emerald-200 hover:bg-emerald-50/40 transition"
                    >
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {formatDateTime(slot.startAt)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDate(slot.startAt)}
                        </div>
                      </div>
                      <span className="text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-semibold capitalize">
                        {slot.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white border rounded-2xl shadow-sm p-4 space-y-3">
              <h3 className="text-sm font-semibold text-gray-900">
                Status legend
              </h3>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 font-semibold text-emerald-700">
                  Confirmed
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 font-semibold text-amber-800">
                  Pending
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 font-semibold text-gray-700">
                  Cancelled
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Guests see only available slots. This view shows every booked
                slot with contact details.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionCard({
  title,
  subtitle,
  loading,
  error,
  emptyText,
  children,
}: {
  title: string;
  subtitle: string;
  loading: boolean;
  error: string | null;
  emptyText: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border rounded-2xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">
            {subtitle}
          </p>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        </div>
      </div>
      {loading ? (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Loader2 size={16} className="animate-spin" /> Loading bookings...
        </div>
      ) : error ? (
        <div className="text-sm text-red-600">{error}</div>
      ) : React.Children.count(children) === 0 ? (
        <div className="text-sm text-gray-600">{emptyText}</div>
      ) : (
        <div className="space-y-3">{children}</div>
      )}
    </div>
  );
}

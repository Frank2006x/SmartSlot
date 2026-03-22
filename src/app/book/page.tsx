"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Mail,
  Phone,
  Sparkles,
  User,
} from "lucide-react";

import { signInWithGoogle, useSession, signOut } from "@/lib/auth-client";

import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FormDetails = {
  id: string;
  slug: string;
  title: string;
  description: string;
  coverColor: string;
  durationMinutes: number;
  slotGapMinutes: number;
  startsOn: string;
  endsOn: string;
  dayStartTime: string;
  dayEndTime: string;
  timezone: string;
  isActive: boolean;
  shareUrl?: string;
};

type Slot = {
  id: string;
  startAt: string;
  endAt: string;
  status: string;
};

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
};

const formatDateInput = (date: Date) => date.toISOString().slice(0, 10);

const formatDateTime = (value: string, timezone?: string) => {
  const d = new Date(value);
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: timezone,
  });
};

const formatDateOnly = (value: string, timezone?: string) => {
  const d = new Date(value);
  return d.toLocaleDateString(undefined, {
    dateStyle: "medium",
    timeZone: timezone,
  });
};

const formatTimeOnly = (value: string, timezone?: string) => {
  const d = new Date(value);
  return d.toLocaleTimeString(undefined, {
    timeStyle: "short",
    timeZone: timezone,
  });
};

const hexRegex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

const hexToRgba = (hex: string, alpha: number) => {
  const normalized = hex.replace("#", "");
  if (![3, 6].includes(normalized.length)) return `rgba(16,185,129,${alpha})`;
  const full =
    normalized.length === 3
      ? normalized
          .split("")
          .map((c) => c + c)
          .join("")
      : normalized;
  const intVal = parseInt(full, 16);
  const r = (intVal >> 16) & 255;
  const g = (intVal >> 8) & 255;
  const b = intVal & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function BookPage() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("form");
  const router = useRouter();
  const { data: session } = useSession();

  const [form, setForm] = useState<FormDetails | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);

  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<Booking | null>(null);

  const selectedSlot = useMemo(
    () => slots.find((slot) => slot.id === selectedSlotId) || null,
    [slots, selectedSlotId],
  );

  const accent = useMemo(() => {
    const color = form?.coverColor;
    return color && hexRegex.test(color) ? color : "#10b981";
  }, [form?.coverColor]);

  const accentSoft = useMemo(() => hexToRgba(accent, 0.14), [accent]);
  const accentStrong = useMemo(() => hexToRgba(accent, 0.85), [accent]);

  const isBookDisabled = useMemo(() => {
    return (
      bookingLoading ||
      !selectedSlotId ||
      !guestName.trim() ||
      !guestEmail.trim()
    );
  }, [bookingLoading, selectedSlotId, guestName, guestEmail]);

  // If this browser already booked this form, send them to their bookings view.
  useEffect(() => {
    if (!slug) return;
    try {
      const prior = localStorage.getItem(`booking_${slug}`);
      if (prior) {
        router.replace("/bookings");
      }
    } catch (err) {
      console.error("Booking redirect check failed", err);
    }
  }, [router, slug]);

  useEffect(() => {
    if (!slug) return;
    const run = async () => {
      setFormLoading(true);
      setFormError(null);
      try {
        const res = await axios.get<{ form: FormDetails }>(
          `/api/appointments/${slug}`,
        );
        setForm(res.data.form);
        if (!selectedDate) {
          setSelectedDate(new Date(res.data.form.startsOn));
        }
      } catch (err) {
        const message =
          err instanceof AxiosError
            ? err.response?.data?.error || err.message
            : "Failed to load form";
        setFormError(message);
      } finally {
        setFormLoading(false);
      }
    };
    run();
  }, [slug, selectedDate]);

  useEffect(() => {
    if (!slug || !selectedDate) return;
    const fetchSlots = async () => {
      setSlotsLoading(true);
      setSlotsError(null);
      try {
        const dateParam = formatDateInput(selectedDate);
        const res = await axios.get<{ slots: Slot[] }>(
          `/api/appointments/${slug}/slots`,
          {
            params: { date: dateParam },
          },
        );
        setSlots(res.data.slots || []);
        setSelectedSlotId(null);
      } catch (err) {
        const message =
          err instanceof AxiosError
            ? err.response?.data?.error || err.message
            : "Failed to load slots";
        setSlotsError(message);
      } finally {
        setSlotsLoading(false);
      }
    };
    fetchSlots();
  }, [slug, selectedDate]);

  useEffect(() => {
    if (session?.user) {
      setGuestName(session.user.name || "");
      setGuestEmail(session.user.email || "");
    }
  }, [session]);

  // If the signed-in user already has a booking for this form, redirect to bookings.
  useEffect(() => {
    if (!slug || !session?.user?.email) return;

    const checkExisting = async () => {
      try {
        const res = await axios.get<{ booking: Booking | null }>(
          `/api/appointments/${slug}/my-booking`,
        );
        if (res.data?.booking) {
          try {
            localStorage.setItem(`booking_${slug}`, res.data.booking.id);
          } catch (err) {
            console.error("Persisting booking flag failed", err);
          }
          router.replace("/bookings");
        }
      } catch (err) {
        if (err instanceof AxiosError && err.response?.status === 401) return;
        console.error("Existing booking lookup failed", err);
      }
    };

    checkExisting();
  }, [router, session?.user?.email, slug]);

  const handleBook = async () => {
    if (!slug || !selectedSlotId) return;
    setBookingLoading(true);
    setBookingError(null);
    setBookingSuccess(null);
    try {
      const res = await axios.post<{ booking: Booking }>(
        `/api/appointments/${slug}/book`,
        {
          guestName: guestName.trim(),
          guestEmail: guestEmail.trim(),
          guestPhone: guestPhone.trim() || undefined,
          slotId: selectedSlotId,
        },
      );
      setBookingSuccess(res.data.booking);
      try {
        localStorage.setItem(`booking_${slug}`, res.data.booking.id);
      } catch (err) {
        console.error("Persisting booking flag failed", err);
      }
    } catch (err) {
      const message =
        err instanceof AxiosError
          ? err.response?.data?.error || err.message
          : "Booking failed";
      setBookingError(message);
    } finally {
      setBookingLoading(false);
    }
  };

  const statusBadge = bookingSuccess ? (
    <div className="rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1">
      Booked
    </div>
  ) : null;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-6">
        <div
          className="rounded-2xl border bg-white shadow-sm"
          style={{ borderColor: accentSoft }}
        >
          <div className="flex flex-col gap-4 px-6 py-6 md:flex-row md:flex-wrap md:items-center md:justify-between">
            <div className="space-y-2">
              <div
                className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide"
                style={{ backgroundColor: accentSoft, color: accent }}
              >
                <Sparkles size={14} /> Booking link
              </div>
              <h1 className="text-2xl font-bold text-slate-900">
                Book an appointment
              </h1>
              <p className="text-sm text-slate-600">
                Pick a time, share your contact, and we will confirm via email.
                No account required.
              </p>
            </div>
            <div className="flex items-center gap-3">
              {session?.user ? (
                <>
                  <img
                    src={session.user.image || "/default-avatar.png"}
                    alt={session.user.name || "Profile"}
                    className="w-10 h-10 rounded-full border border-slate-200 object-cover"
                  />
                  <div className="flex flex-col text-xs text-slate-700">
                    <span className="font-semibold text-slate-900">
                      {session.user.name || "Signed in"}
                    </span>
                    <span className="text-slate-500">{session.user.email}</span>
                  </div>
                  <Button
                    variant="outline"
                    className="border-slate-200 text-slate-800 hover:bg-slate-50"
                    onClick={async () => {
                      try {
                        await signOut();
                        window.location.reload();
                      } catch (err) {
                        console.error("Sign out failed", err);
                      }
                    }}
                  >
                    Sign out
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  className="border-slate-200 text-slate-800 hover:bg-slate-50"
                  onClick={() => signInWithGoogle(window.location.href)}
                >
                  Continue with Google (optional)
                </Button>
              )}
            </div>

            {form && (
              <div
                className="border-t px-6 py-4 grid gap-3 sm:grid-cols-3 text-sm text-slate-700"
                style={{ borderColor: accentSoft }}
              >
                <div className="flex items-center gap-2">
                  <CalendarDays size={16} className="text-slate-500" />
                  <span>
                    {form.startsOn} – {form.endsOn}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-slate-500" />
                  <span>
                    {form.durationMinutes}m slot · {form.slotGapMinutes}m gap
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <User size={16} className="text-slate-500" />
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                    {form.timezone}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Close header card */}
        </div>

        {!slug && (
          <div className="bg-white border border-red-200 text-red-700 rounded-2xl p-6 text-sm shadow-sm">
            This booking link is missing a form identifier.
          </div>
        )}

        {slug && (
          <div className="grid gap-6 md:grid-cols-[minmax(0,_1.6fr)_minmax(360px,_1fr)]">
            <div className="space-y-5">
              <div
                className="bg-white border rounded-2xl p-6 shadow-sm space-y-3"
                style={{ borderColor: accentSoft }}
              >
                {formLoading ? (
                  <div className="text-sm text-gray-500">Loading form...</div>
                ) : formError ? (
                  <div className="text-sm text-red-600">{formError}</div>
                ) : !form ? (
                  <div className="text-sm text-gray-500">Form not found.</div>
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <p className="text-xs uppercase tracking-wide text-gray-500">
                          Form
                        </p>
                        <p className="text-xl font-semibold text-gray-900">
                          {form.title}
                        </p>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {form.description}
                        </p>
                      </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <CalendarDays size={16} className="text-gray-500" />
                        <span>
                          {form.startsOn} – {form.endsOn}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-gray-500" />
                        <span>
                          {form.durationMinutes}m slot · {form.slotGapMinutes}m
                          gap
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-gray-500" />
                        <span>{form.timezone}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div
                className="bg-white border rounded-2xl p-6 shadow-sm space-y-4"
                style={{ borderColor: accentSoft }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Select a slot
                    </p>
                    <p className="text-xs text-gray-500">
                      Slots are filtered by the date you pick.
                    </p>
                  </div>
                  {selectedDate && (
                    <span
                      className="rounded-full px-3 py-1 text-xs font-semibold"
                      style={{ backgroundColor: accentSoft, color: accent }}
                    >
                      {selectedDate.toISOString().slice(0, 10)}
                    </span>
                  )}
                </div>

                {slotsLoading ? (
                  <div className="text-sm text-gray-500">Loading slots...</div>
                ) : slotsError ? (
                  <div className="text-sm text-red-600">{slotsError}</div>
                ) : slots.length === 0 ? (
                  <div className="text-sm text-gray-600">
                    No available slots for this date.
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {slots.map((slot) => {
                      const isSelected = selectedSlotId === slot.id;
                      return (
                        <button
                          key={slot.id}
                          className={cn(
                            "w-full text-left rounded-xl border px-4 py-3 shadow-sm transition focus:outline-none",
                            isSelected
                              ? "ring-2 ring-offset-2"
                              : "hover:border-gray-300",
                          )}
                          style={{
                            borderColor: isSelected ? accent : accentSoft,
                            backgroundColor: isSelected ? accentSoft : "white",
                            color: isSelected ? "#0f172a" : "inherit",
                          }}
                          onClick={() => setSelectedSlotId(slot.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-semibold text-gray-900">
                              {formatDateOnly(slot.startAt, form?.timezone)}
                            </div>
                            {isSelected && (
                              <CheckCircle2
                                size={16}
                                className="text-emerald-600"
                              />
                            )}
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-600">
                            <span>
                              {formatTimeOnly(slot.startAt, form?.timezone)} –{" "}
                              {formatTimeOnly(slot.endAt, form?.timezone)}
                            </span>
                            <span className="rounded-full bg-slate-100 px-2 py-1 font-semibold text-[11px] text-slate-700">
                              {form?.timezone || "Local"}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div
                className="bg-white border rounded-2xl p-6 shadow-sm space-y-4"
                style={{ borderColor: accentSoft }}
              >
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                  <User size={16} className="text-gray-500" /> Your details
                </div>
                {selectedSlot && (
                  <div
                    className="rounded-xl border px-3 py-3 text-xs text-gray-700 flex items-center justify-between"
                    style={{
                      borderColor: accentSoft,
                      backgroundColor: accentSoft,
                    }}
                  >
                    <div className="space-y-0.5">
                      <div className="font-semibold text-gray-900">
                        Selected slot
                      </div>
                      <div>
                        {formatDateOnly(selectedSlot.startAt, form?.timezone)} ·{" "}
                        {formatTimeOnly(selectedSlot.startAt, form?.timezone)} –{" "}
                        {formatTimeOnly(selectedSlot.endAt, form?.timezone)}
                      </div>
                    </div>
                    <span
                      className="rounded-full bg-white/70 px-3 py-1 text-[11px] font-semibold text-slate-700 border"
                      style={{ borderColor: accentSoft }}
                    >
                      {form?.timezone || "Local"}
                    </span>
                  </div>
                )}
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-600">Name</label>
                    <input
                      className="border rounded-lg px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="Your name"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-600">Email</label>
                    <input
                      className="border rounded-lg px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="you@example.com"
                      type="email"
                    />
                  </div>
                  <div className="flex flex-col gap-1 md:col-span-2">
                    <label className="text-xs text-gray-600">
                      Phone (optional)
                    </label>
                    <input
                      className="border rounded-lg px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      placeholder="Phone number"
                      type="tel"
                    />
                  </div>
                </div>

                {bookingError && (
                  <div className="text-sm text-red-600">{bookingError}</div>
                )}

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                  <Button
                    onClick={handleBook}
                    disabled={isBookDisabled}
                    className="px-5"
                    style={{
                      backgroundColor: isBookDisabled ? undefined : accent,
                      borderColor: accent,
                    }}
                  >
                    {bookingLoading ? "Booking..." : "Book this slot"}
                  </Button>
                  <span className="text-xs text-gray-500">
                    No login required. Google sign-in is optional for autofill.
                  </span>
                </div>

                {bookingSuccess && (
                  <div
                    className="mt-3 rounded-lg border p-3 text-sm"
                    style={{
                      borderColor: accentSoft,
                      backgroundColor: accentSoft,
                    }}
                  >
                    <div className="font-semibold text-gray-900">
                      Booking confirmed
                    </div>
                    <div className="text-gray-700">ID: {bookingSuccess.id}</div>
                    <div className="text-gray-700">
                      When:{" "}
                      {formatDateTime(bookingSuccess.startsAt, form?.timezone)}{" "}
                      – {formatDateTime(bookingSuccess.endsAt, form?.timezone)}
                    </div>
                    <div className="text-gray-700">
                      Email: {bookingSuccess.guestEmail}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div
              className="bg-white border rounded-2xl p-6 shadow-sm space-y-4 h-fit"
              style={{
                borderColor: accentSoft,
                backgroundColor: hexToRgba(accent, 0.04),
              }}
            >
              <div className="text-sm font-semibold text-gray-900">
                Pick a date
              </div>
              <Calendar
                mode="single"
                className="w-full"
                selected={selectedDate}
                onSelect={(d) => setSelectedDate(d ?? undefined)}
                disabled={(date) => {
                  if (!form) return true;
                  const start = new Date(form.startsOn);
                  const end = new Date(form.endsOn);
                  return date < start || date > end;
                }}
              />
              <div className="text-xs text-gray-600 leading-relaxed">
                Showing available slots only. Times are displayed in{" "}
                {form?.timezone || "your local timezone"}.
              </div>
              <div
                className="rounded-xl border px-3 py-3 text-xs text-gray-700 flex flex-col gap-2"
                style={{ borderColor: accentSoft }}
              >
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-gray-500" />
                  <span>Confirmation goes to your email.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-gray-500" />
                  <span>Phone is optional for reminders.</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

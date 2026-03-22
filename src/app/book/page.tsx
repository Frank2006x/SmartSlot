"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import { signInWithGoogle, useSession } from "@/lib/auth-client";

import { Calendar } from "@/components/ui/calendar";
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

export default function BookPage() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("form");
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

  const isBookDisabled = useMemo(() => {
    return (
      bookingLoading ||
      !selectedSlotId ||
      !guestName.trim() ||
      !guestEmail.trim()
    );
  }, [bookingLoading, selectedSlotId, guestName, guestEmail]);

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
      <div className="mx-auto max-w-5xl px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
          <div>
            <p className="text-sm text-gray-500">SmartSlot booking</p>
            <h1 className="text-2xl font-bold text-gray-900">
              Book an appointment
            </h1>
            <p className="text-sm text-gray-500">
              Use the shared link to pick a time.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              className="border rounded-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => signInWithGoogle(window.location.href)}
            >
              Sign in with Google (optional)
            </button>
          </div>
        </div>

        {!slug && (
          <div className="bg-white border rounded-xl p-6 text-sm text-red-600">
            This booking link is missing a form identifier.
          </div>
        )}

        {slug && (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div className="bg-white border rounded-2xl p-6 shadow-sm">
                {formLoading ? (
                  <div className="text-sm text-gray-500">Loading form...</div>
                ) : formError ? (
                  <div className="text-sm text-red-600">{formError}</div>
                ) : !form ? (
                  <div className="text-sm text-gray-500">Form not found.</div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-xs uppercase tracking-wide text-gray-500">
                          Form
                        </div>
                        <div className="text-xl font-semibold text-gray-900">
                          {form.title}
                        </div>
                        <div className="text-sm text-gray-600">
                          {form.description}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {form.startsOn} - {form.endsOn} · {form.timezone}
                        </div>
                      </div>
                      {statusBadge}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-gray-900">
                      Select a slot
                    </div>
                    <div className="text-xs text-gray-500">
                      Slots are shown for the selected date.
                    </div>
                  </div>
                  {selectedDate && (
                    <div className="text-xs text-gray-500">
                      {selectedDate.toISOString().slice(0, 10)}
                    </div>
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
                            "w-full border rounded-lg px-4 py-3 text-left transition",
                            isSelected
                              ? "border-emerald-500 bg-emerald-50"
                              : "hover:border-emerald-200",
                          )}
                          onClick={() => setSelectedSlotId(slot.id)}
                        >
                          <div className="text-sm font-semibold text-gray-900">
                            {formatDateTime(slot.startAt, form?.timezone)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatDateTime(slot.endAt, form?.timezone)}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
                <div className="text-sm font-semibold text-gray-900">
                  Your details
                </div>
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

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleBook}
                    disabled={isBookDisabled}
                    className={cn(
                      "rounded-full px-5 py-2 text-sm font-semibold text-white",
                      isBookDisabled
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-emerald-500 hover:bg-emerald-600",
                    )}
                  >
                    {bookingLoading ? "Booking..." : "Book this slot"}
                  </button>
                  <span className="text-xs text-gray-500">
                    No login required. Google sign-in is optional for autofill.
                  </span>
                </div>

                {bookingSuccess && (
                  <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
                    <div className="font-semibold">Booking confirmed</div>
                    <div>ID: {bookingSuccess.id}</div>
                    <div>
                      When:{" "}
                      {formatDateTime(bookingSuccess.startsAt, form?.timezone)}{" "}
                      - {formatDateTime(bookingSuccess.endsAt, form?.timezone)}
                    </div>
                    <div>Email: {bookingSuccess.guestEmail}</div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
              <div className="text-sm font-semibold text-gray-900">
                Pick a date
              </div>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(d) => setSelectedDate(d ?? undefined)}
                disabled={(date) => {
                  if (!form) return true;
                  const start = new Date(form.startsOn);
                  const end = new Date(form.endsOn);
                  return date < start || date > end;
                }}
              />
              <div className="text-xs text-gray-500">
                Showing available slots only. Times are shown in{" "}
                {form?.timezone || "your local timezone"}.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

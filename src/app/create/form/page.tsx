"use client";

import type { ChangeEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import {
  ArrowLeft,
  Clock3,
  Globe2,
  PaintBucket,
  Share2,
  Sparkles,
} from "lucide-react";

type Slot = {
  start: string;
  end: string;
  disabled: boolean;
};

type BlockedSlotPayload = {
  startsAt: string;
  endsAt: string;
};

const defaultTimezone =
  typeof Intl !== "undefined"
    ? Intl.DateTimeFormat().resolvedOptions().timeZone
    : "UTC";

const minutesToTime = (minutes: number) => {
  const safeMinutes = ((minutes % 1440) + 1440) % 1440;
  const hours = Math.floor(safeMinutes / 60)
    .toString()
    .padStart(2, "0");
  const mins = (safeMinutes % 60).toString().padStart(2, "0");
  return `${hours}:${mins}`;
};

const timeToMinutes = (value: string) => {
  const [h, m] = value.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
};

export default function CreateSlotPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
    title: "",
    description: "",
    coverColor: "#10b981",
    startsOn: "",
    endsOn: "",
    dayStartTime: "",
    durationMinutes: 30,
    slotGapMinutes: 0,
    slotCount: 1,
    timezone: defaultTimezone,
    isActive: true,
  });

  const [slots, setSlots] = useState<Slot[]>([]);
  const [computedEndTime, setComputedEndTime] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rawSlots = useMemo(() => {
    const startMinutes = timeToMinutes(form.dayStartTime);
    if (
      startMinutes === null ||
      form.durationMinutes <= 0 ||
      form.slotCount <= 0
    )
      return { slots: [] as Slot[], end: "" };

    const nextSlots: Slot[] = [];
    let cursor = startMinutes;
    let lastEnd = startMinutes;

    for (let i = 0; i < form.slotCount; i += 1) {
      const slotStart = cursor;
      const slotEnd = slotStart + form.durationMinutes;
      nextSlots.push({
        start: minutesToTime(slotStart),
        end: minutesToTime(slotEnd),
        disabled: false,
      });
      cursor = slotEnd + form.slotGapMinutes;
      lastEnd = slotEnd;
    }

    return { slots: nextSlots, end: minutesToTime(lastEnd) };
  }, [
    form.dayStartTime,
    form.durationMinutes,
    form.slotCount,
    form.slotGapMinutes,
  ]);

  useEffect(() => {
    setComputedEndTime(rawSlots.end);
    setSlots((prev) =>
      rawSlots.slots.map((slot) => {
        const previous = prev.find(
          (p) => p.start === slot.start && p.end === slot.end,
        );
        return previous ? { ...slot, disabled: previous.disabled } : slot;
      }),
    );
  }, [rawSlots]);

  const handleTextChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const parsed = parseInt(value || "0", 10);
    setForm((prev) => ({ ...prev, [name]: Number.isNaN(parsed) ? 0 : parsed }));
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: checked }));
  };

  const toggleSlot = (target: Slot) => {
    setSlots((prev) =>
      prev.map((slot) =>
        slot.start === target.start && slot.end === target.end
          ? { ...slot, disabled: !slot.disabled }
          : slot,
      ),
    );
  };

  const handleSubmit = async () => {
    if (
      !form.title ||
      !form.startsOn ||
      !form.dayStartTime ||
      !computedEndTime
    ) {
      alert("Please fill required fields");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const blockedSlotsPayload: BlockedSlotPayload[] = slots
        .filter((slot) => slot.disabled)
        .map((slot) => ({
          startsAt: `${form.startsOn}T${slot.start}:00`,
          endsAt: `${form.startsOn}T${slot.end}:00`,
        }));

      const { data } = await axios.post<{
        form?: { slug?: string };
      }>("/api/appointments", {
        title: form.title,
        description: form.description,
        coverColor: form.coverColor,
        durationMinutes: form.durationMinutes,
        slotGapMinutes: form.slotGapMinutes,
        slotCount: form.slotCount,
        startsOn: form.startsOn,
        endsOn: form.endsOn || form.startsOn,
        dayStartTime: form.dayStartTime,
        timezone: form.timezone,
        isActive: form.isActive,
        blockedSlots: blockedSlotsPayload,
      });

      const slug = data?.form?.slug;
      router.push("/create");
    } catch (error) {
      const err = error as AxiosError<{ error?: string }>;
      const message =
        err.response?.data?.error || err.message || "Something went wrong";
      console.error(err);
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-50 px-6 py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/60 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm">
              <Sparkles size={14} />
              Build a polished booking flow
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Create appointment form
            </h1>
            <p className="text-sm text-gray-600">
              Define your availability, preview slots, and launch a shareable
              booking link.
            </p>
          </div>
          <button
            onClick={() => router.push("/create")}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow"
          >
            <ArrowLeft size={16} />
            Back to dashboard
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <section className="rounded-2xl border border-emerald-100 bg-white/80 p-6 shadow-sm backdrop-blur">
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-800">
                <PaintBucket size={16} className="text-emerald-500" />
                Essentials
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-800">
                    Title
                  </label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleTextChange}
                    placeholder="e.g. Product walk-through"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm shadow-inner outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  />
                  <p className="text-xs text-gray-500">
                    Shown on your booking card and confirmation emails.
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-800">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleTextChange}
                    placeholder="Set expectations: agenda, duration, who should attend."
                    className="w-full h-28 resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm shadow-inner outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-800">
                    Cover color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      name="coverColor"
                      value={form.coverColor}
                      onChange={handleTextChange}
                      className="h-12 w-12 rounded-full border border-gray-200 shadow-sm"
                    />
                    <input
                      name="coverColor"
                      value={form.coverColor}
                      onChange={handleTextChange}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm shadow-inner outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                    <Globe2 size={16} className="text-emerald-500" />
                    Timezone
                  </label>
                  <input
                    name="timezone"
                    value={form.timezone}
                    onChange={handleTextChange}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-800 shadow-inner outline-none"
                    readOnly
                  />
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-emerald-100 bg-white/80 p-6 shadow-sm backdrop-blur">
              <div className="mb-4 flex items-center justify-between text-sm font-semibold text-gray-800">
                <div className="flex items-center gap-2">
                  <Clock3 size={16} className="text-emerald-500" />
                  Availability window
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="rounded-full bg-emerald-50 px-2 py-1 font-semibold text-emerald-700">
                    Auto-computes end time
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-800">
                    Starts on *
                  </label>
                  <input
                    type="date"
                    name="startsOn"
                    value={form.startsOn}
                    onChange={handleTextChange}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm shadow-inner outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-800">
                    Ends on
                  </label>
                  <input
                    type="date"
                    name="endsOn"
                    value={form.endsOn}
                    onChange={handleTextChange}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm shadow-inner outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  />
                  <p className="text-xs text-gray-500">
                    Leave blank to reuse the start date.
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-800">
                    Day start time *
                  </label>
                  <input
                    type="time"
                    name="dayStartTime"
                    value={form.dayStartTime}
                    onChange={handleTextChange}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm shadow-inner outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-800">
                    Computed day end
                  </label>
                  <input
                    type="time"
                    name="dayEndTime"
                    value={computedEndTime}
                    readOnly
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-800 shadow-inner outline-none"
                  />
                  <p className="text-xs text-gray-500">
                    Based on slot count, duration, and gaps.
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-emerald-100 bg-white/80 p-6 shadow-sm backdrop-blur">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-sm font-semibold text-gray-800">
                <span>Slot rules</span>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {[15, 30, 45, 60].map((preset) => (
                    <button
                      key={preset}
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          durationMinutes: preset,
                        }))
                      }
                      className={`rounded-full border px-3 py-1 font-semibold transition ${form.durationMinutes === preset ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-gray-200 bg-white text-gray-700 hover:border-emerald-200"}`}
                      type="button"
                    >
                      {preset}m
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-800">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    min={1}
                    name="durationMinutes"
                    value={form.durationMinutes}
                    onChange={handleNumberChange}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm shadow-inner outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  />
                  <p className="text-xs text-gray-500">
                    How long each meeting lasts.
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-800">
                    Gap between slots (minutes)
                  </label>
                  <input
                    type="number"
                    min={0}
                    name="slotGapMinutes"
                    value={form.slotGapMinutes}
                    onChange={handleNumberChange}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm shadow-inner outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  />
                  <p className="text-xs text-gray-500">
                    Buffer time to prep between meetings.
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-800">
                    Number of slots
                  </label>
                  <input
                    type="number"
                    min={1}
                    name="slotCount"
                    value={form.slotCount}
                    onChange={handleNumberChange}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm shadow-inner outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  />
                  <p className="text-xs text-gray-500">
                    Auto-generates the daily slot list.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                <div className="space-y-1">
                  <div className="text-sm font-semibold text-gray-800">
                    Form status
                  </div>
                  <p className="text-xs text-gray-500">
                    Disable to hide the booking link without deleting it.
                  </p>
                </div>
                <label className="inline-flex items-center gap-3 text-sm font-semibold text-gray-800">
                  <input
                    id="isActive"
                    type="checkbox"
                    name="isActive"
                    checked={form.isActive}
                    onChange={handleCheckboxChange}
                    className="h-5 w-5 accent-emerald-500"
                  />
                  Active
                </label>
              </div>
            </section>

            <section className="rounded-2xl border border-emerald-100 bg-white/80 p-6 shadow-sm backdrop-blur">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Available slots preview
                </h2>
                <span className="text-xs font-semibold text-emerald-700">
                  Click to disable a slot for this day
                </span>
              </div>
              {slots.length === 0 ? (
                <p className="text-sm text-gray-600">
                  Add a start time, duration, count, and buffer to see generated
                  slots.
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {slots.map((slot) => (
                    <button
                      key={`${slot.start}-${slot.end}`}
                      type="button"
                      onClick={() => toggleSlot(slot)}
                      className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition ${slot.disabled ? "border-gray-200 bg-gray-50 text-gray-500" : "border-emerald-200 bg-emerald-50 text-emerald-900 shadow-sm"}`}
                    >
                      <span className="font-semibold">
                        {slot.start} - {slot.end}
                      </span>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${slot.disabled ? "bg-gray-200 text-gray-700" : "bg-white text-emerald-700"}`}
                      >
                        {slot.disabled ? "Disabled" : "Active"}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </section>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-10">
            <div className="rounded-2xl border border-emerald-100 bg-white/80 p-5 shadow-sm backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Summary
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    Launch-ready
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${form.isActive ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-600"}`}
                >
                  {form.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="mt-4 space-y-3 text-sm text-gray-700">
                <div className="flex items-center justify-between">
                  <span>Window</span>
                  <span className="font-semibold text-gray-900">
                    {form.startsOn || "Start date"} →{" "}
                    {form.endsOn || form.startsOn || "End date"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Daily hours</span>
                  <span className="font-semibold text-gray-900">
                    {form.dayStartTime || "--:--"} -{" "}
                    {computedEndTime || "--:--"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Duration</span>
                  <span className="font-semibold text-gray-900">
                    {form.durationMinutes}m
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Gap</span>
                  <span className="font-semibold text-gray-900">
                    {form.slotGapMinutes}m
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Slots per day</span>
                  <span className="font-semibold text-gray-900">
                    {form.slotCount}
                  </span>
                </div>
              </div>
            </div>

            {error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-500 px-5 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-200 transition hover:-translate-y-0.5 hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-emerald-300"
            >
              <Share2 size={18} />
              {submitting ? "Saving..." : "Save & share"}
            </button>

            <div className="rounded-2xl border border-dashed border-emerald-200 bg-white/60 p-4 text-sm text-gray-600 shadow-sm">
              Tips
              <ul className="mt-2 space-y-1 list-disc pl-5">
                <li>Use shorter durations for quicker intro calls.</li>
                <li>Add buffers to avoid back-to-back fatigue.</li>
                <li>Disable specific slots to protect focus time.</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

"use client";

import type { ChangeEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";

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
    <div className="min-h-screen bg-emerald-200 flex items-center justify-center px-6">
      <div className="bg-white w-full max-w-6xl rounded-3xl px-5 py-8">
        <h1 className="text-3xl font-bold mb-6">Create Appointment Form</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleTextChange}
              placeholder="e.g. Consultation"
              className="w-full border rounded-xl px-4 py-3 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleTextChange}
              placeholder="Describe the service..."
              className="w-full border rounded-xl px-4 py-3 h-24 resize-none outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Cover Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                name="coverColor"
                value={form.coverColor}
                onChange={handleTextChange}
                className="h-12 w-12 rounded-full border"
              />
              <input
                name="coverColor"
                value={form.coverColor}
                onChange={handleTextChange}
                className="w-full border rounded-xl px-4 py-3 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Timezone</label>
            <input
              name="timezone"
              value={form.timezone}
              onChange={handleTextChange}
              className="w-full border rounded-xl px-4 py-3 outline-none"
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Starts On
            </label>
            <input
              type="date"
              name="startsOn"
              value={form.startsOn}
              onChange={handleTextChange}
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Ends On</label>
            <input
              type="date"
              name="endsOn"
              value={form.endsOn}
              onChange={handleTextChange}
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Day Start Time
            </label>
            <input
              type="time"
              name="dayStartTime"
              value={form.dayStartTime}
              onChange={handleTextChange}
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Computed Day End Time
            </label>
            <input
              type="time"
              name="dayEndTime"
              value={computedEndTime}
              readOnly
              className="w-full border rounded-xl px-4 py-3 bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Slot Duration (minutes)
            </label>
            <input
              type="number"
              min={1}
              name="durationMinutes"
              value={form.durationMinutes}
              onChange={handleNumberChange}
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Gap Between Slots (minutes)
            </label>
            <input
              type="number"
              min={0}
              name="slotGapMinutes"
              value={form.slotGapMinutes}
              onChange={handleNumberChange}
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Number of Slots
            </label>
            <input
              type="number"
              min={1}
              name="slotCount"
              value={form.slotCount}
              onChange={handleNumberChange}
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          <div className="flex items-center gap-3 mt-2">
            <input
              id="isActive"
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={handleCheckboxChange}
              className="h-5 w-5"
            />
            <label htmlFor="isActive" className="text-sm font-semibold">
              Form is active
            </label>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-3">Available Slots</h2>
          {slots.length === 0 ? (
            <p className="text-sm text-gray-600">
              Enter start time and slot details to see generated slots.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {slots.map((slot) => (
                <button
                  key={`${slot.start}-${slot.end}`}
                  type="button"
                  onClick={() => toggleSlot(slot)}
                  className={`flex justify-between items-center border rounded-xl px-4 py-3 text-left transition ${slot.disabled ? "bg-gray-100 border-gray-300 text-gray-500" : "bg-emerald-50 border-emerald-300"}`}
                >
                  <span>
                    {slot.start} - {slot.end}
                  </span>
                  <span className="text-xs font-semibold uppercase">
                    {slot.disabled ? "Disabled" : "Active"}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {error ? <p className="text-red-600 text-sm mt-4">{error}</p> : null}

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full bg-emerald-400 hover:bg-emerald-500 disabled:bg-emerald-300 text-white py-4 rounded-full font-semibold text-lg mt-9"
        >
          {submitting ? "Saving..." : "Save Form"}
        </button>
      </div>
    </div>
  );
}

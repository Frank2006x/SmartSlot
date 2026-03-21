import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  time,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

import { user } from "./auth-schema";

export const bookingStatusEnum = pgEnum("booking_status", [
  "pending",
  "confirmed",
  "cancelled",
]);

export const appointmentForm = pgTable(
  "appointment_form",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    coverColor: text("cover_color").notNull(),
    durationMinutes: integer("duration_minutes").notNull(),
    slotGapMinutes: integer("slot_gap_minutes").notNull(),
    startsOn: text("starts_on").notNull(),
    endsOn: text("ends_on").notNull(),
    dayStartTime: time("day_start_time").notNull(),
    dayEndTime: time("day_end_time").notNull(),
    timezone: text("timezone").notNull(),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date()),
  },
  (table) => [
    index("appointment_form_user_idx").on(table.userId),
    index("appointment_form_starts_on_idx").on(table.startsOn),
    uniqueIndex("appointment_form_user_slug_idx").on(table.userId, table.slug),
  ],
);

export const appointmentSlot = pgTable(
  "appointment_slot",
  {
    id: text("id").primaryKey(),
    formId: text("form_id")
      .notNull()
      .references(() => appointmentForm.id, { onDelete: "cascade" }),
    startAt: timestamp("start_at").notNull(),
    endAt: timestamp("end_at").notNull(),
    status: text("status").notNull().default("available"),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date()),
  },
  (table) => [
    index("appointment_slot_form_idx").on(table.formId),
    index("appointment_slot_start_idx").on(table.startAt),
  ],
);

export const appointmentBlockedSlot = pgTable(
  "appointment_blocked_slot",
  {
    id: text("id").primaryKey(),
    formId: text("form_id")
      .notNull()
      .references(() => appointmentForm.id, { onDelete: "cascade" }),
    startsAt: timestamp("starts_at").notNull(),
    endsAt: timestamp("ends_at").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("appointment_blocked_form_idx").on(table.formId),
    index("appointment_blocked_start_idx").on(table.startsAt),
  ],
);

export const appointmentBooking = pgTable(
  "appointment_booking",
  {
    id: text("id").primaryKey(),
    formId: text("form_id")
      .notNull()
      .references(() => appointmentForm.id, { onDelete: "cascade" }),
    slotId: text("slot_id").references(() => appointmentSlot.id, {
      onDelete: "set null",
    }),
    startsAt: timestamp("starts_at").notNull(),
    endsAt: timestamp("ends_at").notNull(),
    status: bookingStatusEnum("status").notNull().default("pending"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date()),
  },
  (table) => [
    index("appointment_booking_form_idx").on(table.formId),
    index("appointment_booking_start_idx").on(table.startsAt),
    index("appointment_booking_slot_idx").on(table.slotId),
  ],
);

export const appointmentFormRelations = relations(
  appointmentForm,
  ({ one, many }) => ({
    user: one(user, {
      fields: [appointmentForm.userId],
      references: [user.id],
    }),
    slots: many(appointmentSlot),
    blockedSlots: many(appointmentBlockedSlot),
    bookings: many(appointmentBooking),
  }),
);

export const appointmentSlotRelations = relations(
  appointmentSlot,
  ({ one }) => ({
    form: one(appointmentForm, {
      fields: [appointmentSlot.formId],
      references: [appointmentForm.id],
    }),
    bookings: many(appointmentBooking),
  }),
);

export const appointmentBlockedSlotRelations = relations(
  appointmentBlockedSlot,
  ({ one }) => ({
    form: one(appointmentForm, {
      fields: [appointmentBlockedSlot.formId],
      references: [appointmentForm.id],
    }),
  }),
);

export const appointmentBookingRelations = relations(
  appointmentBooking,
  ({ one }) => ({
    form: one(appointmentForm, {
      fields: [appointmentBooking.formId],
      references: [appointmentForm.id],
    }),
    slot: one(appointmentSlot, {
      fields: [appointmentBooking.slotId],
      references: [appointmentSlot.id],
    }),
  }),
);

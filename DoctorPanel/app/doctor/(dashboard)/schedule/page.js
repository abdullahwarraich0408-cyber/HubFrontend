"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Building2,
  Video,
  Copy,
  Layers,
  X
} from "lucide-react";
import { DEFAULT_SCHEDULE } from "@/features/doctor-panel/data/doctorData";
import { HospitalScheduleManager } from "@/features/doctor-panel/components/HospitalScheduleManager";
import { useDoctorPortalSchedule, useUpdateDoctorSchedule } from "@/lib/hooks/usePartnerPortal";
import { toast } from "sonner";

const TABS = [
  { id: "hospitals", label: "Hospital Locations", icon: Building2 },
  { id: "online", label: "Online Schedule", icon: Video },
];

function parseTimePart(part) {
  if (!part) return null;
  const str = String(part).trim();
  const match12 = str.match(/^(0?[1-9]|1[0-2])(?::([0-5][0-9]))?\s*(AM|PM|am|pm)$/i);
  if (match12) {
    let hours = parseInt(match12[1], 10);
    const minutes = match12[2] ? parseInt(match12[2], 10) : 0;
    const meridiem = match12[3].toUpperCase();
    if (meridiem === "PM" && hours < 12) hours += 12;
    if (meridiem === "AM" && hours === 12) hours = 0;
    return hours * 60 + minutes;
  }
  const match24 = str.match(/^([01]?[0-9]|2[0-3]):([0-5][0-9])$/);
  if (match24) {
    const hours = parseInt(match24[1], 10);
    const minutes = parseInt(match24[2], 10);
    return hours * 60 + minutes;
  }
  return null;
}

function formatMinutes(minutes) {
  const hrs24 = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const meridiem = hrs24 >= 12 ? "PM" : "AM";
  const hrs12 = hrs24 % 12 || 12;
  return `${String(hrs12).padStart(2, "0")}:${String(mins).padStart(2, "0")} ${meridiem}`;
}

export function validateAndFormatTimeSlot(rawSlot) {
  if (!rawSlot || typeof rawSlot !== "string") return null;
  const parts = rawSlot.replace(/[–—]/g, "-").split("-").map((p) => p.trim()).filter(Boolean);
  if (parts.length !== 2) return null;
  const start = parseTimePart(parts[0]);
  const end = parseTimePart(parts[1]);
  if (start == null || end == null || end <= start) return null;
  return `${formatMinutes(start)} - ${formatMinutes(end)}`;
}

export default function DoctorSchedulePage() {
  const { data: apiSchedule = [], isLoading } = useDoctorPortalSchedule();
  const updateSchedule = useUpdateDoctorSchedule();
  const [activeTab, setActiveTab] = useState("hospitals");
  const [schedule, setSchedule] = useState(DEFAULT_SCHEDULE);
  const [editingDay, setEditingDay] = useState(null);
  const [newSlot, setNewSlot] = useState("");

  useEffect(() => {
    if (apiSchedule.length > 0) {
      setSchedule(apiSchedule);
    }
  }, [apiSchedule]);

  const persistSchedule = async (next) => {
    setSchedule(next);
    try {
      await updateSchedule.mutateAsync(next);
      toast.success("Online schedule saved");
    } catch (error) {
      toast.error(error.message || "Could not save schedule");
    }
  };

  const addSlot = (day, applyToWeekdays = false) => {
    if (!newSlot.trim()) {
      toast.error("Please enter a time slot (e.g. 09:00 AM - 01:00 PM)");
      return;
    }
    const formattedSlot = validateAndFormatTimeSlot(newSlot);
    if (!formattedSlot) {
      toast.error("Invalid time format. Please use a valid format (e.g., 09:00 AM - 01:00 PM)");
      return;
    }
    const weekdayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const next = schedule.map((item) => {
      if (applyToWeekdays && weekdayNames.includes(item.day)) {
        if (item.slots.includes(formattedSlot)) return item;
        return { ...item, slots: [...item.slots, formattedSlot] };
      }
      if (item.day === day) {
        if (item.slots.includes(formattedSlot)) return item;
        return { ...item, slots: [...item.slots, formattedSlot] };
      }
      return item;
    });
    persistSchedule(next);
    setNewSlot("");
  };

  const copyDayToWeekdays = (sourceDay) => {
    const source = schedule.find((item) => item.day === sourceDay);
    if (!source?.slots?.length) {
      toast.error(`Add consultation hours to ${sourceDay} first`);
      return;
    }

    const weekdayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const next = schedule.map((item) =>
      weekdayNames.includes(item.day) ? { ...item, slots: [...source.slots] } : item
    );
    persistSchedule(next);
    toast.success(`${sourceDay}'s hours copied to weekdays (Mon–Fri)`);
  };

  const copyDayToAllDays = (sourceDay) => {
    const source = schedule.find((item) => item.day === sourceDay);
    if (!source?.slots?.length) {
      toast.error(`Add consultation hours to ${sourceDay} first`);
      return;
    }

    const next = schedule.map((item) => ({
      ...item,
      slots: [...source.slots],
    }));
    persistSchedule(next);
    toast.success(`${sourceDay}'s hours copied to all 7 days (Mon–Sun)`);
  };

  const removeSlot = (day, index) => {
    const next = schedule.map((item) =>
      item.day === day ? { ...item, slots: item.slots.filter((_, i) => i !== index) } : item
    );
    persistSchedule(next);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Schedule & Availability</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage in-person hospital days and online video consultation hours separately.
          </p>
        </div>
        {activeTab === "online" && updateSchedule.isPending && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-teal-50 border border-teal-200/80 rounded-lg text-teal-700 text-xs font-semibold">
            <Clock size={14} className="animate-spin" /> Saving schedule...
          </div>
        )}
      </div>

      {/* Segmented Tab Bar */}
      <div className="flex gap-1.5 p-1 bg-slate-200/60 rounded-xl w-fit text-xs font-semibold">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                isActive
                  ? "bg-white text-slate-900 shadow-2xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Icon size={15} className={isActive ? "text-teal-600" : "text-slate-500"} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === "hospitals" ? (
        <HospitalScheduleManager />
      ) : isLoading ? (
        <div className="text-slate-500 text-xs py-8 text-center">Loading online schedule...</div>
      ) : (
        <div className="space-y-4">
          {/* Top Actions Bar */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-slate-600">
              <strong className="text-slate-900 font-semibold">Online Video Hours</strong> — Define available time slots for virtual patient appointments.
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => copyDayToWeekdays("Monday")}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 border border-slate-200"
                title="Copy Monday's consultation hours to Tuesday through Friday only"
              >
                <Copy size={13} className="text-teal-600" />
                <span>Copy to Weekdays (Mon–Fri)</span>
              </button>
              <button
                onClick={() => copyDayToAllDays("Monday")}
                className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-900 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 border border-teal-200/80"
                title="Copy Monday's consultation hours to all 7 days of the week (Monday through Sunday)"
              >
                <Layers size={13} className="text-teal-600" />
                <span>Copy to All Days (Mon–Sun)</span>
              </button>
            </div>
          </div>

          {/* Clean Rows with Thin Dividers */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden divide-y divide-slate-100">
            {schedule.map((item) => {
              const isEditing = editingDay === item.day;
              return (
                <div
                  key={item.day}
                  className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-center gap-3 w-36 shrink-0">
                    <span className="font-bold text-sm text-slate-900">{item.day}</span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                        item.slots.length > 0
                          ? "bg-teal-50 text-teal-700 border border-teal-200/60"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {item.slots.length} slots
                    </span>
                  </div>

                  {/* Slot Pills View */}
                  <div className="flex-1 flex flex-wrap items-center gap-2">
                    {item.slots.length > 0 ? (
                      item.slots.map((slot, i) => (
                        <div
                          key={i}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 shadow-2xs group"
                        >
                          <Clock size={12} className="text-teal-600" />
                          <span>{slot}</span>
                          {isEditing && (
                            <button
                              onClick={() => removeSlot(item.day, i)}
                              className="text-slate-400 hover:text-rose-600 ml-1 transition-colors"
                              title="Remove slot"
                            >
                              <X size={13} />
                            </button>
                          )}
                        </div>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">No time slots configured</span>
                    )}
                  </div>

                  {/* Inline Slot Controls */}
                  <div className="shrink-0 flex items-center gap-2">
                    {isEditing ? (
                      <div className="flex flex-wrap items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                        <input
                          type="text"
                          placeholder="e.g. 09:00 AM - 01:00 PM"
                          value={newSlot}
                          onChange={(e) => setNewSlot(e.target.value)}
                          className="h-8 px-2.5 text-xs bg-white border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:border-teal-500 w-44"
                        />
                        <button
                          onClick={() => addSlot(item.day)}
                          className="h-8 px-3 bg-teal-700 hover:bg-teal-800 text-white rounded-md text-xs font-semibold transition-colors flex items-center gap-1"
                        >
                          <Plus size={14} /> Add
                        </button>
                        {item.slots.length > 0 && (
                          <>
                            <button
                              type="button"
                              onClick={() => copyDayToWeekdays(item.day)}
                              className="h-8 px-2.5 bg-white hover:bg-slate-100 text-slate-700 rounded-md text-[11px] font-semibold border border-slate-200 transition-colors"
                              title={`Copy ${item.day}'s schedule to all weekdays (Mon–Fri)`}
                            >
                              Apply to Weekdays
                            </button>
                            <button
                              type="button"
                              onClick={() => copyDayToAllDays(item.day)}
                              className="h-8 px-2.5 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-md text-[11px] font-semibold border border-teal-200/80 transition-colors"
                              title={`Copy ${item.day}'s schedule to all 7 days (Mon–Sun)`}
                            >
                              Apply to All 7 Days
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => setEditingDay(null)}
                          className="p-1.5 text-slate-400 hover:text-slate-700"
                          title="Done Editing"
                        >
                          <X size={15} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setEditingDay(item.day)}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors flex items-center gap-1.5"
                      >
                        <Edit2 size={13} />
                        <span>Edit Hours</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}


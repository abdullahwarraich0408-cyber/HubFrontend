"use client";

import { useEffect, useState } from "react";
import { CalendarBlank, Clock, Plus, Trash, PencilSimple, CheckCircle, Buildings, VideoCamera } from "@phosphor-icons/react";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { DEFAULT_SCHEDULE } from "@/features/doctor-panel/data/doctorData";
import { HospitalScheduleManager } from "@/features/doctor-panel/components/HospitalScheduleManager";
import { useDoctorPortalSchedule, useUpdateDoctorSchedule } from "@/lib/hooks/usePartnerPortal";
import { toast } from "sonner";

const TABS = [
  { id: "hospitals", label: "Hospital Locations", icon: Buildings },
  { id: "online", label: "Online Schedule", icon: VideoCamera },
];

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
    if (!newSlot.trim()) return;
    const normalizedSlot = newSlot.trim();
    const weekdayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const next = schedule.map((item) => {
      if (applyToWeekdays && weekdayNames.includes(item.day)) {
        if (item.slots.includes(normalizedSlot)) return item;
        return { ...item, slots: [...item.slots, normalizedSlot] };
      }
      if (item.day === day) {
        return { ...item, slots: [...item.slots, normalizedSlot] };
      }
      return item;
    });
    persistSchedule(next);
    setNewSlot("");
  };

  const copyDayToWeekdays = (sourceDay) => {
    const source = schedule.find((item) => item.day === sourceDay);
    if (!source?.slots?.length) {
      toast.error(`Add slots to ${sourceDay} first`);
      return;
    }

    const weekdayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const next = schedule.map((item) =>
      weekdayNames.includes(item.day) ? { ...item, slots: [...source.slots] } : item
    );
    persistSchedule(next);
    toast.success(`${sourceDay}'s hours copied to all weekdays`);
  };

  const removeSlot = (day, index) => {
    const next = schedule.map((item) =>
      item.day === day ? { ...item, slots: item.slots.filter((_, i) => i !== index) } : item
    );
    persistSchedule(next);
  };

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-[28px] font-heading font-extrabold text-ink-headline tracking-tight">Schedule</h1>
          <p className="text-[14px] text-neutral-500 mt-1">
            Manage in-person hospital days and your online video consultation hours separately.
          </p>
        </div>
        {activeTab === "online" && updateSchedule.isPending && (
          <div className="flex items-center gap-2 px-4 py-2 bg-brand-light border border-brand-primary/20 rounded-[10px] text-brand-primary text-[13px] font-semibold">
            Saving online schedule...
          </div>
        )}
        {activeTab === "online" && updateSchedule.isSuccess && !updateSchedule.isPending && (
          <div className="flex items-center gap-2 px-4 py-2 bg-status-success/10 border border-status-success/30 rounded-[10px] text-status-success text-[13px] font-semibold">
            <CheckCircle size={16} weight="fill" />
            Online schedule saved!
          </div>
        )}
      </div>

      <div className="flex gap-2 mb-6 p-1 bg-neutral-100 rounded-[12px] w-fit">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-[10px] text-[13px] font-semibold transition-all ${
                isActive
                  ? "bg-white text-brand-primary shadow-sm"
                  : "text-neutral-500 hover:text-ink-headline"
              }`}
            >
              <Icon size={16} weight={isActive ? "fill" : "regular"} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "hospitals" ? (
        <HospitalScheduleManager />
      ) : isLoading ? (
        <div className="text-neutral-500 text-sm">Loading online schedule...</div>
      ) : (
        <>
          <p className="text-[13px] text-neutral-500 mb-4">
            These hours apply to <strong>online video consultations</strong> only. In-person patients book
            through your hospital locations.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {schedule.map((item) => (
              <div key={item.day} className="bg-white rounded-[16px] border border-neutral-200 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[10px] bg-brand-light flex items-center justify-center text-brand-primary">
                      <CalendarBlank size={20} weight="fill" />
                    </div>
                    <h3 className="text-[16px] font-bold text-ink-headline">{item.day}</h3>
                  </div>
                  <button
                    onClick={() => setEditingDay(editingDay === item.day ? null : item.day)}
                    className="p-2 rounded-md text-neutral-500 hover:text-brand-primary hover:bg-brand-light transition-colors"
                    title="Edit slots"
                  >
                    <PencilSimple size={18} />
                  </button>
                </div>

                {item.slots.length > 0 ? (
                  <div className="space-y-2 mb-3">
                    {item.slots.map((slot, i) => (
                      <div key={i} className="flex items-center justify-between gap-2 px-3 py-2 bg-neutral-50 rounded-md border border-neutral-200">
                        <div className="flex items-center gap-2 min-w-0">
                          <Clock size={14} className="text-brand-primary shrink-0" />
                          <span className="text-[13px] font-medium text-neutral-700 truncate">{slot}</span>
                        </div>
                        {editingDay === item.day && (
                          <button
                            onClick={() => removeSlot(item.day, i)}
                            className="p-1 text-status-danger hover:bg-status-danger/10 rounded transition-colors shrink-0"
                          >
                            <Trash size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[13px] text-neutral-400 italic mb-3">No slots available</p>
                )}

                {editingDay === item.day && (
                  <div className="pt-2 border-t border-neutral-200 space-y-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="e.g. 09:00 AM - 01:00 PM"
                        value={newSlot}
                        onChange={(e) => setNewSlot(e.target.value)}
                        className="flex-1"
                      />
                      <Button type="button" onClick={() => addSlot(item.day)} className="shrink-0 px-3" title="Add slot">
                        <Plus size={18} weight="bold" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => addSlot(item.day, true)}
                        className="text-[12px]"
                      >
                        Add to all weekdays
                      </Button>
                      {item.slots.length > 0 && (
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => copyDayToWeekdays(item.day)}
                          className="text-[12px]"
                        >
                          Copy {item.day} to Mon–Fri
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

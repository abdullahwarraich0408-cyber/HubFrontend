"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/shared/components/Button";
import { Badge } from "@/shared/components/Badge";
import { medicalHistoryApi } from "@/lib/api/index";
import { toast } from "sonner";

export function SharedHistoryManageSection() {
  const queryClient = useQueryClient();
  const [expandedId, setExpandedId] = useState(null);

  const sharesQuery = useQuery({
    queryKey: ["medical-history-shares"],
    queryFn: () => medicalHistoryApi.listShares(),
  });

  const revokeMut = useMutation({
    mutationFn: (appointmentId) => medicalHistoryApi.revokeAppointmentShares(appointmentId),
    onSuccess: () => {
      toast.success("Shared access revoked");
      queryClient.invalidateQueries({ queryKey: ["medical-history-shares"] });
    },
    onError: (err) => toast.error(err?.message || "Could not revoke access"),
  });

  const events = sharesQuery.data?.events || sharesQuery.data?.data?.events || [];

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-[16px] font-bold text-ink-headline">Medical Record Sharing</h3>
        <p className="text-[13px] text-neutral-500 mt-1">
          See which doctors received records for which appointment. You can revoke access anytime.
        </p>
      </div>

      {sharesQuery.isLoading ? (
        <p className="text-[13px] text-neutral-500">Loading shared access…</p>
      ) : events.length === 0 ? (
        <p className="text-[13px] text-neutral-500 p-4 border border-dashed border-neutral-200 rounded-[12px]">
          No medical records were shared for any appointment yet.
        </p>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <div
              key={event.appointment_id}
              className="p-4 border border-neutral-200 rounded-[12px] bg-white space-y-2"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-[14px] font-semibold text-ink-headline">
                    {event.doctor_name ? `Dr. ${event.doctor_name}` : "Doctor"}
                  </p>
                  <p className="text-[12px] text-neutral-500">
                    {event.specialty || "Appointment"} ·{" "}
                    {event.appointment_date
                      ? new Date(event.appointment_date).toLocaleDateString()
                      : "—"}
                  </p>
                </div>
                <Badge variant={event.status === "active" ? "success" : "neutral"}>
                  {event.status === "active" ? "Active" : "Revoked"}
                </Badge>
              </div>
              <p className="text-[12px] text-neutral-600">
                Shared: {(event.record_types || []).join(", ") || "—"} · {event.active_count || 0}{" "}
                active / {event.revoked_count || 0} revoked
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    setExpandedId(expandedId === event.appointment_id ? null : event.appointment_id)
                  }
                >
                  View Shared Records
                </Button>
                {event.status === "active" ? (
                  <Button
                    variant="danger"
                    size="sm"
                    disabled={revokeMut.isPending}
                    onClick={() => {
                      if (
                        window.confirm(
                          "Revoke this doctor's access to the shared records for this appointment?",
                        )
                      ) {
                        revokeMut.mutate(event.appointment_id);
                      }
                    }}
                  >
                    Revoke Access
                  </Button>
                ) : null}
              </div>
              {expandedId === event.appointment_id ? (
                <ul className="mt-2 text-[12px] text-neutral-600 space-y-1 border-t border-neutral-100 pt-2">
                  {(event.grants || []).map((g) => (
                    <li key={g.id}>
                      {g.record_type} · {g.status}
                      {g.shared_at ? ` · ${new Date(g.shared_at).toLocaleString()}` : ""}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { PageHeader } from "@/shared/components/PageHeader";
import { Button } from "@/shared/components/Button";
import { TableSkeleton } from "@/shared/components/EmptyState";
import { useVendorNotifications, useMarkVendorNotificationRead, useMarkAllVendorNotifications } from "@/lib/hooks/useApi";
import { formatDate } from "@/lib/format";
import { toast } from "sonner";

export default function NotificationsPage() {
  const { data: notifications = [], isLoading } = useVendorNotifications();
  const markRead = useMarkVendorNotificationRead();
  const markAll = useMarkAllVendorNotifications();

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Orders, prescriptions, stock, payouts, and compliance alerts for your pharmacy."
        actions={<Button variant="secondary" onClick={() => markAll.mutateAsync().then(() => toast.success("All notifications marked as read."))}>Mark all read</Button>}
      />
      <div className="bg-white rounded-[16px] border divide-y">
        {isLoading ? <TableSkeleton rows={5} /> : notifications.length === 0 ? (
          <p className="p-10 text-center text-neutral-500">No notifications yet.</p>
        ) : notifications.map((item) => {
          const unread = item.status === "unread" || !item.read_at;
          return (
            <button
              key={item.id}
              type="button"
              className={`w-full text-left p-5 ${unread ? "bg-sky-50/60" : ""}`}
              onClick={() => unread && markRead.mutate(item.id)}
            >
              <div className="flex justify-between gap-3">
                <p className="font-semibold text-ink-headline">{item.title}</p>
                <span className="text-xs text-neutral-400">{formatDate(item.created_at, true)}</span>
              </div>
              <p className="text-sm text-neutral-600 mt-1">{item.message || item.body}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

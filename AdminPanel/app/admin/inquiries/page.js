"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { inquiriesApi } from "@/lib/api/index";
import { Badge } from "@/shared/components/Badge";

export default function AdminInquiriesPage() {
  const queryClient = useQueryClient();
  const { data: inquiries = [], isLoading } = useQuery({
    queryKey: ["admin-inquiries"],
    queryFn: async () => {
      const data = await inquiriesApi.list();
      return data.inquiries || [];
    },
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }) => inquiriesApi.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-inquiries"] });
      toast.success("Inquiry updated");
    },
    onError: (error) => toast.error(error.message || "Could not update inquiry"),
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-[28px] font-heading font-extrabold text-ink-headline">Leads & Inquiries</h1>
        <p className="text-[14px] text-neutral-500 mt-1">
          Website contact form submissions, partner queries, and callback requests.
        </p>
      </div>

      <div className="bg-white rounded-[16px] border overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-neutral-50 border-b text-[12px] font-bold text-neutral-500 uppercase">
              <th className="p-4 pl-6">Contact</th>
              <th className="p-4">Type</th>
              <th className="p-4">Message</th>
              <th className="p-4">Received</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-neutral-500">
                  Loading...
                </td>
              </tr>
            ) : inquiries.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-neutral-500">
                  No inquiries yet. New website messages will appear here.
                </td>
              </tr>
            ) : (
              inquiries.map((inquiry) => (
                <tr key={inquiry.id}>
                  <td className="p-4 pl-6">
                    <div className="font-semibold text-sm text-ink-headline">
                      {[inquiry.first_name, inquiry.last_name].filter(Boolean).join(" ")}
                    </div>
                    <div className="text-[12px] text-neutral-500">{inquiry.email}</div>
                  </td>
                  <td className="p-4 text-[13px] capitalize">{inquiry.type}</td>
                  <td className="p-4 text-[13px] text-neutral-600 max-w-sm">
                    <p className="line-clamp-3">{inquiry.message}</p>
                  </td>
                  <td className="p-4 text-[13px] text-neutral-500">
                    {new Date(inquiry.created_at).toLocaleString()}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-2">
                      <Badge status={inquiry.status} />
                      <select
                        value={inquiry.status}
                        onChange={(event) =>
                          updateStatus.mutate({ id: inquiry.id, status: event.target.value })
                        }
                        className="text-[12px] border rounded-lg px-2 py-1 bg-neutral-50"
                      >
                        <option value="new">new</option>
                        <option value="in_progress">in progress</option>
                        <option value="resolved">resolved</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

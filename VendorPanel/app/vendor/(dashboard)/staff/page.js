"use client";

import { useState } from "react";
import { PageHeader } from "@/shared/components/PageHeader";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { TableSkeleton } from "@/shared/components/EmptyState";
import { useVendorStaff, useInviteStaff, useUpdateStaff } from "@/lib/hooks/useApi";
import { STAFF_ROLES } from "@/lib/vendor/status";
import { toast } from "sonner";

export default function StaffPage() {
  const { data: staff = [], isLoading } = useVendorStaff();
  const invite = useInviteStaff();
  const updateStaff = useUpdateStaff();
  const [open, setOpen] = useState(false);

  return (
    <div>
      <PageHeader title="Staff" description="Invite pharmacy staff and assign operational roles." actions={<Button onClick={() => setOpen(true)}>Invite staff</Button>} />
      <div className="bg-white rounded-[16px] border overflow-hidden">
        {isLoading ? <TableSkeleton /> : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-neutral-50 text-[12px] font-bold text-neutral-500 uppercase">
                <th className="p-4 pl-6">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {staff.length === 0 ? (
                <tr><td colSpan={4} className="p-10 text-center text-neutral-500">No staff accounts yet.</td></tr>
              ) : staff.map((member) => (
                <tr key={member.id} className="h-[62px]">
                  <td className="p-4 pl-6 font-semibold">{member.name}</td>
                  <td className="p-4">{member.email}</td>
                  <td className="p-4">
                    <select
                      className="h-10 border rounded-lg px-2 text-sm"
                      value={member.role}
                      onChange={(event) =>
                        updateStaff.mutateAsync({ id: member.id, role: event.target.value })
                          .then(() => toast.success("Staff permission changed."))
                          .catch((error) => toast.error(error.message))
                      }
                    >
                      {["OWNER", ...STAFF_ROLES].map((role) => <option key={role} disabled={role === "OWNER" && member.role !== "OWNER"}>{role}</option>)}
                    </select>
                  </td>
                  <td className="p-4">{member.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <form className="bg-white rounded-[16px] p-6 w-full max-w-md space-y-4" onSubmit={async (event) => {
            event.preventDefault();
            const form = new FormData(event.target);
            try {
              const result = await invite.mutateAsync({
                name: form.get("name"),
                email: form.get("email"),
                role: form.get("role"),
              });
              toast.success(result.temporary_password ? `Staff invited. Temporary password: ${result.temporary_password}` : "Staff invited.");
              setOpen(false);
            } catch (error) {
              toast.error(error.message);
            }
          }}>
            <h2 className="font-heading text-lg font-bold">Invite staff</h2>
            <Input name="name" label="Name" required />
            <Input name="email" type="email" label="Email" required />
            <label className="text-[13px] font-semibold">Role
              <select name="role" className="mt-1.5 w-full h-[46px] border rounded-lg px-3">
                {STAFF_ROLES.map((role) => <option key={role}>{role}</option>)}
              </select>
            </label>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" isLoading={invite.isPending}>Send invite</Button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}

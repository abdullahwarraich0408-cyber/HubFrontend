"use client";

import { PageHeader } from "@/shared/components/PageHeader";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { TableSkeleton } from "@/shared/components/EmptyState";
import {
  useChangeVendorPassword,
  useVendorLoginActivity,
  useSignOutOtherSessions,
} from "@/lib/hooks/useApi";
import { formatDate } from "@/lib/format";
import { toast } from "sonner";

export default function SecurityPage() {
  const changePassword = useChangeVendorPassword();
  const signOutOthers = useSignOutOtherSessions();
  const { data: activities = [], isLoading } = useVendorLoginActivity();

  return (
    <div className="max-w-[720px] space-y-6">
      <PageHeader title="Account Security" description="Change your password, review login activity, and sign out other sessions." />
      <form
        className="bg-white rounded-[16px] border p-6 space-y-4"
        onSubmit={async (event) => {
          event.preventDefault();
          const form = new FormData(event.target);
          if (form.get("new_password") !== form.get("confirm_password")) {
            toast.error("Passwords do not match");
            return;
          }
          try {
            await changePassword.mutateAsync({
              current_password: form.get("current_password"),
              new_password: form.get("new_password"),
            });
            toast.success("Password updated successfully.");
            event.target.reset();
          } catch (error) {
            toast.error(error.message);
          }
        }}
      >
        <h2 className="font-heading text-lg font-bold">Change Password</h2>
        <Input name="current_password" type="password" label="Current password" required />
        <Input name="new_password" type="password" label="New password" required />
        <Input name="confirm_password" type="password" label="Confirm new password" required />
        <Button type="submit" isLoading={changePassword.isPending}>Update password</Button>
      </form>

      <section className="bg-white rounded-[16px] border p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold">Active sessions</h2>
          <Button
            variant="danger"
            onClick={() =>
              signOutOthers.mutateAsync().then(() => toast.success("Other sessions signed out.")).catch((error) => toast.error(error.message))
            }
          >
            Sign out other sessions
          </Button>
        </div>
        <p className="text-sm text-neutral-500">MFA can be enabled later if your Medzoos authentication provider supports it.</p>
      </section>

      <section className="bg-white rounded-[16px] border overflow-hidden">
        <h2 className="p-6 font-heading text-lg font-bold">Recent login activity</h2>
        {isLoading ? <TableSkeleton rows={4} /> : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-neutral-50 text-xs uppercase text-neutral-500">
                <th className="p-4">When</th>
                <th className="p-4">IP</th>
                <th className="p-4">Device</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {activities.length === 0 ? (
                <tr><td colSpan={3} className="p-6 text-neutral-500">No login activity recorded yet.</td></tr>
              ) : activities.map((item) => (
                <tr key={item.id}>
                  <td className="p-4">{formatDate(item.created_at, true)}</td>
                  <td className="p-4">{item.ip_address || "—"}</td>
                  <td className="p-4">{item.user_agent || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

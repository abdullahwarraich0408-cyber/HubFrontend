"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import {
  useLabPortalTests,
  useCreateLabPortalTest,
  useDeleteLabPortalTest,
} from "@/lib/hooks/usePartnerPortal";

export default function LabTestsPage() {
  const { data: tests = [], isLoading } = useLabPortalTests();
  const createTest = useCreateLabPortalTest();
  const deleteTest = useDeleteLabPortalTest();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", category: "blood", price: "", turnaround: "24 hrs" });

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createTest.mutateAsync({
        name: form.name,
        category: form.category,
        price: Number(form.price),
        turnaround: form.turnaround,
        status: "active",
      });
      toast.success("Test created");
      setShowForm(false);
      setForm({ name: "", category: "blood", price: "", turnaround: "24 hrs" });
    } catch (err) {
      toast.error(err.message || "Failed to create test");
    }
  };

  if (isLoading) return <div className="text-neutral-500 text-sm">Loading tests...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-heading font-extrabold text-ink-headline">Tests</h1>
          <p className="text-[14px] text-neutral-500 mt-1">Manage your lab test catalog.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>{showForm ? "Cancel" : "Add Test"}</Button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-[16px] border p-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input placeholder="Test name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <Input placeholder="Price (PKR)" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
          <Input placeholder="Report time" value={form.turnaround} onChange={(e) => setForm({ ...form, turnaround: e.target.value })} />
          <Button type="submit" className="md:col-span-2" disabled={createTest.isPending}>Save Test</Button>
        </form>
      )}

      <div className="bg-white rounded-[16px] border overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-neutral-50 border-b text-[12px] font-bold text-neutral-500 uppercase">
              <th className="p-4 pl-6">Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Turnaround</th>
              <th className="p-4">Status</th>
              <th className="p-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {tests.map((t) => (
              <tr key={t.id}>
                <td className="p-4 pl-6 font-medium">{t.name}</td>
                <td className="p-4">{t.category}</td>
                <td className="p-4">PKR {t.price?.toLocaleString()}</td>
                <td className="p-4">{t.turnaround}</td>
                <td className="p-4 capitalize">{t.status}</td>
                <td className="p-4 pr-6 text-right">
                  <Button
                    variant="secondary"
                    onClick={() => deleteTest.mutate(t.id, { onSuccess: () => toast.success("Test deactivated") })}
                  >
                    Deactivate
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

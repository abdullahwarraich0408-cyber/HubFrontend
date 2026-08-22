"use client";

import { useState, useMemo } from "react";
import { Plus, Edit2, Power, Trash2, TestTube, Search } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/shared/components/Badge";
import { SearchInput } from "@/shared/components/SearchInput";
import { Pagination } from "@/shared/components/Pagination";
import { EmptyState } from "@/shared/components/EmptyState";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { TestFormModal } from "@/features/tests/components/TestFormModal";
import {
  useLabPortalTests,
  useCreateLabPortalTest,
  useUpdateLabPortalTest,
  useDeleteLabPortalTest,
} from "@/lib/hooks/usePartnerPortal";
import { TEST_CATEGORIES } from "@/lib/constants/lab";

export default function LabTestsPage() {
  const { data: tests = [], isLoading } = useLabPortalTests();
  const createTestMutation = useCreateLabPortalTest();
  const updateTestMutation = useUpdateLabPortalTest();
  const deleteTestMutation = useDeleteLabPortalTest();

  // Search & Filter State
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState(null);
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: "",
    description: "",
    confirmText: "Confirm",
    variant: "danger",
    onConfirm: () => {},
  });

  // Filtered & Paginated Tests
  const filteredTests = useMemo(() => {
    return tests.filter((t) => {
      if (categoryFilter !== "ALL" && t.category !== categoryFilter) return false;
      if (statusFilter !== "ALL" && t.status !== statusFilter) return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        const nameMatch = (t.name || "").toLowerCase().includes(q);
        const descMatch = (t.description || "").toLowerCase().includes(q);
        const catMatch = (t.category || "").toLowerCase().includes(q);
        if (!nameMatch && !descMatch && !catMatch) return false;
      }

      return true;
    });
  }, [tests, search, categoryFilter, statusFilter]);

  const totalPages = Math.ceil(filteredTests.length / pageSize) || 1;
  const paginatedTests = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTests.slice(start, start + pageSize);
  }, [filteredTests, currentPage, pageSize]);

  // Handlers
  const handleOpenAdd = () => {
    setEditingTest(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (test) => {
    setEditingTest(test);
    setModalOpen(true);
  };

  const handleSaveTest = async (testData) => {
    try {
      if (editingTest) {
        await updateTestMutation.mutateAsync({
          id: editingTest.id,
          ...testData,
        });
        toast.success(`"${testData.name}" updated successfully`);
      } else {
        await createTestMutation.mutateAsync(testData);
        toast.success(`"${testData.name}" added to catalog`);
      }
      setModalOpen(false);
      setEditingTest(null);
    } catch (err) {
      toast.error(err.message || "Failed to save test");
    }
  };

  const handleToggleStatus = async (test) => {
    const nextStatus = test.status === "active" ? "inactive" : "active";
    try {
      await updateTestMutation.mutateAsync({
        id: test.id,
        status: nextStatus,
      });
      toast.success(
        `"${test.name}" marked as ${nextStatus === "active" ? "Active" : "Inactive"}`
      );
    } catch (err) {
      toast.error(err.message || "Failed to update test status");
    }
  };

  const handleDeleteTest = (test) => {
    setConfirmState({
      isOpen: true,
      title: "Deactivate & Delete Test?",
      description: `Are you sure you want to remove "${test.name}" from your catalog? Existing bookings will not be affected.`,
      confirmText: "Delete Test",
      variant: "danger",
      onConfirm: async () => {
        try {
          await deleteTestMutation.mutateAsync(test.id);
          toast.success(`"${test.name}" deleted from catalog`);
        } catch (err) {
          toast.error(err.message || "Failed to delete test");
        } finally {
          setConfirmState((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  return (
    <div className="space-y-7 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[30px] md:text-[34px] font-heading font-bold text-[#082B3F] tracking-tight">
            Tests
          </h1>
          <p className="text-[14px] text-[#667085] mt-1.5 font-normal">
            Manage your lab test catalog.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#17618E] hover:bg-[#124362] text-white text-[13px] font-semibold transition-all shadow-sm self-start sm:self-auto"
        >
          <Plus size={18} />
          <span>Add Test</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-[16px] border border-[#D9DEE5] shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <SearchInput
          value={search}
          onChange={(val) => {
            setSearch(val);
            setCurrentPage(1);
          }}
          placeholder="Search tests by name or keyword..."
          className="w-full md:w-80"
        />

        <div className="flex flex-wrap items-center gap-3">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="h-[40px] px-3 text-[13px] font-medium bg-neutral-50 border border-[#D9DEE5] rounded-lg text-[#082B3F] focus:outline-none focus:border-[#17618E]"
          >
            <option value="ALL">All Categories</option>
            {TEST_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="h-[40px] px-3 text-[13px] font-medium bg-neutral-50 border border-[#D9DEE5] rounded-lg text-[#082B3F] focus:outline-none focus:border-[#17618E]"
          >
            <option value="ALL">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Tests Catalog Table Card */}
      <div className="bg-white rounded-[16px] border border-[#D9DEE5] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50/80 border-b border-[#D9DEE5] text-[12px] font-semibold text-[#667085] uppercase tracking-wider">
                <th className="py-3.5 px-6 font-semibold">Name</th>
                <th className="py-3.5 px-4 font-semibold">Category</th>
                <th className="py-3.5 px-4 font-semibold">Price</th>
                <th className="py-3.5 px-4 font-semibold">Turnaround</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-6 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-[13px]">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#667085]">
                    Loading tests catalog...
                  </td>
                </tr>
              ) : paginatedTests.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <EmptyState
                      message="No tests added yet."
                      description={
                        search || categoryFilter !== "ALL" || statusFilter !== "ALL"
                          ? "Try clearing filters to find what you are looking for."
                          : "Add your first test to make it available for patient bookings."
                      }
                      action={
                        !search && categoryFilter === "ALL" && statusFilter === "ALL" ? (
                          <button
                            type="button"
                            onClick={handleOpenAdd}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#17618E] text-white text-[13px] font-semibold hover:bg-[#124362]"
                          >
                            <Plus size={16} />
                            <span>Add Test</span>
                          </button>
                        ) : null
                      }
                    />
                  </td>
                </tr>
              ) : (
                paginatedTests.map((t) => (
                  <tr
                    key={t.id}
                    className="hover:bg-neutral-50/70 transition-colors group"
                  >
                    {/* Name */}
                    <td className="py-4 px-6">
                      <div className="font-semibold text-[#082B3F] max-w-sm">
                        {t.name}
                      </div>
                      {t.description && (
                        <div className="text-[12px] text-[#667085] truncate max-w-xs mt-0.5">
                          {t.description}
                        </div>
                      )}
                      {t.fasting_required && (
                        <span className="inline-block mt-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Fasting Required
                        </span>
                      )}
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4 font-medium text-[#082B3F]">
                      {t.category}
                    </td>

                    {/* Price */}
                    <td className="py-4 px-4">
                      <div className="font-bold text-[#17618E]">
                        PKR {Number(t.price).toLocaleString()}
                      </div>
                      {t.discount_price && (
                        <div className="text-[11px] text-[#667085] line-through">
                          PKR {Number(t.discount_price).toLocaleString()}
                        </div>
                      )}
                    </td>

                    {/* Turnaround */}
                    <td className="py-4 px-4 text-[#667085] font-medium">
                      {t.turnaround}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      <Badge status={t.status} type="active" />
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(t)}
                          className="p-1.5 rounded-lg border border-[#D9DEE5] text-[#667085] hover:text-[#17618E] hover:bg-teal-50/50 transition-colors"
                          title="Edit Test"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(t)}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            t.status === "active"
                              ? "border-[#D9DEE5] text-[#667085] hover:text-amber-600 hover:bg-amber-50"
                              : "border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                          }`}
                          title={t.status === "active" ? "Deactivate Test" : "Activate Test"}
                        >
                          <Power size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteTest(t)}
                          className="p-1.5 rounded-lg border border-[#D9DEE5] text-[#667085] hover:text-[#EF233C] hover:bg-rose-50 transition-colors"
                          title="Delete Test"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredTests.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(sz) => {
            setPageSize(sz);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Add / Edit Test Modal */}
      <TestFormModal
        test={editingTest}
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingTest(null);
        }}
        onSave={handleSaveTest}
        isLoading={createTestMutation.isPending || updateTestMutation.isPending}
      />

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmState.isOpen}
        onClose={() => setConfirmState((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmState.onConfirm}
        title={confirmState.title}
        description={confirmState.description}
        confirmText={confirmState.confirmText}
        variant={confirmState.variant}
        isLoading={deleteTestMutation.isPending}
      />
    </div>
  );
}

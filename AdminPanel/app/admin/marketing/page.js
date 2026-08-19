"use client";

import { useState, useEffect } from "react";
import {
  Megaphone,
  Plus,
  Tag,
  Trash,
  Percent,
  Clock,
  CalendarBlank,
  Sparkle,
  ToggleLeft,
  ToggleRight,
  CreditCard,
  BuildingStore,
  Users,
  ShieldCheck,
  X,
  Check,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { api } from "@/lib/api/index";

export default function AdminMarketingPage() {
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedOfferRedemptions, setSelectedOfferRedemptions] = useState(null);
  const [modalStep, setModalStep] = useState(1);

  // Form State for Offer Creation Wizard
  const [formData, setFormData] = useState({
    title: "",
    short_description: "",
    description: "",
    type: "PERCENTAGE_DISCOUNT",
    discount_type: "PERCENTAGE",
    percentage_value: "15",
    fixed_amount: "",
    promo_code: "",
    minimum_order_amount: "1500",
    maximum_discount_amount: "1000",
    funding_source: "MEDZOOS",
    new_users_only: false,
    stackable: false,
    payment_method_ids: [],
    start_at: new Date().toISOString().split("T")[0],
    end_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    terms_and_conditions: "Valid on eligible orders on Medzoos platform.",
  });

  const fetchOffers = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/offers/admin/all");
      const list = res?.offers || res?.data?.offers || (Array.isArray(res) ? res : []);
      setOffers(list);
    } catch {
      toast.error("Failed to load offers");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "ACTIVE" ? "PAUSED" : "ACTIVE";
    try {
      await api.patch(`/offers/admin/${id}/status`, { status: newStatus });
      toast.success(`Offer status changed to ${newStatus}`);
      fetchOffers();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDeleteOffer = async (id) => {
    if (confirm("Are you sure you want to delete this offer?")) {
      try {
        await api.delete(`/offers/admin/${id}`);
        toast.success("Offer deleted successfully");
        fetchOffers();
      } catch {
        toast.error("Failed to delete offer");
      }
    }
  };

  const handleCreateOffer = async (e) => {
    e.preventDefault();
    try {
      if (!formData.title || !formData.end_at) {
        toast.error("Title and expiration date are required");
        return;
      }

      await api.post("/offers/admin/create", {
        ...formData,
        percentage_value: formData.percentage_value ? parseFloat(formData.percentage_value) : null,
        fixed_amount: formData.fixed_amount ? parseFloat(formData.fixed_amount) : null,
        minimum_order_amount: formData.minimum_order_amount ? parseFloat(formData.minimum_order_amount) : 0,
        maximum_discount_amount: formData.maximum_discount_amount ? parseFloat(formData.maximum_discount_amount) : null,
      });

      toast.success("Offer campaign created successfully!");
      setShowCreateModal(false);
      setModalStep(1);
      fetchOffers();
    } catch (err) {
      toast.error(err.message || "Failed to create offer");
    }
  };

  const activeCount = offers.filter((o) => o.status === "ACTIVE").length;
  const totalRedemptionsCount = offers.reduce((sum, o) => sum + (o._count?.redemptions || o.used_count || 0), 0);

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 max-w-[1280px]">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[28px] font-heading font-extrabold text-ink-headline tracking-tight flex items-center gap-2">
            <Megaphone size={28} className="text-[#0B6E72]" weight="duotone" />
            Marketing & Offers System
          </h1>
          <p className="text-[14px] text-neutral-500 mt-1">
            Manage real backend promotions, discount codes, bank partnerships, and campaign analytics.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#0B6E72] hover:bg-[#084F52] text-white rounded-xl text-sm font-bold transition-colors shadow-sm cursor-pointer"
        >
          <Plus size={18} weight="bold" />
          <span>Create New Offer</span>
        </button>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-2xs">
          <span className="text-xs font-bold uppercase text-neutral-400">Active Campaigns</span>
          <p className="text-3xl font-extrabold text-ink-headline mt-1">{activeCount}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-2xs">
          <span className="text-xs font-bold uppercase text-neutral-400">Total Redemptions</span>
          <p className="text-3xl font-extrabold text-[#0B6E72] mt-1">{totalRedemptionsCount}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-2xs">
          <span className="text-xs font-bold uppercase text-neutral-400">Total Campaigns</span>
          <p className="text-3xl font-extrabold text-neutral-800 mt-1">{offers.length}</p>
        </div>
      </div>

      {/* Offers Table */}
      <div className="bg-white rounded-[20px] border border-neutral-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="p-6 border-b border-neutral-200 flex justify-between items-center bg-neutral-50">
          <h3 className="text-lg font-bold text-ink-headline flex items-center gap-2">
            <Tag size={20} className="text-[#0B6E72]" /> Active & Scheduled Offers
          </h3>
          <button
            onClick={fetchOffers}
            className="text-xs font-bold text-[#0B6E72] hover:underline"
          >
            Refresh List
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-600">
            <thead className="bg-neutral-100/80 text-[11px] uppercase font-bold text-neutral-500 border-b border-neutral-200">
              <tr>
                <th className="py-3.5 px-5">Campaign Title</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Discount</th>
                <th className="py-3.5 px-4">Code</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Expiry Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-neutral-400">Loading offers...</td>
                </tr>
              ) : offers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-neutral-400">No offers found. Create your first campaign above.</td>
                </tr>
              ) : (
                offers.map((offer) => (
                  <tr key={offer.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-4 px-5">
                      <div className="font-bold text-sm text-ink-headline">{offer.title}</div>
                      {offer.short_description && (
                        <div className="text-[11px] text-neutral-400 mt-0.5 line-clamp-1">{offer.short_description}</div>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-700 uppercase">
                        {offer.type?.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-bold text-[#0B6E72]">
                      {offer.discount_type === "PERCENTAGE"
                        ? `${offer.percentage_value || offer.discount_percentage}% OFF`
                        : offer.discount_type === "FREE_DELIVERY"
                        ? "Free Delivery"
                        : `PKR ${offer.fixed_amount} OFF`}
                    </td>
                    <td className="py-4 px-4">
                      {offer.promo_code ? (
                        <span className="font-mono font-bold text-xs bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-ink-headline">
                          {offer.promo_code}
                        </span>
                      ) : (
                        <span className="text-neutral-400 italic">Automatic</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleToggleStatus(offer.id, offer.status)}
                        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                          offer.status === "ACTIVE"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {offer.status}
                      </button>
                    </td>
                    <td className="py-4 px-4 text-neutral-500 font-medium">
                      {offer.end_at ? new Date(offer.end_at).toLocaleDateString() : "No Expiry"}
                    </td>
                    <td className="py-4 px-5 text-right">
                      <button
                        onClick={() => handleDeleteOffer(offer.id)}
                        className="p-1.5 rounded bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                        title="Delete Offer"
                      >
                        <Trash size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Multi-Step Create Offer Wizard Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-[560px] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50">
              <div>
                <h3 className="font-bold text-lg text-ink-headline">Create Healthcare Offer</h3>
                <p className="text-xs text-neutral-400">Step {modalStep} of 4</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-200 text-neutral-500"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateOffer} className="p-6">
              {modalStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Offer Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 15% Off All Diabetes Care Products"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm font-semibold outline-none focus:border-[#0B6E72]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Offer Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm font-semibold outline-none focus:border-[#0B6E72]"
                    >
                      <option value="PERCENTAGE_DISCOUNT">Percentage Discount</option>
                      <option value="FIXED_DISCOUNT">Fixed PKR Discount</option>
                      <option value="FREE_DELIVERY">Free Delivery Promotion</option>
                      <option value="PROMO_CODE">Promo Code Offer</option>
                      <option value="BANK_OFFER">Bank Card Offer (Visa / Mastercard)</option>
                      <option value="WALLET_OFFER">Mobile Wallet Offer (Easypaisa / JazzCash)</option>
                      <option value="LAB_OFFER">Lab Test Package Offer</option>
                      <option value="CONSULTATION_OFFER">Doctor Consultation Offer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Short Benefit Description</label>
                    <input
                      type="text"
                      placeholder="e.g. Save 15% on glucose meters and test strips."
                      value={formData.short_description}
                      onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm outline-none focus:border-[#0B6E72]"
                    />
                  </div>
                </div>
              )}

              {modalStep === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Discount Type</label>
                      <select
                        value={formData.discount_type}
                        onChange={(e) => setFormData({ ...formData, discount_type: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm outline-none"
                      >
                        <option value="PERCENTAGE">Percentage (%)</option>
                        <option value="FIXED">Fixed Amount (PKR)</option>
                        <option value="FREE_DELIVERY">Free Delivery</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Discount Value</label>
                      <input
                        type="number"
                        placeholder={formData.discount_type === "PERCENTAGE" ? "15" : "500"}
                        value={formData.discount_type === "PERCENTAGE" ? formData.percentage_value : formData.fixed_amount}
                        onChange={(e) =>
                          formData.discount_type === "PERCENTAGE"
                            ? setFormData({ ...formData, percentage_value: e.target.value })
                            : setFormData({ ...formData, fixed_amount: e.target.value })
                        }
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm outline-none font-bold text-[#0B6E72]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Promo Code (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. MEDZOOS500"
                      value={formData.promo_code}
                      onChange={(e) => setFormData({ ...formData, promo_code: e.target.value.toUpperCase() })}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm font-mono font-bold uppercase outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Min. Order (PKR)</label>
                      <input
                        type="number"
                        value={formData.minimum_order_amount}
                        onChange={(e) => setFormData({ ...formData, minimum_order_amount: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Max Discount Cap (PKR)</label>
                      <input
                        type="number"
                        value={formData.maximum_discount_amount}
                        onChange={(e) => setFormData({ ...formData, maximum_discount_amount: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {modalStep === 3 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Funding Sponsor</label>
                    <select
                      value={formData.funding_source}
                      onChange={(e) => setFormData({ ...formData, funding_source: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm outline-none"
                    >
                      <option value="MEDZOOS">Medzoos Platform</option>
                      <option value="PHARMACY">Pharmacy Vendor</option>
                      <option value="LAB">Lab Partner</option>
                      <option value="BANK">Bank / Wallet Partner</option>
                    </select>
                  </div>

                  <div className="space-y-2 pt-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.new_users_only}
                        onChange={(e) => setFormData({ ...formData, new_users_only: e.target.checked })}
                        className="h-4 w-4 rounded text-[#0B6E72]"
                      />
                      <span className="text-xs font-bold text-neutral-700">Valid for First-Time Users Only</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.stackable}
                        onChange={(e) => setFormData({ ...formData, stackable: e.target.checked })}
                        className="h-4 w-4 rounded text-[#0B6E72]"
                      />
                      <span className="text-xs font-bold text-neutral-700">Allow Stacking With Other Offers</span>
                    </label>
                  </div>
                </div>
              )}

              {modalStep === 4 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Start Date *</label>
                      <input
                        type="date"
                        required
                        value={formData.start_at}
                        onChange={(e) => setFormData({ ...formData, start_at: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Expiry Date *</label>
                      <input
                        type="date"
                        required
                        value={formData.end_at}
                        onChange={(e) => setFormData({ ...formData, end_at: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Terms & Conditions</label>
                    <textarea
                      rows={3}
                      value={formData.terms_and_conditions}
                      onChange={(e) => setFormData({ ...formData, terms_and_conditions: e.target.value })}
                      className="w-full p-3 rounded-xl border border-neutral-200 text-xs outline-none resize-none"
                    ></textarea>
                  </div>
                </div>
              )}

              {/* Wizard Navigation */}
              <div className="mt-6 flex items-center justify-between pt-4 border-t border-neutral-100">
                {modalStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => setModalStep(modalStep - 1)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-600 hover:bg-neutral-100"
                  >
                    Back
                  </button>
                ) : (
                  <span />
                )}

                {modalStep < 4 ? (
                  <button
                    type="button"
                    onClick={() => setModalStep(modalStep + 1)}
                    className="px-5 py-2.5 rounded-xl bg-[#0B6E72] hover:bg-[#084F52] text-white text-xs font-bold"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm"
                  >
                    Publish Offer Campaign
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

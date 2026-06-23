"use client";

import { useMarketingCoupons, useMarketingOffers, useCreateCoupon, useDeleteCoupon } from "@/lib/hooks/useApi";
import { Megaphone, Plus, Tag, Trash, CurrencyDollar, Percent, Clock, CalendarBlank } from "@phosphor-icons/react";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminMarketingPage() {
  const { data: coupons = [], isLoading: isLoadingCoupons } = useMarketingCoupons();
  const { data: offers = [], isLoading: isLoadingOffers } = useMarketingOffers();
  const createCouponMutation = useCreateCoupon();
  const deleteCouponMutation = useDeleteCoupon();

  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    discount_type: "percentage",
    discount_value: "",
    min_order_amount: "0",
    start_date: new Date().toISOString().split("T")[0],
    expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    usage_limit: ""
  });

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      if (!formData.code || !formData.discount_value) {
        toast.error("Code and discount value are required");
        return;
      }
      await createCouponMutation.mutateAsync(formData);
      toast.success("Coupon created successfully!");
      setShowAddModal(false);
      setFormData({
        ...formData,
        code: "",
        discount_value: ""
      });
    } catch (err) {
      toast.error(err.message || "Failed to create coupon");
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (confirm("Are you sure you want to delete this coupon?")) {
      try {
        await deleteCouponMutation.mutateAsync(id);
        toast.success("Coupon deleted successfully");
      } catch (err) {
        toast.error("Failed to delete coupon");
      }
    }
  };

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 max-w-[1200px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[28px] font-heading font-extrabold text-ink-headline tracking-tight">Marketing & Campaigns</h1>
          <p className="text-[14px] text-neutral-500 mt-1">Manage promotions, coupons, and vendor offers.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#0B6E72] hover:bg-[#084F52] text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
        >
          <Plus size={18} weight="bold" /> 
          <span>Create Coupon</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Coupons List */}
        <div className="bg-white rounded-[16px] border border-neutral-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col overflow-hidden">
          <div className="p-6 border-b border-neutral-200 flex justify-between items-center bg-neutral-50">
            <h3 className="text-[18px] font-bold text-ink-headline flex items-center gap-2">
              <Tag size={20} className="text-[#0B6E72]" /> Active Coupons
            </h3>
          </div>
          <div className="flex flex-col min-h-[300px]">
            {isLoadingCoupons ? (
              <div className="p-8 text-center text-neutral-400">Loading coupons...</div>
            ) : coupons.length === 0 ? (
              <div className="p-8 text-center text-neutral-400">No coupons active.</div>
            ) : (
              coupons.map(coupon => (
                <div key={coupon.id} className="p-5 border-b border-neutral-100 last:border-0 hover:bg-neutral-50 transition-colors flex justify-between items-center group">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-ink-headline bg-neutral-100 px-2 py-0.5 rounded uppercase tracking-wider border border-neutral-200">
                        {coupon.code}
                      </span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${coupon.is_active ? 'bg-[#0F9D58]/10 text-[#0F9D58]' : 'bg-neutral-100 text-neutral-500'}`}>
                        {coupon.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="text-sm text-neutral-600 font-medium mt-1">
                      {coupon.discount_type === 'percentage' ? `${coupon.discount_value}% OFF` : `PKR ${coupon.discount_value} OFF`}
                      {coupon.min_order_amount > 0 && ` on orders over PKR ${coupon.min_order_amount}`}
                    </div>
                    <div className="text-xs text-neutral-400 flex items-center gap-1 mt-1">
                      <CalendarBlank size={12} /> Valid till {new Date(coupon.expiry_date).toLocaleDateString()}
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteCoupon(coupon.id)}
                    className="w-8 h-8 rounded bg-red-50 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100"
                    title="Delete Coupon"
                  >
                    <Trash size={16} weight="bold" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Vendor Offers List */}
        <div className="bg-white rounded-[16px] border border-neutral-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col overflow-hidden">
          <div className="p-6 border-b border-neutral-200 flex justify-between items-center bg-neutral-50">
            <h3 className="text-[18px] font-bold text-ink-headline flex items-center gap-2">
              <Megaphone size={20} className="text-[#D97706]" /> Vendor Offers
            </h3>
          </div>
          <div className="flex flex-col min-h-[300px]">
            {isLoadingOffers ? (
              <div className="p-8 text-center text-neutral-400">Loading offers...</div>
            ) : offers.length === 0 ? (
              <div className="p-8 text-center text-neutral-400">No vendor offers active.</div>
            ) : (
              offers.map(offer => (
                <div key={offer.id} className="p-5 border-b border-neutral-100 last:border-0 flex justify-between items-start">
                  <div className="flex flex-col gap-1">
                    <div className="text-sm font-bold text-ink-headline">{offer.product?.name || "Unknown Product"}</div>
                    <div className="text-xs text-neutral-500 font-medium">By {offer.vendor?.business_name || "Unknown Vendor"}</div>
                    <div className="text-xs text-[#D97706] flex items-center gap-1 mt-2 font-bold">
                      <Clock size={14} weight="bold" /> Ends {new Date(offer.expiry_date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-lg font-black text-[#D97706] bg-[#D97706]/10 px-3 py-1 rounded-lg">
                    {offer.discount_percentage}% OFF
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add Coupon Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-[20px] shadow-2xl w-full max-w-[500px] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50">
              <h3 className="font-bold text-lg text-ink-headline">Create New Coupon</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-200 text-neutral-500 transition-colors"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateCoupon} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-1.5">Coupon Code <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. SUMMER2024"
                  value={formData.code}
                  onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
                  className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 bg-white text-sm outline-none focus:border-[#0B6E72] focus:ring-1 focus:ring-[#0B6E72] uppercase font-mono font-bold"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-1.5">Discount Type</label>
                  <select 
                    value={formData.discount_type}
                    onChange={e => setFormData({...formData, discount_type: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 bg-white text-sm outline-none focus:border-[#0B6E72] focus:ring-1 focus:ring-[#0B6E72]"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (PKR)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-1.5">Value <span className="text-red-500">*</span></label>
                  <div className="relative">
                    {formData.discount_type === 'percentage' ? (
                      <Percent size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    ) : (
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-xs font-bold">Rs</span>
                    )}
                    <input 
                      type="number" 
                      required
                      min="1"
                      step={formData.discount_type === 'percentage' ? '1' : '0.01'}
                      value={formData.discount_value}
                      onChange={e => setFormData({...formData, discount_value: e.target.value})}
                      className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-neutral-200 bg-white text-sm outline-none focus:border-[#0B6E72] focus:ring-1 focus:ring-[#0B6E72]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-1.5">Minimum Order Amount (PKR)</label>
                <input 
                  type="number" 
                  min="0"
                  value={formData.min_order_amount}
                  onChange={e => setFormData({...formData, min_order_amount: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 bg-white text-sm outline-none focus:border-[#0B6E72] focus:ring-1 focus:ring-[#0B6E72]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-1.5">Start Date</label>
                  <input 
                    type="date" 
                    required
                    value={formData.start_date}
                    onChange={e => setFormData({...formData, start_date: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 bg-white text-sm outline-none focus:border-[#0B6E72] focus:ring-1 focus:ring-[#0B6E72]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-1.5">Expiry Date</label>
                  <input 
                    type="date" 
                    required
                    value={formData.expiry_date}
                    onChange={e => setFormData({...formData, expiry_date: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 bg-white text-sm outline-none focus:border-[#0B6E72] focus:ring-1 focus:ring-[#0B6E72]"
                  />
                </div>
              </div>
              
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-neutral-100 mt-2">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-lg text-sm font-bold text-neutral-600 hover:bg-neutral-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={createCouponMutation.isPending}
                  className="px-5 py-2.5 rounded-lg text-sm font-bold bg-[#0B6E72] hover:bg-[#084F52] text-white transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {createCouponMutation.isPending ? "Creating..." : "Save Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

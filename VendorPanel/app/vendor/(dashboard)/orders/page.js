"use client";
 
import { useMemo, useState } from "react";
import { Package, Truck, CheckCircle, X, Eye, MapPin, Calendar, User, Envelope, FileText } from "@phosphor-icons/react";
import { Badge } from "@/shared/components/Badge";
import {
  useVendorOrders,
  useVendorDashboardStats,
  useUpdateVendorOrderStatus,
} from "@/lib/hooks/useApi";
 
export default function VendorOrdersPage() {
  const { data: orders = [], isLoading } = useVendorOrders();
  const { data: stats } = useVendorDashboardStats();
  const updateStatus = useUpdateVendorOrderStatus();
  const [selectedOrder, setSelectedOrder] = useState(null);

  const sortedOrders = useMemo(
    () => [...orders].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
    [orders]
  );

  const handleStatusChange = (orderId, status) => {
    updateStatus.mutate({ id: orderId, status });
  };

  if (isLoading) {
    return <div className="text-sm text-neutral-500">Loading your orders...</div>;
  }

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">
      <div className="mb-8">
        <h1 className="text-[28px] font-heading font-extrabold text-ink-headline tracking-tight">Order Management</h1>
        <p className="text-[14px] text-neutral-500 mt-1">Track and fulfill orders placed with your pharmacy only.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-5 rounded-[16px] border border-neutral-200 shadow-sm">
          <div className="flex items-center gap-3 text-warning-600 mb-2">
            <Package size={20} weight="fill" />
            <span className="font-bold text-[13px] uppercase tracking-wider">Pending Fulfillment</span>
          </div>
          <div className="text-[32px] font-black text-ink-900">{stats?.orderSummary?.pending || 0}</div>
        </div>
        <div className="bg-white p-5 rounded-[16px] border border-neutral-200 shadow-sm">
          <div className="flex items-center gap-3 text-brand-primary mb-2">
            <Truck size={20} weight="fill" />
            <span className="font-bold text-[13px] uppercase tracking-wider">Out for Delivery</span>
          </div>
          <div className="text-[32px] font-black text-ink-900">{stats?.orderSummary?.outForDelivery || 0}</div>
        </div>
        <div className="bg-white p-5 rounded-[16px] border border-neutral-200 shadow-sm">
          <div className="flex items-center gap-3 text-status-success mb-2">
            <CheckCircle size={20} weight="fill" />
            <span className="font-bold text-[13px] uppercase tracking-wider">Completed Today</span>
          </div>
          <div className="text-[32px] font-black text-ink-900">{stats?.orderSummary?.completedToday || 0}</div>
        </div>
      </div>

      <div className="bg-white rounded-[16px] border border-neutral-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200 text-[12px] font-bold text-neutral-500 uppercase tracking-wider">
                <th className="p-4 pl-6">Order</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Items</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {sortedOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-sm text-neutral-500">
                    No orders yet for your store.
                  </td>
                </tr>
              ) : (
                sortedOrders.map((order) => (
                  <tr 
                    key={order.id} 
                    onClick={() => setSelectedOrder(order)}
                    className="hover:bg-neutral-50/50 transition-colors cursor-pointer"
                  >
                    <td className="p-4 pl-6 text-sm font-bold">{String(order.id).slice(0, 8)}</td>
                    <td className="p-4 text-sm">{order.customer?.name || "Customer"}</td>
                    <td className="p-4 text-sm">{order.items?.length || 0}</td>
                    <td className="p-4 text-sm font-bold">PKR {Number(order.total_amount || 0).toLocaleString()}</td>
                    <td className="p-4"><Badge status={order.status} /></td>
                    <td className="p-4 pr-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-3">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="text-[12px] border border-neutral-200 rounded-md px-2 py-1.5 bg-white outline-none focus:border-brand-primary"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 rounded-md hover:bg-neutral-100 text-neutral-500 hover:text-brand-primary transition-colors"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-3xl rounded-[16px] shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-neutral-200 bg-neutral-50">
              <div className="flex items-center gap-3">
                <div>
                  <h2 className="text-[18px] font-extrabold text-ink-headline flex items-center gap-2">
                    Order Details: <span className="font-mono text-neutral-500">#{selectedOrder.id.slice(0, 8)}</span>
                  </h2>
                  <p className="text-[12px] text-neutral-500 mt-0.5">
                    Placed on {new Date(selectedOrder.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <Badge status={selectedOrder.status} />
              </div>
              <button 
                onClick={() => setSelectedOrder(null)} 
                className="text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                <X size={20} weight="bold" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Customer and Delivery Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-[12px] border border-neutral-200 bg-neutral-50/50">
                <div className="space-y-3">
                  <h3 className="text-[13px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                    <User size={16} /> Customer Information
                  </h3>
                  <div>
                    <div className="text-[14px] font-bold text-ink-900">{selectedOrder.customer?.name || "Customer"}</div>
                    <div className="text-[12px] text-neutral-500 flex items-center gap-1 mt-0.5">
                      <Envelope size={14} /> {selectedOrder.customer?.email || "No email provided"}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-[13px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin size={16} /> Delivery Address
                  </h3>
                  <div className="text-[14px] text-neutral-700 leading-relaxed font-medium">
                    {(() => {
                      const addr = selectedOrder.delivery_address;
                      if (typeof addr === "string") return addr;
                      if (!addr) return "No address provided";
                      return [addr.street || addr.address, addr.city, addr.state, addr.zip || addr.zipCode].filter(Boolean).join(", ");
                    })()}
                  </div>
                </div>
              </div>

              {/* Order Items Table */}
              <div className="space-y-3">
                <h3 className="text-[14px] font-bold text-ink-headline flex items-center gap-1.5">
                  <FileText size={18} /> Order Items
                </h3>
                <div className="border border-neutral-200 rounded-[12px] overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-neutral-50 border-b border-neutral-200 text-[11px] font-bold text-neutral-500 uppercase">
                        <th className="p-4">Item Name</th>
                        <th className="p-4">Generic Formula</th>
                        <th className="p-4 text-right">Unit Price</th>
                        <th className="p-4 text-center">Qty</th>
                        <th className="p-4 pr-6 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 text-[13px]">
                      {(selectedOrder.items || []).map((item) => (
                        <tr key={item.id} className="hover:bg-neutral-50/50">
                          <td className="p-4 font-semibold text-ink-900">{item.product?.name || "Product"}</td>
                          <td className="p-4 text-neutral-500">{item.product?.formula || "Medicine"}</td>
                          <td className="p-4 text-right text-neutral-700">PKR {Number(item.unit_price).toLocaleString()}</td>
                          <td className="p-4 text-center font-bold text-ink-900">{item.quantity}</td>
                          <td className="p-4 pr-6 text-right font-bold text-brand-primary">
                            PKR {Number(item.unit_price * item.quantity).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Total Calculation */}
              <div className="flex flex-col items-end gap-2 pr-2 pt-2">
                <div className="text-[13px] text-neutral-500">Order Subtotal: PKR {Number(selectedOrder.total_amount).toLocaleString()}</div>
                <div className="text-[18px] font-black text-ink-900 flex items-center gap-2">
                  Total Amount: <span className="text-brand-primary">PKR {Number(selectedOrder.total_amount).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-[13px] font-semibold text-neutral-600">Update Order Status:</span>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => {
                    handleStatusChange(selectedOrder.id, e.target.value);
                    setSelectedOrder({ ...selectedOrder, status: e.target.value });
                  }}
                  className="text-[13px] border border-neutral-200 rounded-lg px-3 py-2 bg-white outline-none focus:border-brand-primary font-bold shadow-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <Button 
                variant="secondary"
                onClick={() => setSelectedOrder(null)}
                className="h-[40px] px-5"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

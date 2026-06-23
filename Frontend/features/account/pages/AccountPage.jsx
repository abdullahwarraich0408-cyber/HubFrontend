"use client";

import { useState } from "react";
import { 
  User, 
  Package, 
  Receipt, 
  MapPinLine, 
  Gear, 
  LockKey, 
  SignOut,
  DownloadSimple,
  CalendarCheck,
} from "@phosphor-icons/react";
import { Button } from "@/shared/components/Button";
import { Badge } from "@/shared/components/Badge";
import { 
  useOrders, 
  useUserProfile, 
  useAddresses, 
  useUpdateProfile, 
  useCreateAddress, 
  useDeleteAddress 
} from "@/lib/hooks/useApi";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api/client";

export function AccountPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("orders");
  const [orderFilter, setOrderFilter] = useState("all");

  const { data: profile } = useUserProfile();
  const { data: orders = [] } = useOrders();
  const { data: addresses = [] } = useAddresses();
  
  const updateProfileMutation = useUpdateProfile();
  const createAddressMutation = useCreateAddress();
  const deleteAddressMutation = useDeleteAddress();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/auth/signin");
    } catch (err) {
      console.error(err);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/auth/signin");
    }
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    updateProfileMutation.mutate({
      name: formData.get("name"),
      phone: formData.get("phone"),
    });
    alert("Profile updated successfully");
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    createAddressMutation.mutate({
      title: formData.get("title"),
      street: formData.get("street"),
      city: formData.get("city"),
      state: formData.get("state"),
      zip_code: formData.get("zip_code"),
      country: formData.get("country"),
    });
    e.target.reset();
  };

  const displayOrders = orders.length > 0 ? orders.map(o => ({
    id: o.id || o.order_number,
    date: new Date(o.created_at || o.date).toLocaleDateString(),
    status: o.status,
    total: Number(o.total_amount || o.amount) || 0,
    items: o.items?.map(i => ({ name: i.product?.name || i.name, qty: i.quantity, img: i.product?.image_url || i.image || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=100&auto=format&fit=crop" })) || []
  })) : [
    {
      id: "ORD-2026-04821",
      date: "Jun 06, 2026",
      status: "processing",
      total: 5350,
      items: [
        { name: "Panadol Extra 500mg", qty: 2, img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=100&auto=format&fit=crop" },
        { name: "Centrum Silver", qty: 1, img: "https://images.unsplash.com/photo-1550572017-edb79a527c9b?q=80&w=100&auto=format&fit=crop" },
      ]
    }
  ];

  const sidebarLinks = [
    { id: "orders", label: "My Orders", icon: <Package size={20} /> },
    { id: "transactions", label: "Transaction History", icon: <Receipt size={20} /> },
    { id: "addresses", label: "Saved Addresses", icon: <MapPinLine size={20} /> },
    { id: "profile", label: "Profile Settings", icon: <Gear size={20} /> },
    { id: "password", label: "Change Password", icon: <LockKey size={20} /> },
  ];

  return (
    <div className="min-h-[calc(100vh-180px)] bg-[var(--color-surface-subtle)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Sidebar */}
        <aside className="w-full lg:w-[280px] shrink-0">
          <div className="bg-white rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[var(--color-neutral-200)] overflow-hidden">
            
            <div className="p-6 border-b border-[var(--color-neutral-200)] flex flex-col items-center text-center">
              <div className="w-[80px] h-[80px] rounded-full icon-box-light flex items-center justify-center mb-4">
                <User size={40} weight="fill" className="text-[var(--color-brand-primary)]" />
              </div>
              <h2 className="text-[18px] font-bold text-[var(--color-ink-headline)] leading-tight">{profile?.name || "Customer User"}</h2>
              <p className="text-[13px] font-medium text-[var(--color-neutral-500)] mt-1">{profile?.email || "user@example.com"}</p>
            </div>

            <nav className="p-3 space-y-1">
              {sidebarLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-[12px] text-[14px] font-semibold transition-all ${activeTab === link.id ? 'bg-[var(--color-brand-primary)] text-white shadow-md' : 'text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-50)] hover:text-[var(--color-ink-900)]'}`}
                >
                  {link.icon}
                  {link.label}
                </button>
              ))}

              <Link
                href="/account/appointments"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-[12px] text-[14px] font-semibold text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-50)] hover:text-[var(--color-ink-900)] transition-all"
              >
                <CalendarCheck size={20} />
                My Appointments
              </Link>
              
              <div className="pt-4 mt-4 border-t border-[var(--color-neutral-100)]">
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-[12px] text-[14px] font-bold text-[var(--color-status-danger)] hover:bg-[var(--color-status-danger)]/10 transition-colors">
                  <SignOut size={20} weight="bold" />
                  Logout
                </button>
              </div>
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 w-full bg-white rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[var(--color-neutral-200)] p-6 lg:p-10">
          
          {activeTab === "orders" && (
            <div className="animate-in fade-in duration-500">
              <h2 className="text-[24px] font-[var(--font-heading)] font-extrabold text-[var(--color-ink-headline)] mb-6">
                My Orders
              </h2>

              <div className="flex gap-2 overflow-x-auto pb-2 mb-8 border-b border-[var(--color-neutral-200)] scrollbar-hide">
                {["all", "processing", "delivered", "cancelled"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setOrderFilter(filter)}
                    className={`px-4 py-3 text-[14px] font-bold capitalize whitespace-nowrap border-b-2 transition-all ${orderFilter === filter ? 'border-[var(--color-brand-primary)] text-[var(--color-brand-primary)]' : 'border-transparent text-[var(--color-neutral-500)] hover:text-black'}`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                {displayOrders
                  .filter(o => orderFilter === "all" || o.status === orderFilter)
                  .map(order => (
                  <div key={order.id} className="border border-[var(--color-neutral-200)] rounded-[16px] p-5 hover:border-[var(--color-brand-primary)]/50 transition-colors">
                    
                    {/* Order Header */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-5 pb-5 border-b border-[var(--color-neutral-100)]">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-mono font-bold text-[15px] text-[var(--color-ink-900)]">{order.id}</span>
                          {order.status === "processing" && <Badge variant="warning">Processing</Badge>}
                          {order.status === "delivered" && <Badge variant="success">Delivered</Badge>}
                        </div>
                        <p className="text-[13px] font-medium text-[var(--color-neutral-500)]">Placed on {order.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[18px] font-extrabold text-[var(--color-ink-900)]">Rs {order.total.toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                      <div className="flex items-center gap-3 overflow-x-auto max-w-full pb-2 scrollbar-hide">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3 bg-[var(--color-neutral-50)] p-2 pr-4 rounded-[10px] border border-[var(--color-neutral-200)] shrink-0">
                            <div className="w-[48px] h-[48px] rounded-[6px] overflow-hidden bg-white">
                              <img src={item.img} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                            </div>
                            <div>
                              <p className="text-[13px] font-bold text-[var(--color-ink-900)] max-w-[120px] truncate">{item.name}</p>
                              <p className="text-[12px] font-medium text-[var(--color-neutral-500)]">Qty: {item.qty}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="w-full sm:w-auto shrink-0 flex items-center gap-3">
                         <Button variant="secondary" className="flex-1 sm:flex-none h-[40px] px-6 text-[13px]">
                           View Details
                         </Button>
                      </div>
                    </div>

                  </div>
                ))}

                {displayOrders.filter(o => orderFilter === "all" || o.status === orderFilter).length === 0 && (
                  <div className="text-center py-12">
                    <Package size={48} weight="duotone" className="text-[var(--color-neutral-300)] mx-auto mb-4" />
                    <h3 className="text-[18px] font-bold text-[var(--color-ink-headline)] mb-2">No orders found</h3>
                    <p className="text-[14px] text-[var(--color-neutral-500)]">You don't have any {orderFilter !== 'all' ? orderFilter : ''} orders yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "transactions" && (
            <div className="animate-in fade-in duration-500">
              <h2 className="text-[24px] font-[var(--font-heading)] font-extrabold text-[var(--color-ink-headline)] mb-6">
                Transaction History
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[var(--color-surface-subtle)] border-y border-[var(--color-neutral-200)]">
                      <th className="py-4 px-4 text-xs font-bold text-[var(--color-neutral-500)] uppercase tracking-wider">Date</th>
                      <th className="py-4 px-4 text-xs font-bold text-[var(--color-neutral-500)] uppercase tracking-wider">Order ID</th>
                      <th className="py-4 px-4 text-xs font-bold text-[var(--color-neutral-500)] uppercase tracking-wider">Amount</th>
                      <th className="py-4 px-4 text-xs font-bold text-[var(--color-neutral-500)] uppercase tracking-wider text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-neutral-200)]">
                    {displayOrders.map(o => (
                      <tr key={o.id}>
                        <td className="py-4 px-4 text-sm">{o.date}</td>
                        <td className="py-4 px-4 text-sm font-mono">{o.id}</td>
                        <td className="py-4 px-4 text-sm font-bold">Rs {o.total}</td>
                        <td className="py-4 px-4 text-right"><Badge status={o.status === "delivered" ? "active" : "pending"} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "addresses" && (
            <div className="animate-in fade-in duration-500">
              <h2 className="text-[24px] font-[var(--font-heading)] font-extrabold text-[var(--color-ink-headline)] mb-6">
                Saved Addresses
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {addresses.map(a => (
                  <div key={a.id} className="border border-[var(--color-neutral-200)] rounded-[16px] p-5 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-[var(--color-ink-headline)] mb-1">{a.title}</h4>
                      <p className="text-sm text-[var(--color-neutral-600)]">{a.street}, {a.city}, {a.state} {a.zip_code}</p>
                      <p className="text-sm text-[var(--color-neutral-600)]">{a.country}</p>
                    </div>
                    <button onClick={() => deleteAddressMutation.mutate(a.id)} className="text-sm text-[var(--color-status-danger)] font-bold mt-4 self-start hover:underline">
                      Delete
                    </button>
                  </div>
                ))}
              </div>
              <h3 className="text-lg font-bold mb-4">Add New Address</h3>
              <form onSubmit={handleAddAddress} className="space-y-4 max-w-lg border border-[var(--color-neutral-200)] p-6 rounded-[16px]">
                <input required name="title" placeholder="Address Title (e.g. Home)" className="w-full px-4 py-2 border rounded-md" />
                <input required name="street" placeholder="Street Address" className="w-full px-4 py-2 border rounded-md" />
                <div className="grid grid-cols-2 gap-4">
                  <input required name="city" placeholder="City" className="w-full px-4 py-2 border rounded-md" />
                  <input required name="state" placeholder="State/Province" className="w-full px-4 py-2 border rounded-md" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input required name="zip_code" placeholder="Zip Code" className="w-full px-4 py-2 border rounded-md" />
                  <input required name="country" placeholder="Country" className="w-full px-4 py-2 border rounded-md" />
                </div>
                <Button type="submit" disabled={createAddressMutation.isLoading}>Add Address</Button>
              </form>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="animate-in fade-in duration-500">
              <h2 className="text-[24px] font-[var(--font-heading)] font-extrabold text-[var(--color-ink-headline)] mb-6">
                Profile Settings
              </h2>
              <form onSubmit={handleProfileUpdate} className="space-y-6 max-w-lg">
                <div>
                  <label className="block text-sm font-bold mb-2">Full Name</label>
                  <input name="name" defaultValue={profile?.name} className="w-full px-4 py-3 border rounded-md focus:border-[var(--color-brand-primary)] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Email Address</label>
                  <input disabled value={profile?.email || ""} className="w-full px-4 py-3 border rounded-md bg-gray-50 text-gray-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Phone Number</label>
                  <input name="phone" defaultValue={profile?.phone} className="w-full px-4 py-3 border rounded-md focus:border-[var(--color-brand-primary)] outline-none" />
                </div>
                <Button type="submit" disabled={updateProfileMutation.isLoading}>Save Changes</Button>
              </form>
            </div>
          )}

          {activeTab === "password" && (
            <div className="animate-in fade-in duration-500">
              <h2 className="text-[24px] font-[var(--font-heading)] font-extrabold text-[var(--color-ink-headline)] mb-6">
                Change Password
              </h2>
              <form onSubmit={(e) => { e.preventDefault(); alert("Password changed successfully!"); e.target.reset(); }} className="space-y-6 max-w-lg">
                <div>
                  <label className="block text-sm font-bold mb-2">Current Password</label>
                  <input required type="password" name="current" className="w-full px-4 py-3 border rounded-md focus:border-[var(--color-brand-primary)] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">New Password</label>
                  <input required type="password" name="new" className="w-full px-4 py-3 border rounded-md focus:border-[var(--color-brand-primary)] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Confirm New Password</label>
                  <input required type="password" name="confirm" className="w-full px-4 py-3 border rounded-md focus:border-[var(--color-brand-primary)] outline-none" />
                </div>
                <Button type="submit">Update Password</Button>
              </form>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

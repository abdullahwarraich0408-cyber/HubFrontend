"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { 
  CheckCircle, 
  MapPin, 
  Check, 
  LockKey,
  Copy
} from "@phosphor-icons/react";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { useCart, useCreateOrder } from "@/lib/hooks/useApi";
import { paymentsApi } from "@/lib/api/index";
import { openSignInModal } from "@/lib/authModalEvents";

function hasStoredAuth() {
  if (typeof window === "undefined") return false;
  const token = localStorage.getItem("token");
  return Boolean(token && token !== "cookie-auth-active");
}

export function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, initialized } = useSelector((state) => state.auth);
  const loggedIn = isAuthenticated || hasStoredAuth();
  const { data: cartData, isLoading: cartLoading } = useCart({ enabled: loggedIn });
  const createOrder = useCreateOrder();
  const [step, setStep] = useState(1);
  const [redirecting, setRedirecting] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [guestCartItems, setGuestCartItems] = useState([]);
  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    street: "",
    city: "",
    province: "",
    zip: "",
  });

  useEffect(() => {
    if (!initialized) return;
    if (!loggedIn) {
      openSignInModal({ redirect: "/checkout" });
    }
  }, [initialized, loggedIn]);

  useEffect(() => {
    const success = searchParams.get("success");
    const sessionId = searchParams.get("session_id");
    const cancelled = searchParams.get("cancelled");

    if (cancelled === "true") {
      toast.error("Payment was cancelled");
      return;
    }

    if (success === "true" && sessionId && loggedIn) {
      paymentsApi.verifyStripeSession(sessionId)
        .then((result) => {
          if (result.paid) {
            setOrderId(result.orderIds?.[0] || "ORD-PENDING");
            setStep(3);
            toast.success("Payment successful!");
            window.dispatchEvent(new Event("cart-updated"));
          }
        })
        .catch((error) => {
          toast.error(error.message || "Could not verify payment");
        });
    }
  }, [searchParams, loggedIn]);

  useEffect(() => {
    if (typeof window !== "undefined" && !loggedIn) {
      setGuestCartItems(JSON.parse(localStorage.getItem("guest_cart") || "[]"));
    }
  }, [loggedIn]);

  const cartItems = loggedIn ? (cartData?.items || []) : guestCartItems;
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 2000 ? 0 : 150;
  const total = subtotal + shipping + subtotal * 0.05;

  const startStripeCheckout = async (e) => {
    e.preventDefault();

    if (!loggedIn) {
      toast.error("Please sign in to checkout");
      openSignInModal({ redirect: "/checkout" });
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      router.push("/cart");
      return;
    }

    setRedirecting(true);

    try {
      const payload = {
        items: cartItems.map((item) => ({
          product_id: item.productId || item.id,
          quantity: item.quantity,
          unit_price: item.price,
        })),
        delivery_address: {
          street: address.street,
          city: address.city,
          zip: address.zip || "00000",
        },
      };

      const result = await createOrder.mutateAsync(payload);
      const createdOrders = result.orders || (result.order ? [result.order] : []);
      const orderIds = createdOrders.map((order) => order.id).filter(Boolean);
      const newOrderId = orderIds[0] || `ORD-${Date.now()}`;
      setOrderId(newOrderId);

      const orderTotal = createdOrders.reduce(
        (sum, order) => sum + (order.total_amount || 0),
        0
      );

      const payment = await paymentsApi.checkout({
        order_ids: orderIds,
        total_amount: orderTotal,
        payment_method: "stripe",
        frontend_url: typeof window !== "undefined" ? window.location.origin : undefined,
      });

      if (payment.checkoutUrl) {
        window.location.href = payment.checkoutUrl;
        return;
      }

      throw new Error("Stripe checkout URL was not returned");
    } catch (error) {
      setRedirecting(false);
      toast.error(error.message || "Could not start Stripe checkout");
    }
  };

  if (!initialized || (loggedIn && cartLoading)) {
    return (
      <div className="min-h-[calc(100vh-180px)] bg-[var(--color-surface-subtle)] flex items-center justify-center">
        <p className="text-[14px] text-[var(--color-neutral-500)]">Loading checkout...</p>
      </div>
    );
  }

  if (redirecting) {
    return (
      <div className="min-h-[calc(100vh-180px)] bg-[var(--color-surface-subtle)] flex flex-col items-center justify-center px-4">
        <div className="w-12 h-12 rounded-full border-4 border-[var(--color-brand-primary)] border-t-transparent animate-spin mb-4" />
        <h2 className="text-[20px] font-bold text-[var(--color-ink-headline)] mb-2">Redirecting to Stripe</h2>
        <p className="text-[14px] text-[var(--color-neutral-500)] text-center max-w-sm">
          Please wait while we securely open Stripe checkout to complete your payment.
        </p>
      </div>
    );
  }

  if (!loggedIn) {
    return null;
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(orderId || "ORD-2025-04821");
  };

  const OrderSummary = ({ isCompact = false }) => (
    <div className={`bg-white rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[var(--color-neutral-200)] p-6 ${isCompact ? '' : 'sticky top-24'}`}>
      <h3 className="text-[18px] font-[var(--font-heading)] font-bold text-[var(--color-ink-headline)] mb-5">
        Order Summary
      </h3>

      {!isCompact && cartItems.length > 0 && (
        <div className="space-y-4 mb-6 border-b border-[var(--color-neutral-100)] pb-6">
          {cartItems.map((item) => (
            <div key={item.id} className="flex gap-4">
              <div className="w-[60px] h-[60px] bg-[var(--color-neutral-50)] rounded-[8px] border border-[var(--color-neutral-200)] overflow-hidden shrink-0">
                <img src={item.image} className="w-full h-full object-cover mix-blend-multiply opacity-80" alt={item.name} />
              </div>
              <div className="flex-1">
                <h4 className="text-[14px] font-bold text-[var(--color-ink-900)] leading-snug">{item.name}</h4>
                <p className="text-[12px] font-medium text-[var(--color-neutral-500)]">Qty: {item.quantity}</p>
                <p className="text-[14px] font-bold text-[var(--color-ink-900)] mt-1">Rs {(item.price * item.quantity).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-3">
        <div className="flex justify-between items-center text-[14px]">
          <span className="text-[var(--color-neutral-600)]">Subtotal</span>
          <span className="font-semibold text-[var(--color-neutral-900)]">Rs {subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center text-[14px]">
          <span className="text-[var(--color-neutral-600)]">Delivery</span>
          <span className="font-semibold text-[var(--color-neutral-900)]">Rs {shipping.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center text-[14px]">
          <span className="text-[var(--color-neutral-600)]">Discount</span>
          <span className="font-semibold text-[var(--color-status-success)]">- Rs 0</span>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-dashed border-[var(--color-neutral-200)] flex justify-between items-end">
        <span className="text-[16px] font-bold text-[var(--color-ink-900)]">Total</span>
        <span className="text-[24px] font-black text-[var(--color-brand-primary)] leading-none">
          Rs {total.toLocaleString()}
        </span>
      </div>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-180px)] bg-[var(--color-surface-subtle)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1000px] mx-auto">
        
        {/* Header & Breadcrumbs */}
        <div className="text-center mb-10">
          <h1 className="text-[32px] font-[var(--font-heading)] font-extrabold text-[var(--color-ink-headline)] tracking-tight mb-8">
            Checkout
          </h1>
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-center max-w-[420px] mx-auto">
            <div className="flex flex-col items-center relative z-10">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-[14px] transition-colors duration-500 ${step > 1 ? 'bg-[var(--color-status-success-bg)] text-[var(--color-status-success-text)]' : 'icon-box-light text-[var(--color-brand-primary)]'}`}>
                {step > 1 ? <Check size={20} weight="bold" /> : "1"}
              </div>
              <span className={`text-[12px] font-bold uppercase tracking-wider mt-3 ${step >= 1 ? 'text-[var(--color-ink-900)]' : 'text-[var(--color-neutral-400)]'}`}>Delivery</span>
            </div>

            <div className={`flex-1 h-[2px] -mt-6 transition-colors duration-500 ${step > 1 ? 'bg-[var(--color-status-success)]' : 'bg-[var(--color-neutral-200)]'}`}></div>

            <div className="flex flex-col items-center relative z-10">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-[14px] transition-colors duration-500 ${step === 3 ? 'icon-box-light text-[var(--color-brand-primary)]' : 'bg-white border-2 border-[var(--color-neutral-200)] text-[var(--color-neutral-400)]'}`}>
                {step === 3 ? <Check size={20} weight="bold" /> : "2"}
              </div>
              <span className={`text-[12px] font-bold uppercase tracking-wider mt-3 ${step >= 3 ? 'text-[var(--color-ink-900)]' : 'text-[var(--color-neutral-400)]'}`}>Confirm</span>
            </div>
          </div>
        </div>

        {/* Dynamic Content based on Step */}
        <div className="bg-white lg:bg-transparent rounded-[24px] lg:rounded-none shadow-[0_8px_30px_rgba(0,0,0,0.04)] lg:shadow-none border border-[var(--color-neutral-200)] lg:border-none overflow-hidden">
          
          {step === 1 && (
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 p-6 lg:p-0">
              <div className="w-full lg:w-[60%]">
                <div className="bg-white lg:rounded-[20px] lg:shadow-[0_4px_20px_rgba(0,0,0,0.03)] lg:border border-[var(--color-neutral-200)] lg:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full icon-box-light flex items-center justify-center">
                      <MapPin size={20} weight="fill" className="text-[var(--color-brand-primary)]" />
                    </div>
                    <h2 className="text-[20px] font-bold text-[var(--color-ink-headline)]">Delivery Details</h2>
                  </div>

                  <form onSubmit={startStripeCheckout} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Input label="First Name" required value={address.firstName} onChange={(e) => setAddress({ ...address, firstName: e.target.value })} />
                      <Input label="Last Name" required value={address.lastName} onChange={(e) => setAddress({ ...address, lastName: e.target.value })} />
                    </div>
                    <Input label="Phone Number" type="tel" placeholder="03XX XXXXXXX" required value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} />
                    <Input label="Street Address" placeholder="House/Apartment, Street Name" required value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} />
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Input label="City" required value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
                      <Input label="Province" required value={address.province} onChange={(e) => setAddress({ ...address, province: e.target.value })} />
                    </div>
                    <Input label="Postal Code (Optional)" value={address.zip} onChange={(e) => setAddress({ ...address, zip: e.target.value })} />
                    
                    <div className="space-y-1.5">
                      <label className="block text-[13px] font-bold text-[var(--color-neutral-700)]">Delivery Instructions (Optional)</label>
                      <textarea 
                        className="w-full p-3.5 border border-[var(--color-neutral-300)] rounded-[12px] outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]/20 focus:border-[var(--color-brand-primary)] text-[14px] resize-none h-[100px]"
                        placeholder="e.g., Leave at the reception, call upon arrival..."
                      ></textarea>
                    </div>

                    <label className="flex items-center gap-3 cursor-pointer group pt-2 pb-4">
                      <div className="relative flex items-center">
                        <input type="checkbox" className="peer sr-only" defaultChecked />
                        <div className="w-[18px] h-[18px] rounded-[4px] border-[1.5px] border-[var(--color-neutral-300)] bg-white peer-checked:bg-[var(--color-brand-primary)] peer-checked:border-[var(--color-brand-primary)] transition-all flex items-center justify-center group-hover:border-[var(--color-brand-primary)]">
                          <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <span className="text-[14px] font-medium text-[var(--color-neutral-700)]">Save this address for future orders</span>
                    </label>

                    <Button type="submit" disabled={createOrder.isPending || redirecting} className="w-full h-[52px] text-[15px] shadow-[0_4px_12px_rgba(11,110,114,0.15)] flex justify-center items-center">
                      {createOrder.isPending || redirecting ? "Opening Stripe..." : `Pay Rs ${total.toLocaleString()} with Stripe`}
                    </Button>

                    <div className="flex items-center justify-center gap-2 text-[12px] font-semibold text-[var(--color-neutral-500)]">
                      <LockKey size={14} className="text-[var(--color-status-success)]" />
                      Secure payment powered by Stripe
                    </div>
                  </form>
                </div>
              </div>
              <div className="w-full lg:w-[40%] hidden lg:block">
                <OrderSummary />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="py-12 lg:py-20 px-6 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-700">
              
              <div className="w-24 h-24 bg-[var(--color-status-success)]/10 rounded-full flex items-center justify-center mb-8 relative">
                 <div className="absolute inset-0 rounded-full border-4 border-[var(--color-status-success)] border-t-transparent animate-spin" style={{ animationDuration: '3s', animationIterationCount: 1, animationFillMode: 'forwards' }}></div>
                 <CheckCircle size={56} weight="fill" className="text-[var(--color-status-success)] animate-in zoom-in delay-500 duration-500 fill-mode-both" />
              </div>

              <h1 className="text-[36px] sm:text-[44px] font-[var(--font-heading)] font-extrabold text-[var(--color-ink-headline)] mb-4 tracking-tight">
                Order Placed Successfully!
              </h1>
              
              <p className="text-[16px] text-[var(--color-neutral-600)] font-medium max-w-[400px] mb-8 leading-relaxed">
                Thank you for your purchase. Your order is being prepared by the vendor and will be dispatched soon.
              </p>

              <div className="bg-[var(--color-neutral-50)] border border-[var(--color-neutral-200)] rounded-[16px] p-6 mb-10 w-full max-w-[400px]">
                <p className="text-[13px] font-bold text-[var(--color-neutral-500)] uppercase tracking-wider mb-2">Order Tracking ID</p>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-[20px] font-mono font-bold text-[var(--color-brand-primary)]">#{orderId || "ORD-PENDING"}</span>
                  <button onClick={copyToClipboard} className="text-[var(--color-neutral-400)] hover:text-black transition-colors" title="Copy to clipboard">
                    <Copy size={20} />
                  </button>
                </div>
                <div className="mt-4 pt-4 border-t border-[var(--color-neutral-200)] flex justify-between text-[14px]">
                  <span className="text-[var(--color-neutral-500)] font-medium">Estimated delivery:</span>
                  <span className="font-bold text-[var(--color-ink-900)]">2-4 business days</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-[400px]">
                <Link href="/account" className="flex-1">
                  <Button className="w-full h-[52px]">View Order Details</Button>
                </Link>
                <Link href="/browse" className="flex-1">
                  <Button variant="secondary" className="w-full h-[52px]">Continue Shopping</Button>
                </Link>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

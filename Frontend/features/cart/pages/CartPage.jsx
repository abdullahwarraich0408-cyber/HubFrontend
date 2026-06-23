"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/shared/components/Badge";
import { api } from "@/lib/api";
import { useEffect } from "react";
import { toast } from "sonner";
import { 
  Trash, 
  Plus, 
  Minus, 
  Tag, 
  ArrowRight, 
  LockKey, 
  ShieldCheck, 
  ShoppingCart,
  ArrowLeft
} from "@phosphor-icons/react";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";

export function CartPage() {
  const router = useRouter();
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      setIsAuthenticated(!!token);

      try {
        if (token) {
          const data = await api.cart.get();
          setCartItems(data.cart?.items || data.items || []);
        } else {
          const guestCart = JSON.parse(localStorage.getItem('guest_cart') || '[]');
          setCartItems(guestCart);
        }
      } catch (error) {
        if (!error.message?.toLowerCase().includes("jwt expired")) {
          toast.error("Failed to load cart");
        }
        // Fallback to guest cart if API fails
        const guestCart = JSON.parse(localStorage.getItem('guest_cart') || '[]');
        setCartItems(guestCart);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCart();
    
    const handleCartUpdate = () => fetchCart();
    if (typeof window !== 'undefined') {
      window.addEventListener('cart-updated', handleCartUpdate);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('cart-updated', handleCartUpdate);
      }
    };
  }, []);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 2000 ? 0 : 150;
  const tax = subtotal * 0.05;
  const total = Math.max(0, subtotal + shipping + tax - discount);

  const updateQuantity = async (id, delta) => {
    const item = cartItems.find((entry) => entry.id === id);
    if (!item) return;
    const newQuantity = Math.max(1, item.quantity + delta);
    
    setIsUpdating(true);
    try {
      if (isAuthenticated) {
        await api.cart.update(id, newQuantity);
      } else {
        const guestCart = [...cartItems];
        const idx = guestCart.findIndex(i => i.id === id);
        if (idx > -1) {
          guestCart[idx].quantity = newQuantity;
          localStorage.setItem('guest_cart', JSON.stringify(guestCart));
        }
      }
      setCartItems(items => items.map(i => i.id === id ? { ...i, quantity: newQuantity } : i));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('cart-updated'));
      }
    } catch (err) {
      toast.error(err.message || "Could not update quantity");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveItem = async (id) => {
    try {
      if (isAuthenticated) {
        await api.cart.remove(id);
      } else {
        const guestCart = cartItems.filter(i => i.id !== id);
        localStorage.setItem('guest_cart', JSON.stringify(guestCart));
      }
      setCartItems(items => items.filter(i => i.id !== id));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('cart-updated'));
      }
      toast.success("Item removed");
    } catch (err) {
      toast.error(err.message || "Could not remove item");
    }
  };

  const applyPromo = async () => {
    if (!promoCode.trim()) return;
    setIsApplyingPromo(true);
    try {
      // Temporary mock validation
      if (promoCode.trim().toUpperCase() === "SAVE10") {
        setDiscount(subtotal * 0.1);
        toast.success("Coupon applied");
      } else {
        toast.error("Invalid coupon");
      }
    } catch (error) {
      toast.error("Invalid coupon");
      setDiscount(0);
    } finally {
      setIsApplyingPromo(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-180px)] flex items-center justify-center bg-[var(--color-surface-subtle)]">
        <p className="text-[15px] text-[var(--color-neutral-500)]">Loading cart...</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[calc(100vh-180px)] flex items-center justify-center bg-[var(--color-surface-subtle)] py-12 px-4">
        <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[var(--color-neutral-200)] p-12 max-w-[500px] w-full text-center">
          <div className="w-24 h-24 bg-[var(--color-neutral-100)] rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart size={48} className="text-[var(--color-neutral-400)]" weight="duotone" />
          </div>
          <h2 className="text-[28px] font-[var(--font-heading)] font-bold text-[var(--color-ink-headline)] mb-3">
            Your cart is empty
          </h2>
          <p className="text-[15px] text-[var(--color-neutral-500)] mb-8 leading-relaxed">
            Looks like you haven&apos;t added any medicines or health products to your cart yet.
          </p>
          <Link href="/browse">
            <Button className="w-full h-[48px] font-bold shadow-[0_4px_12px_rgba(11,110,114,0.15)]">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-180px)] bg-[var(--color-surface-subtle)] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-[32px] font-[var(--font-heading)] font-extrabold text-[var(--color-ink-headline)] tracking-tight">
              Shopping Cart
            </h1>
            <p className="text-[14px] text-[var(--color-neutral-600)] mt-1 font-medium">
              You have {cartItems.length} items in your cart
            </p>
          </div>
          <Link href="/browse" className="hidden sm:flex items-center text-[14px] font-semibold text-[var(--color-brand-primary)] hover:text-[var(--color-brand-dark)] transition-colors group">
            <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Continue Shopping
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Column: Cart Items */}
          <div className="w-full lg:w-[65%] space-y-4">
            <div className="bg-white rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[var(--color-neutral-200)] overflow-hidden">
              
              {/* Desktop Table Header */}
              <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-4 bg-[var(--color-neutral-50)] border-b border-[var(--color-neutral-200)] text-[12px] font-bold text-[var(--color-neutral-500)] uppercase tracking-wider">
                <div className="col-span-6">Product Details</div>
                <div className="col-span-3 text-center">Quantity</div>
                <div className="col-span-2 text-right">Price</div>
                <div className="col-span-1"></div>
              </div>

              {/* Items List */}
              <div className="divide-y divide-[var(--color-neutral-100)]">
                {cartItems.map((item) => (
                  <div key={item.id} className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-6 p-5 sm:p-6 items-center group hover:bg-[var(--color-neutral-50)] transition-colors">
                    
                    {/* Product Info */}
                    <div className="col-span-1 sm:col-span-6 flex gap-4 items-start sm:items-center">
                      <div className="w-[80px] h-[80px] sm:w-[90px] sm:h-[90px] rounded-[12px] overflow-hidden bg-[var(--color-neutral-100)] border border-[var(--color-neutral-200)] shrink-0 relative">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover mix-blend-multiply opacity-90 group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex flex-col justify-center">
                        <h3 className="text-[15px] font-bold text-[var(--color-neutral-900)] leading-snug mb-1">
                          {item.name}
                        </h3>
                        <p className="text-[13px] font-medium text-[var(--color-brand-primary)] mb-2">
                          By {item.vendor}
                        </p>
                        <div className="flex items-center gap-2">
                          {item.inStock ? (
                            <Badge variant="success" className="text-[10px] px-2 py-0.5">In Stock</Badge>
                          ) : (
                            <Badge variant="error" className="text-[10px] px-2 py-0.5">Out of Stock</Badge>
                          )}
                        </div>
                        <div className="sm:hidden mt-3 font-bold text-[16px] text-[var(--color-neutral-900)]">
                          Rs {item.price.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {/* Quantity Control */}
                    <div className="col-span-1 sm:col-span-3 flex justify-start sm:justify-center mt-2 sm:mt-0">
                      <div className="flex items-center border border-[var(--color-neutral-200)] rounded-full bg-white shadow-sm overflow-hidden h-[36px]">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          disabled={item.quantity <= 1 || isUpdating}
                          className="w-10 h-full flex items-center justify-center text-[var(--color-neutral-500)] hover:text-[var(--color-neutral-900)] hover:bg-[var(--color-neutral-100)] transition-colors disabled:opacity-50"
                        >
                          <Minus size={14} weight="bold" />
                        </button>
                        <span className="w-10 text-center text-[14px] font-bold text-[var(--color-neutral-900)]">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          disabled={isUpdating}
                          className="w-10 h-full flex items-center justify-center text-[var(--color-neutral-500)] hover:text-[var(--color-neutral-900)] hover:bg-[var(--color-neutral-100)] transition-colors"
                        >
                          <Plus size={14} weight="bold" />
                        </button>
                      </div>
                    </div>

                    {/* Desktop Price */}
                    <div className="hidden sm:block col-span-2 text-right">
                      <span className="text-[16px] font-bold text-[var(--color-neutral-900)]">
                        Rs {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>

                    {/* Delete Action */}
                    <div className="hidden sm:flex col-span-1 justify-end">
                      <button 
                        onClick={() => handleRemoveItem(item.id)}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--color-neutral-400)] hover:text-[var(--color-status-danger)] hover:bg-[var(--color-status-danger)]/10 transition-colors"
                        title="Remove item"
                      >
                        <Trash size={18} weight="fill" />
                      </button>
                    </div>

                    {/* Mobile Delete */}
                    <button 
                      onClick={() => handleRemoveItem(item.id)}
                      className="sm:hidden absolute top-5 right-5 text-[var(--color-neutral-400)] hover:text-[var(--color-status-danger)] transition-colors"
                    >
                      <Trash size={18} weight="fill" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-[13px] text-[var(--color-neutral-500)] mt-4 pl-2">
              <ShieldCheck size={16} className="text-[var(--color-status-success)]" />
              <span>Items in your cart are not reserved. Checkout now to secure your order.</span>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="w-full lg:w-[35%]">
            <div className="bg-white rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[var(--color-neutral-200)] overflow-hidden sticky top-24">
              
              <div className="p-6 border-b border-[var(--color-neutral-100)]">
                <h2 className="text-[20px] font-[var(--font-heading)] font-bold text-[var(--color-ink-headline)] mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4">
                  <div className="flex justify-between items-center text-[14px]">
                    <span className="text-[var(--color-neutral-600)]">Subtotal ({cartItems.length} items)</span>
                    <span className="font-semibold text-[var(--color-neutral-900)]">Rs {subtotal.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-[14px]">
                    <span className="text-[var(--color-neutral-600)]">Shipping Estimate</span>
                    <span className="font-semibold text-[var(--color-neutral-900)]">
                      {shipping === 0 ? (
                        <span className="text-[var(--color-status-success)]">Free</span>
                      ) : (
                        `Rs ${shipping.toLocaleString()}`
                      )}
                    </span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between items-center text-[14px]">
                      <span className="text-[var(--color-neutral-600)]">Discount</span>
                      <span className="font-semibold text-[var(--color-status-success)]">- Rs {discount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-[14px]">
                    <span className="text-[var(--color-neutral-600)]">Tax (5%)</span>
                    <span className="font-semibold text-[var(--color-neutral-900)]">Rs {tax.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-dashed border-[var(--color-neutral-200)] flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-[16px] font-bold text-[var(--color-ink-900)]">Total</span>
                    <span className="text-[11px] text-[var(--color-neutral-500)] uppercase tracking-wider font-semibold mt-1">Including VAT</span>
                  </div>
                  <span className="text-[26px] font-black text-[var(--color-brand-primary)] leading-none">
                    Rs {total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Promo Code */}
              <div className="p-6 bg-[var(--color-neutral-50)] border-b border-[var(--color-neutral-200)]">
                <label className="text-[13px] font-bold text-[var(--color-neutral-700)] mb-3 block flex items-center gap-2">
                  <Tag size={16} /> Have a promo code?
                </label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Enter code" 
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1"
                    style={{ height: '42px' }}
                  />
                  <Button
                    variant="secondary"
                    className="h-[44px] px-6 text-[13px] font-bold bg-white"
                    onClick={applyPromo}
                    disabled={isApplyingPromo}
                  >
                    Apply
                  </Button>
                </div>
              </div>

              <div className="p-6">
                <Link href="/checkout">
                  <Button className="w-full h-[54px] text-[16px] font-bold rounded-[var(--radius-lg)] bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-dark)] shadow-[0_8px_20px_rgba(11,110,114,0.25)] hover:shadow-[0_12px_25px_rgba(11,110,114,0.35)] hover:-translate-y-[2px] transition-all group border-none mb-4 flex justify-center items-center">
                    Proceed to Checkout
                    <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" weight="bold" />
                  </Button>
                </Link>
                
                <div className="flex items-center justify-center gap-2 text-[12px] font-semibold text-[var(--color-neutral-500)]">
                  <LockKey size={14} />
                  Secure Checkout Guaranteed
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { CreditCard, LockKey } from "@phosphor-icons/react";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import {
  clearLabCart,
  getLabCart,
  groupCartByLab,
  removeFromLabCart,
} from "@/lib/labCart";
import { useCreateLabOrder, useLabTestTimeSlots } from "@/lib/hooks/useApi";
import { paymentsApi } from "@/lib/api/index";
import { TIME_SLOTS } from "../data/mockLabTests";
import { openSignInModal } from "@/lib/authModalEvents";

export function LabCartPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [cart, setCart] = useState([]);
  const createOrder = useCreateLabOrder();
  const { data: apiTimeSlots = [] } = useLabTestTimeSlots();
  const timeSlots = apiTimeSlots.length > 0 ? apiTimeSlots : TIME_SLOTS;

  const [patient, setPatient] = useState({ name: "", gender: "", age: "", phone: "" });
  const [address, setAddress] = useState({ line: "", city: "Karachi", phone: "" });
  const [collectionType, setCollectionType] = useState("HOME");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [collectionDate, setCollectionDate] = useState(new Date().toISOString().slice(0, 10));
  const [prescriptionUrl, setPrescriptionUrl] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    router.replace("/lab-tests");
  }, [router]);

  useEffect(() => {
    setCart(getLabCart());
    const refresh = () => setCart(getLabCart());
    window.addEventListener("lab-cart-updated", refresh);
    return () => window.removeEventListener("lab-cart-updated", refresh);
  }, []);

  useEffect(() => {
    if (user?.name) {
      setPatient((p) => ({
        ...p,
        name: p.name && p.name.trim() !== "" ? p.name : user.name,
      }));
    }
    if (user?.phone) {
      setPatient((p) => ({
        ...p,
        phone: p.phone && p.phone.trim() !== "" ? p.phone : user.phone,
      }));
      setAddress((a) => ({
        ...a,
        phone: a.phone && a.phone.trim() !== "" ? a.phone : user.phone,
      }));
    }
  }, [user]);

  useEffect(() => {
    if (collectionType === "HOME" && paymentMethod === "cod") {
      setPaymentMethod("stripe");
    }
  }, [collectionType, paymentMethod]);

  const groups = groupCartByLab(cart);
  const total = cart.reduce((sum, t) => sum + (t.price || 0), 0);
  const hasFasting = cart.some((t) => t.fastingRequired);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      openSignInModal({ redirect: "/lab-tests/cart" });
      return;
    }
    if (!cart.length || !selectedSlot || !patient.name || !patient.phone) {
      toast.error("Please complete all required fields");
      return;
    }
    if (collectionType === "HOME" && (!address.line || !address.phone)) {
      toast.error("Home collection address is required");
      return;
    }

    setPaying(true);
    try {
      const method = collectionType === "HOME" ? "stripe" : paymentMethod;
      const result = await createOrder.mutateAsync({
        lab_test_ids: cart.map((t) => t.id),
        patient_name: patient.name,
        patient_gender: patient.gender,
        patient_age: patient.age ? Number(patient.age) : undefined,
        collection_type: collectionType,
        collection_address: collectionType === "HOME" ? { ...address, phone: patient.phone } : undefined,
        collection_date: new Date(collectionDate).toISOString(),
        time_slot: selectedSlot,
        payment_method: method,
        prescription_url: prescriptionUrl || undefined,
      });

      if (method === "stripe") {
        const bookings = result.orders || [];
        const bookingIds = bookings.map((b) => b.id).filter(Boolean);
        const groupIds = result.order_groups || [];
        toast.message("Redirecting to Stripe to pay…");

        if (groupIds.length === 1) {
          const payment = await paymentsApi.checkout({
            purpose: "lab",
            order_group_id: groupIds[0],
            payment_method: "stripe",
            frontend_url: typeof window !== "undefined" ? window.location.origin : undefined,
          });
          clearLabCart();
          if (payment.checkoutUrl) {
            window.location.href = payment.checkoutUrl;
            return;
          }
          throw new Error("Stripe checkout URL was not returned");
        }

        if (bookingIds.length) {
          const payment = await paymentsApi.checkout({
            purpose: "lab",
            booking_ids: bookingIds,
            payment_method: "stripe",
            frontend_url: typeof window !== "undefined" ? window.location.origin : undefined,
          });
          clearLabCart();
          if (payment.checkoutUrl) {
            window.location.href = payment.checkoutUrl;
            return;
          }
          throw new Error("Stripe checkout URL was not returned");
        }

        throw new Error("No lab bookings to pay for");
      }

      clearLabCart();
      toast.success("Booked — pay cash at the lab when your sample is collected");
      router.push("/orders");
    } catch (e) {
      toast.error(e.message || "Checkout failed");
    } finally {
      setPaying(false);
    }
  };

  if (!cart.length) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-[24px] font-bold mb-2">Your lab cart is empty</h1>
        <p className="text-neutral-500 mb-6">Browse tests and add them to cart.</p>
        <Link href="/lab-tests">
          <Button>Browse Lab Tests</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[960px] mx-auto px-4 py-8">
      <h1 className="text-[28px] font-bold mb-6">Lab Cart</h1>

      <div className="grid lg:grid-cols-[1fr_360px] gap-8">
        <div className="space-y-6">
          {groups.map((group) => (
            <div key={group.labPartnerId || group.lab || "lab"} className="bg-white border border-neutral-200 rounded-[16px] p-5">
              <h2 className="text-[16px] font-bold mb-3">{group.lab || "Lab"}</h2>
              <ul className="space-y-3">
                {group.tests.map((t) => (
                  <li key={t.id} className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[14px] font-semibold">{t.name}</p>
                      <p className="text-[12px] text-neutral-500">
                        PKR {Number(t.price || 0).toLocaleString()}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="text-[12px] text-red-600 font-semibold"
                      onClick={() => {
                        const targetId = t.id || t.testId || t.product_id;
                        removeFromLabCart(targetId);
                        setCart(getLabCart());
                      }}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="bg-white border border-neutral-200 rounded-[16px] p-5 space-y-4">
            <h2 className="text-[16px] font-bold">Patient & collection</h2>
            <Input
              placeholder="Patient name"
              value={patient.name}
              onChange={(e) => setPatient({ ...patient, name: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                placeholder="Gender"
                value={patient.gender}
                onChange={(e) => setPatient({ ...patient, gender: e.target.value })}
              />
              <Input
                placeholder="Age"
                value={patient.age}
                onChange={(e) => setPatient({ ...patient, age: e.target.value })}
              />
            </div>
            <Input
              placeholder="Phone"
              value={patient.phone}
              onChange={(e) => setPatient({ ...patient, phone: e.target.value })}
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCollectionType("HOME")}
                className={`flex-1 py-2 rounded-[10px] border text-[13px] font-semibold ${
                  collectionType === "HOME" ? "border-brand-primary bg-brand-mist" : "border-neutral-200"
                }`}
              >
                Home
              </button>
              <button
                type="button"
                onClick={() => setCollectionType("VISIT_LAB")}
                className={`flex-1 py-2 rounded-[10px] border text-[13px] font-semibold ${
                  collectionType === "VISIT_LAB"
                    ? "border-brand-primary bg-brand-mist"
                    : "border-neutral-200"
                }`}
              >
                Visit lab
              </button>
            </div>
            {collectionType === "HOME" && (
              <>
                <Input
                  placeholder="Address"
                  value={address.line}
                  onChange={(e) => setAddress({ ...address, line: e.target.value })}
                />
                <Input
                  placeholder="City"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                />
              </>
            )}
            <Input type="date" value={collectionDate} onChange={(e) => setCollectionDate(e.target.value)} />
            <div className="grid grid-cols-2 gap-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedSlot(slot)}
                  className={`py-2 rounded-[10px] border text-[12px] font-semibold ${
                    selectedSlot === slot ? "border-brand-primary bg-brand-mist" : "border-neutral-200"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
            <Input
              placeholder="Prescription URL (optional)"
              value={prescriptionUrl}
              onChange={(e) => setPrescriptionUrl(e.target.value)}
            />
            {hasFasting && <p className="text-[12px] text-amber-700">Some tests require fasting.</p>}
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-[16px] p-5 h-fit sticky top-24 space-y-4">
          <h2 className="text-[16px] font-bold">Checkout</h2>
          <div className="flex justify-between text-[14px]">
            <span>Total</span>
            <span className="font-bold">PKR {total.toLocaleString()}</span>
          </div>

          <div className="space-y-2">
            <p className="text-[13px] font-bold flex items-center gap-2">
              <CreditCard size={16} /> Payment
            </p>
            {(collectionType === "HOME"
              ? [{ id: "stripe", label: "Pay online (Stripe)" }]
              : [
                  { id: "stripe", label: "Pay online (Stripe)" },
                  { id: "cod", label: "Pay cash at lab" },
                ]
            ).map((method) => (
              <button
                key={method.id}
                type="button"
                onClick={() => setPaymentMethod(method.id)}
                className={`w-full text-left px-3 py-2.5 rounded-[10px] border-2 text-[13px] font-semibold ${
                  paymentMethod === method.id
                    ? "border-brand-primary bg-brand-mist"
                    : "border-neutral-200"
                }`}
              >
                {method.label}
              </button>
            ))}
          </div>

          <p className="text-[12px] text-neutral-500 flex items-center gap-1.5">
            <LockKey size={14} />
            {collectionType === "HOME" || paymentMethod === "stripe"
              ? "PDF report unlocks after Stripe payment."
              : "Lab staff mark cash received when sample is collected — then PDF unlocks."}
          </p>

          <Button
            className="w-full h-[48px]"
            disabled={createOrder.isPending || paying}
            onClick={handleCheckout}
          >
            {createOrder.isPending || paying
              ? "Processing..."
              : paymentMethod === "stripe"
                ? "Pay with Stripe"
                : "Book — pay cash at lab"}
          </Button>
        </div>
      </div>
    </div>
  );
}

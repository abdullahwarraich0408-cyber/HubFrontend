"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import {
  clearLabCart,
  getLabCart,
  groupCartByLab,
  removeFromLabCart,
} from "@/lib/labCart";
import { useCreateLabOrder, useLabTestTimeSlots } from "@/lib/hooks/useApi";
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

  useEffect(() => {
    setCart(getLabCart());
    const refresh = () => setCart(getLabCart());
    window.addEventListener("lab-cart-updated", refresh);
    return () => window.removeEventListener("lab-cart-updated", refresh);
  }, []);

  useEffect(() => {
    if (user?.name) setPatient((p) => ({ ...p, name: user.name }));
    if (user?.phone) {
      setPatient((p) => ({ ...p, phone: user.phone }));
      setAddress((a) => ({ ...a, phone: user.phone }));
    }
  }, [user]);

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

    try {
      await createOrder.mutateAsync({
        lab_test_ids: cart.map((t) => t.id),
        patient_name: patient.name,
        patient_gender: patient.gender,
        patient_age: patient.age ? Number(patient.age) : undefined,
        collection_type: collectionType,
        collection_address: collectionType === "HOME" ? { ...address, phone: patient.phone } : undefined,
        collection_date: new Date(collectionDate).toISOString(),
        time_slot: selectedSlot,
        payment_method: "cod",
        prescription_url: prescriptionUrl || undefined,
      });
      clearLabCart();
      toast.success("Lab order placed successfully");
      router.push("/orders");
    } catch (e) {
      toast.error(e.message || "Checkout failed");
    }
  };

  if (!cart.length) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-[24px] font-bold mb-2">Your lab cart is empty</h1>
        <p className="text-neutral-500 mb-6">Browse tests and add them to cart.</p>
        <Link href="/lab-tests"><Button>Browse Lab Tests</Button></Link>
      </div>
    );
  }

  return (
    <div className="max-w-[960px] mx-auto px-4 py-8">
      <h1 className="text-[28px] font-bold mb-6">Lab Test Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {groups.map((group) => (
            <div key={group.labPartnerId || group.lab} className="bg-white border rounded-[16px] p-5">
              <h3 className="font-bold mb-3">{group.lab}</h3>
              {group.tests.map((test) => (
                <div key={test.id} className="flex justify-between py-2 border-b last:border-0 text-[14px]">
                  <span>{test.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-bold">PKR {test.price?.toLocaleString()}</span>
                    <button onClick={() => { removeFromLabCart(test.id); setCart(getLabCart()); }} className="text-status-danger text-[12px]">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="bg-white border rounded-[16px] p-5 space-y-4">
          <h3 className="font-bold">Patient details</h3>
          <Input placeholder="Full name" value={patient.name} onChange={(e) => setPatient({ ...patient, name: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="Gender" value={patient.gender} onChange={(e) => setPatient({ ...patient, gender: e.target.value })} />
            <Input placeholder="Age" type="number" value={patient.age} onChange={(e) => setPatient({ ...patient, age: e.target.value })} />
          </div>
          <Input placeholder="Phone" value={patient.phone} onChange={(e) => setPatient({ ...patient, phone: e.target.value })} />

          <h3 className="font-bold pt-2">Collection</h3>
          <div className="flex gap-2">
            {["HOME", "VISIT_LAB"].map((type) => (
              <button
                key={type}
                onClick={() => setCollectionType(type)}
                className={`flex-1 py-2 rounded-[10px] border text-[13px] font-semibold ${collectionType === type ? "border-brand-primary bg-brand-mist text-brand-primary" : "border-neutral-200"}`}
              >
                {type === "HOME" ? "Home Collection" : "Visit Lab"}
              </button>
            ))}
          </div>

          {collectionType === "HOME" && (
            <>
              <textarea
                value={address.line}
                onChange={(e) => setAddress({ ...address, line: e.target.value })}
                placeholder="Street address"
                rows={2}
                className="w-full px-4 py-3 border rounded-[12px] text-[14px]"
              />
              <Input placeholder="City" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
            </>
          )}

          <Input type="date" value={collectionDate} onChange={(e) => setCollectionDate(e.target.value)} />
          <div className="grid grid-cols-2 gap-2">
            {timeSlots.map((slot) => (
              <button
                key={slot}
                onClick={() => setSelectedSlot(slot)}
                className={`py-2 px-2 rounded-[10px] border text-[12px] ${selectedSlot === slot ? "border-brand-primary bg-brand-mist" : "border-neutral-200"}`}
              >
                {slot}
              </button>
            ))}
          </div>

          <Input placeholder="Prescription URL (optional)" value={prescriptionUrl} onChange={(e) => setPrescriptionUrl(e.target.value)} />

          {hasFasting && (
            <p className="text-[12px] text-amber-700 bg-amber-50 p-3 rounded-[10px]">
              One or more tests require fasting. Please follow preparation instructions.
            </p>
          )}

          <div className="border-t pt-4 flex justify-between font-bold text-[18px]">
            <span>Total</span>
            <span className="text-brand-primary">PKR {total.toLocaleString()}</span>
          </div>

          <p className="text-[12px] text-neutral-500 mb-4">Pay on collection — no online payment required for now.</p>

          <Button className="w-full h-[48px]" disabled={createOrder.isPending} onClick={handleCheckout}>
            {createOrder.isPending ? "Placing order..." : "Place Lab Order"}
          </Button>
        </div>
      </div>
    </div>
  );
}

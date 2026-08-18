"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CloudArrowUp, FileArrowUp, Lightning, MapPin, Spinner, Truck } from "@phosphor-icons/react";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { useCreatePrescriptionOrder } from "@/lib/hooks/useApi";
import { openSignInModal } from "@/lib/authModalEvents";
import { useAuth } from "@/lib/auth/AuthProvider";
import { detectDeliveryAddress } from "@/lib/location";

const ACCEPTED_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const DEFAULT_MEDICINES = [
  { name: "Panadol", quantity: 1, unit_price: 120 },
  { name: "Augmentin 625mg", quantity: 1, unit_price: 380 },
];

function validateFile(file) {
  if (!ACCEPTED_TYPES.includes(file.type)) return "Please upload a PDF, JPG, or PNG file.";
  if (file.size > MAX_FILE_SIZE) return "File size must be 5MB or less.";
  return null;
}

export function PrescriptionUploadZone({ className = "", onSuccess, initialFile = null }) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const inputRef = useRef(null);
  const [file, setFile] = useState(initialFile);

  useEffect(() => {
    if (initialFile) {
      setFile(initialFile);
    }
  }, [initialFile]);
  const [deliveryType, setDeliveryType] = useState("standard");
  const [address, setAddress] = useState({
    street: user?.address || "",
    city: user?.city || "",
    province: "",
    latitude: null,
    longitude: null,
  });
  const [detectedZone, setDetectedZone] = useState(user?.city || "");
  const [isDetectingZone, setIsDetectingZone] = useState(false);
  const createOrder = useCreatePrescriptionOrder();

  const detectZone = useCallback(async (showToast = false) => {
    setIsDetectingZone(true);
    try {
      const detected = await detectDeliveryAddress();
      setAddress((prev) => ({
        ...prev,
        street: prev.street || detected.street || "Main Street",
        city: prev.city || detected.city || "Karachi",
        province: detected.province || prev.province || "Sindh",
        latitude: detected.latitude ?? prev.latitude,
        longitude: detected.longitude ?? prev.longitude,
      }));
      setDetectedZone(detected.zone || detected.city || "Karachi");
      if (showToast && detected.city) {
        toast.success(`Delivery zone detected: ${detected.city}`);
      }
    } catch (err) {
      setAddress((prev) => ({
        ...prev,
        street: prev.street || "Main Street",
        city: prev.city || "Karachi",
      }));
      setDetectedZone((prev) => prev || "Karachi");
      if (showToast) {
        toast.error(err.message || "Could not detect location. Address set to default.");
      }
    } finally {
      setIsDetectingZone(false);
    }
  }, []);

  useEffect(() => {
    detectZone(false);
  }, [detectZone]);

  const openFilePicker = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((selectedFile) => {
    if (!selectedFile) return;
    const error = validateFile(selectedFile);
    if (error) {
      toast.error(error);
      return;
    }
    setFile(selectedFile);
  }, []);

  const handleUpload = useCallback(async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to upload a prescription");
      openSignInModal({ redirect: "/prescription" });
      return;
    }
    if (!file) {
      toast.error("Please choose a prescription file");
      openFilePicker();
      return;
    }
    const error = validateFile(file);
    if (error) return toast.error(error);

    const deliveryAddress = {
      ...address,
      street: address.street.trim() || "Main Street",
      city: address.city.trim() || detectedZone || "Karachi",
    };

    const formData = new FormData();
    formData.append("prescriptionFile", file);
    formData.append("delivery_address", JSON.stringify(deliveryAddress));
    formData.append("delivery_type", deliveryType);
    formData.append("medicines", JSON.stringify(DEFAULT_MEDICINES));

    try {
      const result = await createOrder.mutateAsync(formData);
      toast.success("Prescription sent to the nearest pharmacy");
      if (onSuccess) onSuccess();
      router.push(`/prescription/${result.order.id}`);
    } catch (err) {
      toast.error(err.message || "Failed to upload prescription. Please try again.");
    }
  }, [address, createOrder, deliveryType, detectedZone, file, isAuthenticated, onSuccess, openFilePicker, router]);

  return (
    <div className={className}>
      <p className="text-[15px] md:text-[16px] font-bold text-[var(--color-ink-headline)] mb-4">
        Get medicines delivered at your doorstep
      </p>
      <div className="space-y-4 mb-4">
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: "express", label: "Express", icon: Lightning },
            { id: "standard", label: "Standard", icon: Truck },
          ].map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setDeliveryType(option.id)}
              className={`p-3 rounded-[10px] border text-left ${deliveryType === option.id ? "border-brand-primary bg-brand-mist/40" : "border-neutral-200"}`}
            >
              <option.icon size={18} className="text-brand-primary" />
              <p className="text-[13px] font-bold mt-1">{option.label}</p>
            </button>
          ))}
        </div>
        <div className="rounded-[10px] border border-neutral-200 bg-neutral-50 px-3 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0 text-[12px] text-neutral-600">
            {isDetectingZone ? (
              <Spinner size={16} className="animate-spin shrink-0 text-brand-primary" />
            ) : (
              <MapPin size={16} className="shrink-0 text-brand-primary" />
            )}
            <span className="truncate">
              {isDetectingZone
                ? "Detecting delivery zone..."
                : detectedZone
                  ? `Delivery zone: ${detectedZone}`
                  : "Allow location access to auto-detect your zone"}
            </span>
          </div>
          <button
            type="button"
            onClick={() => detectZone(true)}
            disabled={isDetectingZone}
            className="text-[12px] font-semibold text-brand-primary hover:text-brand-dark disabled:opacity-50 shrink-0"
          >
            Auto detect
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input label="Street" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} />
          <Input label="City" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
        </div>
      </div>
      <div
        role="button"
        tabIndex={0}
        onClick={openFilePicker}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openFilePicker();
          }
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFileChange(e.dataTransfer.files?.[0] || null);
        }}
        className="rounded-[12px] border-2 border-dashed px-5 py-8 text-center border-neutral-300 bg-neutral-50 cursor-pointer hover:border-brand-primary hover:bg-brand-mist/20 transition-colors"
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
          className="hidden"
          onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
        />
        <CloudArrowUp size={28} className="text-brand-primary mx-auto mb-3" weight="duotone" />
        <p className="text-[13px] text-neutral-600 mb-1">
          {file ? file.name : "Click or drag your prescription file here"}
        </p>
        <p className="text-[11px] text-neutral-400 mb-4">PDF, JPG, or PNG up to 5MB</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            type="button"
            variant="secondary"
            leftIcon={<CloudArrowUp size={16} />}
            onClick={(e) => {
              e.stopPropagation();
              openFilePicker();
            }}
          >
            {file ? "Change File" : "Choose File"}
          </Button>
          <Button
            type="button"
            leftIcon={<FileArrowUp size={16} />}
            isLoading={createOrder.isPending}
            disabled={!file || createOrder.isPending}
            onClick={(e) => {
              e.stopPropagation();
              handleUpload();
            }}
          >
            Submit Prescription
          </Button>
        </div>
      </div>
    </div>
  );
}

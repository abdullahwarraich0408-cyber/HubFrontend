import { z } from "zod";

export const testSchema = z.object({
  name: z.string().min(2, "Test name must be at least 2 characters"),
  category: z.string().min(1, "Please select a category"),
  description: z.string().optional().default(""),
  price: z.coerce.number().min(0, "Price must be 0 or greater"),
  discount_price: z.coerce.number().optional().nullable(),
  turnaround: z.string().min(1, "Please select report turnaround time"),
  sample_type: z.string().optional().default("Blood"),
  preparation_instructions: z.string().optional().default(""),
  fasting_required: z.boolean().default(false),
  home_collection_supported: z.boolean().default(true),
  status: z.enum(["active", "inactive"]).default("active"),
});

export const collectorSchema = z.object({
  name: z.string().min(2, "Collector name is required"),
  phone: z.string().min(8, "Valid phone number is required"),
  email: z.string().email("Valid email is required").optional().or(z.literal("")),
  city: z.string().optional().default(""),
  active: z.boolean().default(true),
  notes: z.string().optional().default(""),
});

export const reportUploadSchema = z.object({
  report_file: z.any().optional(),
  report_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  notes: z.string().optional().default(""),
});

export const labSettingsSchema = z.object({
  name: z.string().min(2, "Lab name is required"),
  phone: z.string().min(6, "Phone is required"),
  email: z.string().email("Valid email is required").optional().or(z.literal("")),
  address: z.string().min(3, "Address is required"),
  city: z.string().optional().default(""),
  collectionCities: z.array(z.string()).default([]),
  operatingHours: z.any().optional(),
  homeCollection: z.boolean().default(true),
  collectionFee: z.coerce.number().min(0).default(0),
  license: z.string().optional().default(""),
  bio: z.string().optional().default(""),
});

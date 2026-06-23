"use client";

import { use } from "react";
import { LabDetailPage } from "@/features/lab-tests/pages/LabDetailPage";

export default function LabDetailRoute({ params }) {
  const { id } = use(params);
  return <LabDetailPage labId={id} />;
}

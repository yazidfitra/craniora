"use client";

import { useSearchParams } from "next/navigation";
import { Clock } from "lucide-react";

export default function SessionExpiredBanner() {
  const searchParams = useSearchParams();
  const expired = searchParams.get("expired") === "true";

  if (!expired) return null;

  return (
    <div className="bg-warning/10 border border-warning/30 text-warning rounded-lg px-4 py-3 mb-6 flex items-center gap-3">
      <Clock className="w-5 h-5 shrink-0" />
      <p className="text-sm font-medium">
        Session telah habis, silakan login kembali.
      </p>
    </div>
  );
}

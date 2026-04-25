"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  X,
  CalendarPlus,
  Share2,
  UserCircle,
} from "lucide-react";

export default function FabMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const actions = [
    {
      label: "Tambah Jadwal",
      icon: CalendarPlus,
      href: "/dashboard/schedule",
      color: "bg-primary-400",
    },
    {
      label: "Bagikan Materi",
      icon: Share2,
      href: "/dashboard/notes",
      color: "bg-info",
    },
    {
      label: "Edit Profil",
      icon: UserCircle,
      href: "/dashboard/profile",
      color: "bg-success",
    },
  ];

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Action items */}
      <div className="fixed bottom-20 right-6 lg:bottom-8 lg:right-8 z-50 flex flex-col-reverse items-end gap-3">
        {/* Quick action buttons */}
        {open &&
          actions.map((action, i) => (
            <button
              key={action.label}
              onClick={() => {
                setOpen(false);
                router.push(action.href);
              }}
              className="flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <span className="bg-white text-primary-container text-sm font-semibold px-3 py-1.5 rounded-lg shadow-md whitespace-nowrap">
                {action.label}
              </span>
              <div
                className={`w-11 h-11 ${action.color} text-white rounded-full shadow-lg flex items-center justify-center`}
              >
                <action.icon className="w-5 h-5" />
              </div>
            </button>
          ))}

        {/* Main FAB */}
        <button
          onClick={() => setOpen(!open)}
          className={`w-14 h-14 bg-primary-container text-white rounded-full shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-200 ${
            open ? "rotate-45" : ""
          }`}
        >
          {open ? <X className="w-7 h-7" /> : <Plus className="w-7 h-7" />}
        </button>
      </div>
    </>
  );
}

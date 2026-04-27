"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  CalendarPlus,
  BookOpen,
  ClipboardList,
  Upload,
} from "lucide-react";

export default function FabMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const actions = [
    {
      label: "Tambah Jadwal",
      icon: CalendarPlus,
      href: "/dashboard/schedule",
      color: "bg-blue-500",
    },
    {
      label: "Buat Flashcard",
      icon: BookOpen,
      href: "/dashboard/flashcards/create",
      color: "bg-purple-500",
    },
    {
      label: "Buat Soal Ujian",
      icon: ClipboardList,
      href: "/dashboard/tasks/create",
      color: "bg-green-500",
    },
    {
      label: "Upload Materi",
      icon: Upload,
      href: "/dashboard/notes/upload",
      color: "bg-orange-500",
    },
  ];

  if (!mounted) return null;

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
      <div className="fixed bottom-8 right-6 lg:right-8 z-50 flex flex-col-reverse items-end gap-3">
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
          className={`w-14 h-14 bg-gradient-to-br from-primary-container to-primary-400 text-white rounded-full shadow-xl flex items-center justify-center hover:shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 ${
            open ? "rotate-45 bg-gradient-to-br from-error to-red-600" : ""
          }`}
        >
          <Plus className={`w-7 h-7 transition-transform duration-300 ${open ? "rotate-90" : ""}`} />
        </button>
      </div>
    </>
  );
}

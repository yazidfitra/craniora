"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  User,
  BadgeCheck,
  Mail,
  Phone,
  Camera,
  Save,
  LogOut,
  Loader2,
} from "lucide-react";

interface ProfileFormProps {
  user: {
    id: string;
    email: string;
    fullName: string;
    nim: string;
    phone: string;
    avatarUrl: string | null;
  };
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState(user.fullName);
  const [phone, setPhone] = useState(user.phone);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "File harus berupa gambar." });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: "error", text: "Ukuran foto maksimal 2MB." });
      return;
    }

    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      // 1. Upload new avatar if changed
      if (avatarFile) {
        const formData = new FormData();
        formData.append("file", avatarFile);
        formData.append("userId", user.id);

        const uploadRes = await fetch("/api/upload-avatar", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          const result = await uploadRes.json();
          setMessage({
            type: "error",
            text: result.error || "Gagal upload foto.",
          });
          setSaving(false);
          return;
        }
      }

      // 2. Update profile data
      const res = await fetch("/api/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, phone }),
      });

      if (!res.ok) {
        const result = await res.json();
        setMessage({
          type: "error",
          text: result.error || "Gagal menyimpan profil.",
        });
        setSaving(false);
        return;
      }

      setMessage({ type: "success", text: "Profil berhasil disimpan!" });
      setAvatarFile(null);
      router.refresh();
    } catch {
      setMessage({ type: "error", text: "Terjadi kesalahan." });
    } finally {
      setSaving(false);
    }
  };

  const displayAvatar = avatarPreview || user.avatarUrl;

  const initials = fullName
    ? fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  return (
    <div className="max-w-3xl mx-auto">
      {/* Profile Header Card */}
      <div className="relative mb-10">
        <div className="h-48 rounded-t-3xl bg-primary-container overflow-hidden">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          />
        </div>
        <div className="px-8 -mt-20 flex flex-col md:flex-row items-end gap-6 relative z-10">
          {/* Avatar */}
          <div className="relative">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
            <div className="w-40 h-40 rounded-3xl border-8 border-background overflow-hidden bg-white shadow-xl">
              {displayAvatar ? (
                <Image
                  src={displayAvatar}
                  alt={fullName}
                  width={160}
                  height={160}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-primary-400 flex items-center justify-center text-white text-4xl font-bold">
                  {initials}
                </div>
              )}
            </div>
            <button
              onClick={handleAvatarClick}
              className="absolute bottom-2 right-2 p-2 bg-white rounded-xl shadow-lg border border-slate-100 text-primary-container hover:scale-105 active:scale-95 transition-all"
              type="button"
            >
              <Camera className="w-5 h-5" />
            </button>
          </div>

          {/* Name & Info */}
          <div className="flex-1 pb-4 text-center md:text-left">
            <h2 className="font-[var(--font-heading)] text-[30px] font-semibold text-primary-container leading-tight">
              {fullName || "Nama Pengguna"}
            </h2>
            <p className="text-base text-slate-500">
              {user.nim ? `NIM ${user.nim}` : ""}{" "}
              {user.nim ? "&bull;" : ""} Medical Faculty
            </p>
          </div>
        </div>
      </div>

      {/* Status Message */}
      {message && (
        <div
          className={`mb-6 px-4 py-3 rounded-xl text-sm ${
            message.type === "success"
              ? "bg-success/10 text-success"
              : "bg-error-container text-on-error-container"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Profile Form */}
      <div className="bg-surface-card rounded-3xl border border-primary-50 shadow-[0_4px_24px_rgba(0,27,70,0.04)] p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-xs text-secondary uppercase block ml-1 font-medium tracking-wide">
              Nama Lengkap
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                className="w-full pl-12 pr-4 py-3.5 bg-secondary-100 border-none rounded-xl text-base text-primary-container focus:ring-2 focus:ring-primary-400 transition-all outline-none"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={saving}
              />
            </div>
          </div>

          {/* NIM (readonly) */}
          <div className="space-y-2">
            <label className="text-xs text-secondary uppercase block ml-1 font-medium tracking-wide">
              Nomor Induk Mahasiswa (NIM)
            </label>
            <div className="relative">
              <BadgeCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                className="w-full pl-12 pr-4 py-3.5 bg-slate-100 border-none rounded-xl text-base text-slate-500 cursor-not-allowed outline-none"
                type="text"
                value={user.nim || "-"}
                readOnly
              />
            </div>
          </div>

          {/* Email (readonly) */}
          <div className="space-y-2">
            <label className="text-xs text-secondary uppercase block ml-1 font-medium tracking-wide">
              Alamat Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                className="w-full pl-12 pr-4 py-3.5 bg-slate-100 border-none rounded-xl text-base text-slate-500 cursor-not-allowed outline-none"
                type="email"
                value={user.email}
                readOnly
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="text-xs text-secondary uppercase block ml-1 font-medium tracking-wide">
              Nomor Handphone
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                className="w-full pl-12 pr-4 py-3.5 bg-secondary-100 border-none rounded-xl text-base text-primary-container focus:ring-2 focus:ring-primary-400 transition-all outline-none"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={saving}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col md:flex-row gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-primary-container text-white py-4 rounded-xl font-[var(--font-heading)] font-bold text-base shadow-lg shadow-primary-container/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Simpan Perubahan
              </>
            )}
          </button>
          <form action="/auth/signout" method="post" className="md:hidden">
            <button
              type="submit"
              className="w-full border-2 border-error text-error py-4 rounded-xl font-[var(--font-heading)] font-bold text-base flex items-center justify-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

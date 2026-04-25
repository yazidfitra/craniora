"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import {
  User,
  BadgeCheck,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Camera,
  Pencil,
  Loader2,
} from "lucide-react";
import Link from "next/link";

export default function RegisterForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    nim: "",
    email: "",
    phone: "",
    password: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar (JPG, PNG, dll).");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError("Ukuran foto maksimal 2MB.");
      return;
    }

    setAvatarFile(file);
    setError(null);

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const validate = (): string | null => {
    if (!formData.fullName.trim()) return "Nama lengkap wajib diisi.";
    if (!formData.nim.trim()) return "NIM wajib diisi.";
    if (!formData.email.trim()) return "Email wajib diisi.";
    if (!formData.email.includes("@")) return "Format email tidak valid.";
    if (!formData.phone.trim()) return "Nomor HP wajib diisi.";
    if (!formData.password.trim()) return "Password wajib diisi.";
    if (formData.password.length < 6) return "Password minimal 6 karakter.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    const supabase = createClient();

    try {
      // 1. Sign up the user (this auto-logs them in)
      const { data: signUpData, error: authError } =
        await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
              nim: formData.nim,
              phone: formData.phone,
            },
          },
        });

      if (authError) {
        if (authError.message.includes("already registered")) {
          setError(
            "Email sudah terdaftar. Silakan login atau gunakan email lain."
          );
        } else {
          setError(authError.message);
        }
        setLoading(false);
        return;
      }

      // 2. Upload avatar via server API route (bypasses RLS)
      if (avatarFile && signUpData.user) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", avatarFile);
        uploadFormData.append("userId", signUpData.user.id);

        const uploadRes = await fetch("/api/upload-avatar", {
          method: "POST",
          body: uploadFormData,
        });

        if (!uploadRes.ok) {
          const uploadResult = await uploadRes.json();
          console.error("Avatar upload failed:", uploadResult.error);
          // Avatar upload failed but registration succeeded - continue
        }
      }

      // 3. Sign out so user goes to register-success, not dashboard
      await supabase.auth.signOut();

      // 4. Redirect to success page
      router.push("/register-success");
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
      setLoading(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {error && (
        <div className="bg-error-container text-on-error-container text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Profile Picture Upload */}
      <div className="flex flex-col items-center justify-center space-y-3 mb-4">
        <div className="relative group">
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
            disabled={loading}
          />

          {/* Clickable avatar area */}
          <div
            onClick={handleAvatarClick}
            className={`w-24 h-24 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden transition-all cursor-pointer ${
              avatarPreview
                ? "border-primary-400 border-solid"
                : "bg-secondary-100 border-outline-variant group-hover:border-primary-400"
            }`}
          >
            {avatarPreview ? (
              <Image
                src={avatarPreview}
                alt="Preview foto profil"
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            ) : (
              <Camera className="w-8 h-8 text-outline group-hover:text-primary-400 transition-colors" />
            )}
          </div>

          {/* Edit button */}
          <button
            className="absolute bottom-0 right-0 bg-primary-container text-on-primary p-1.5 rounded-full shadow-md border-2 border-white flex items-center justify-center hover:scale-110 transition-transform"
            type="button"
            onClick={handleAvatarClick}
          >
            <Pencil className="w-3 h-3" />
          </button>
        </div>
        <p className="text-xs text-primary-400 uppercase tracking-widest font-bold">
          {avatarPreview ? "Ganti Foto" : "Add Profile Photo"}
        </p>
      </div>

      {/* Full Name */}
      <div className="space-y-2">
        <label
          className="text-xs text-primary-400 block uppercase tracking-wider font-bold"
          htmlFor="fullName"
        >
          Full Name
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-outline" />
          <input
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-primary-50 focus:border-primary-400 focus:ring-2 focus:ring-primary-50 transition-all outline-none text-sm"
            id="fullName"
            name="fullName"
            placeholder="Dr. John Doe"
            type="text"
            value={formData.fullName}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
      </div>

      {/* NIM */}
      <div className="space-y-2">
        <label
          className="text-xs text-primary-400 block uppercase tracking-wider font-bold"
          htmlFor="nim"
        >
          NIM (Nomor Induk Mahasiswa)
        </label>
        <div className="relative">
          <BadgeCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-outline" />
          <input
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-primary-50 focus:border-primary-400 focus:ring-2 focus:ring-primary-50 transition-all outline-none text-sm"
            id="nim"
            name="nim"
            placeholder="25xxxxxx"
            type="text"
            value={formData.nim}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label
          className="text-xs text-primary-400 block uppercase tracking-wider font-bold"
          htmlFor="email"
        >
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-outline" />
          <input
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-primary-50 focus:border-primary-400 focus:ring-2 focus:ring-primary-50 transition-all outline-none text-sm"
            id="email"
            name="email"
            placeholder="john.doe@academy.edu"
            type="email"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
      </div>

      {/* Phone & Password Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Phone */}
        <div className="space-y-2">
          <label
            className="text-xs text-primary-400 block uppercase tracking-wider font-bold"
            htmlFor="phone"
          >
            No. HP
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-outline" />
            <input
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-primary-50 focus:border-primary-400 focus:ring-2 focus:ring-primary-50 transition-all outline-none text-sm"
              id="phone"
              name="phone"
              placeholder="08xxxxxxxxx"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label
            className="text-xs text-primary-400 block uppercase tracking-wider font-bold"
            htmlFor="password"
          >
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-outline" />
            <input
              className="w-full pl-10 pr-12 py-3 rounded-lg border border-primary-50 focus:border-primary-400 focus:ring-2 focus:ring-primary-50 transition-all outline-none text-sm"
              id="password"
              name="password"
              placeholder="••••••••"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-outline hover:text-primary-400 transition-colors"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="pt-4">
        <button
          className="w-full bg-primary text-on-primary font-bold py-4 rounded-lg shadow-lg shadow-primary-container/10 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Mendaftarkan...
            </>
          ) : (
            "Daftar Sekarang"
          )}
        </button>
      </div>

      {/* Login Link */}
      <div className="text-center mt-6">
        <p className="text-sm text-on-surface-variant">
          Already have an account?{" "}
          <Link
            className="text-primary-400 font-bold hover:underline"
            href="/login"
          >
            Login here
          </Link>
        </p>
      </div>
    </form>
  );
}

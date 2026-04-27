import { Suspense } from "react";
import Image from "next/image";
import LoginForm from "@/components/auth/login-form";
import SessionExpiredBanner from "@/components/auth/session-expired-banner";

export const metadata = {
  title: "Login | Craniora Academy FK UNP 2025",
};

export default function LoginPage() {
  return (
    <div className="w-full max-w-[1100px] grid md:grid-cols-2 bg-white rounded-xl shadow-xl shadow-primary-50/50 border border-primary-50 overflow-hidden">
      {/* Left Side - Branding */}
      <div className="hidden md:flex flex-col justify-between p-12 bg-primary-container relative overflow-hidden">
        {/* Background image overlay */}
        <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-primary-container via-primary-400/20 to-primary-container" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-full overflow-hidden backdrop-blur-sm">
              <Image
                src="/logo-crania.webp"
                alt="Craniora Academy"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-white font-[var(--font-heading)] text-2xl font-semibold">
              Craniora Academy
            </span>
          </div>
          <h1 className="font-[var(--font-heading)] text-4xl font-bold text-white mb-6 leading-tight">
            Excellence in Medical Science.
          </h1>
          <p className="text-primary-50/80 text-base max-w-md leading-relaxed">
            The official learning management system for the Faculty of Medicine,
            Universitas Negeri Padang Class of 2025. Access your medical
            curriculum, treasury reports, and student resources.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="p-8 md:p-16 flex flex-col justify-center bg-white">
        <div className="mb-10">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-6 md:hidden">
            <Image
              src="/logo-crania.webp"
              alt="Craniora Academy Logo"
              width={48}
              height={48}
              className="rounded-full"
            />
            <span className="font-[var(--font-heading)] text-primary-container font-bold text-lg">
              Craniora Academy
            </span>
          </div>

          <h2 className="font-[var(--font-heading)] text-[30px] font-semibold text-primary-container mb-2 leading-tight">
            Selamat Datang
          </h2>
          <p className="text-on-surface-variant text-base leading-relaxed">
            Silakan masuk untuk mengakses portal akademik Anda.
          </p>
        </div>

        {/* Session expired banner */}
        <Suspense fallback={null}>
          <SessionExpiredBanner />
        </Suspense>

        <LoginForm />

        {/* University logos */}
        <div className="mt-12 flex items-center justify-center gap-6 grayscale opacity-50">
          <Image
            src="/logo-crania.webp"
            alt="UNP Logo"
            width={32}
            height={32}
            className="h-8 w-auto rounded-full"
          />
        </div>
      </div>
    </div>
  );
}

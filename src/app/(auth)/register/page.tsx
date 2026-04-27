import Image from "next/image";
import { ClipboardList, Users } from "lucide-react";
import RegisterForm from "@/components/auth/register-form";

export const metadata = {
  title: "Register | Craniora Academy",
};

export default function RegisterPage() {
  return (
    <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 bg-surface-card rounded-xl shadow-xl shadow-primary-container/5 border border-primary-50 overflow-hidden relative z-10">
      {/* Background Decorative Elements (behind the card on mobile) */}

      {/* Left Side: Visual/Branding */}
      <div className="hidden md:flex flex-col justify-between p-12 bg-primary-container text-on-primary">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <Image
              src="/logo-crania.webp"
              alt="Craniora Academy"
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
            <span className="font-[var(--font-heading)] text-2xl font-semibold tracking-tight">
              Craniora Academy
            </span>
          </div>
          <h2 className="font-[var(--font-heading)] text-4xl font-bold mb-6 leading-tight">
            Join the next generation of medical excellence.
          </h2>
          <p className="text-base opacity-80 max-w-md leading-relaxed">
            Access your academic records, class schedules, and collaborative
            research tools in one unified platform designed for the rigors of
            medical school.
          </p>

          {/* Features */}
          <div className="space-y-6 mt-8">
          <div className="flex items-start gap-4">
            <div className="bg-primary-400 p-2 rounded-lg">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">Centralized Repository</p>
              <p className="text-sm opacity-70">
                All lectures and clinical notes in one secure vault.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-primary-400 p-2 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">Student Cohorts</p>
              <p className="text-sm opacity-70">
                Connect with your batchmates and study groups instantly.
              </p>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="p-8 md:p-12 bg-white flex flex-col justify-center">
        <div className="mb-8">
          <h1 className="font-[var(--font-heading)] text-[30px] font-semibold text-primary mb-2 leading-tight">
            Create Account
          </h1>
          <p className="text-sm text-on-surface-variant">
            Complete your registration to access the academy portal.
          </p>
        </div>

        <RegisterForm />
      </div>
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  HelpCircle,
  MessageSquare,
  BookOpen,
  GraduationCap,
  ArrowRight,
  CheckCircle,
  Globe,
  MessageCircle,
  Mail,
} from "lucide-react";

export const metadata = {
  title: "Craniora Academy - Precision in Medical Education",
};

export default function LandingPage() {
  return (
    <div className="bg-background text-on-surface min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between px-6 h-16 w-full fixed top-0 bg-[#fdfaf5]/90 backdrop-blur-md z-50 border-b border-primary-container/10 shadow-sm">
        <div className="flex items-center gap-3">
          <Image
            src="/logo-crania.jpg"
            alt="Craniora Academy"
            width={32}
            height={32}
            className="rounded-full"
          />
          <span className="text-xl font-bold text-primary-container tracking-tight font-[var(--font-heading)]">
            Craniora Academy
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-semibold text-primary-container hover:text-primary-400 transition-colors hidden sm:block"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="bg-primary-container text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-400 transition-colors"
          >
            Daftar
          </Link>
        </div>
      </header>

      <main className="pt-16">
        {/* Hero */}
        <section className="relative px-6 py-16 md:py-24 flex flex-col items-center text-center overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-5 pointer-events-none bg-gradient-to-br from-primary-container via-transparent to-primary-400" />
          <div className="relative z-10 space-y-6 max-w-2xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-container/10 text-primary-container text-xs font-bold uppercase tracking-wider">
              FK UNP 2025
            </span>
            <h1 className="font-[var(--font-heading)] text-4xl md:text-5xl font-bold text-primary-container leading-tight">
              Master Your Medical Journey
            </h1>
            <p className="text-base text-on-surface-variant max-w-lg mx-auto leading-relaxed">
              Platform manajemen kelas untuk Fakultas Kedokteran Universitas
              Negeri Padang. Jadwal, bank soal, flashcards, dan berbagi ilmu
              dalam satu tempat.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/register"
                className="bg-primary-container text-white py-4 px-8 rounded-xl font-semibold shadow-lg hover:bg-primary-400 active:scale-95 transition-all"
              >
                Mulai Sekarang - Gratis
              </Link>
              <Link
                href="/login"
                className="bg-secondary-container text-on-secondary-container py-4 px-8 rounded-xl font-semibold hover:bg-secondary-fixed active:scale-95 transition-all"
              >
                Login
              </Link>
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section className="px-6 py-12 max-w-5xl mx-auto">
          <div className="mb-10">
            <h2 className="font-[var(--font-heading)] text-[30px] font-semibold text-primary-container">
              Fitur Utama
            </h2>
            <p className="text-sm text-on-surface-variant">
              Semua yang kamu butuhkan untuk sukses di FK.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Large Feature */}
            <div className="md:col-span-2 bg-white p-6 rounded-xl border border-primary-50 shadow-sm flex flex-col gap-4">
              <div className="w-12 h-12 rounded-lg bg-info/10 flex items-center justify-center">
                <CalendarDays className="w-6 h-6 text-info" />
              </div>
              <div>
                <h3 className="font-[var(--font-heading)] text-xl font-semibold text-primary-container">
                  Jadwal Kuliah
                </h3>
                <p className="text-sm text-on-surface-variant mt-2">
                  Kelola jadwal kuliah mingguan dengan catatan, link materi
                  dosen, dan sinkronisasi otomatis ke dashboard.
                </p>
              </div>
              <div className="mt-auto pt-4 border-t border-primary-50 flex items-center justify-between text-info">
                <span className="text-sm font-semibold">Lihat Jadwal</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-primary-50 shadow-sm flex flex-col gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-warning" />
              </div>
              <h3 className="font-semibold text-primary-container">
                Bank Soal & Ujian
              </h3>
              <p className="text-xs text-on-surface-variant">
                Latihan soal dengan timer, navigasi soal, dan scoring otomatis.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-primary-50 shadow-sm flex flex-col gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-success" />
              </div>
              <h3 className="font-semibold text-primary-container">
                CraniShare
              </h3>
              <p className="text-xs text-on-surface-variant">
                Berbagi catatan, flashcards, dan materi kuliah dengan
                leaderboard kontributor.
              </p>
            </div>

            {/* Dark Feature */}
            <div className="md:col-span-2 bg-primary-container text-white p-6 rounded-xl flex items-center gap-6 overflow-hidden relative">
              <div className="flex-1 relative z-10">
                <h3 className="font-[var(--font-heading)] text-xl font-semibold">
                  Flashcards & Active Recall
                </h3>
                <p className="text-sm opacity-80 mt-1">
                  Buat deck flashcard manual atau bulk upload CSV. Belajar
                  dengan metode spaced repetition.
                </p>
              </div>
              <div className="relative z-10 bg-white/10 p-4 rounded-full">
                <BookOpen className="w-8 h-8" />
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-10">
                <GraduationCap className="w-32 h-32" />
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="px-6 py-16 bg-secondary-100/50">
          <div className="text-center mb-10 max-w-5xl mx-auto">
            <h2 className="font-[var(--font-heading)] text-[30px] font-semibold text-primary-container">
              Gratis untuk Semua
            </h2>
            <p className="text-sm text-on-surface-variant">
              Craniora Academy gratis untuk seluruh mahasiswa FK UNP 2025.
            </p>
          </div>
          <div className="max-w-md mx-auto">
            <div className="bg-white p-8 rounded-xl border-2 border-primary-container shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-primary-container text-white px-4 py-1 text-[10px] font-bold uppercase rounded-bl-lg">
                FK UNP 2025
              </div>
              <h4 className="text-sm font-bold uppercase tracking-widest text-primary-container">
                Full Access
              </h4>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-4xl font-bold text-primary-container">
                  Gratis
                </span>
              </div>
              <ul className="mt-8 space-y-4">
                {[
                  "Jadwal Kuliah & Catatan",
                  "Bank Soal & Ujian Online",
                  "Flashcards & Active Recall",
                  "CraniShare & Leaderboard",
                  "Profil & Uang Kas",
                  "Tools (Draw Straw, dll)",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm">
                    <CheckCircle className="w-5 h-5 text-success" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="block w-full mt-8 py-3 rounded-lg bg-primary-container text-white font-semibold text-center hover:bg-primary-400 transition-colors"
              >
                Daftar Sekarang
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-16 px-6 bg-primary-container text-white border-t border-white/10">
        <div className="max-w-5xl mx-auto flex flex-col gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-secondary-container" />
              <span className="text-xl font-bold tracking-tight font-[var(--font-heading)]">
                Craniora Academy
              </span>
            </div>
            <p className="text-sm opacity-70 max-w-sm leading-relaxed">
              Platform manajemen kelas untuk Fakultas Kedokteran Universitas
              Negeri Padang Angkatan 2025.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h5 className="font-bold text-xs uppercase tracking-widest text-secondary-container">
                Academy
              </h5>
              <ul className="space-y-3 text-sm opacity-80">
                <li>
                  <Link href="/login" className="hover:text-white transition-colors">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-white transition-colors">
                    Daftar
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h5 className="font-bold text-xs uppercase tracking-widest text-secondary-container">
                Support
              </h5>
              <ul className="space-y-3 text-sm opacity-80">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-6 pt-6 border-t border-white/10">
            <div className="flex gap-4">
              {[Globe, MessageCircle, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
            <p className="text-[10px] opacity-50 uppercase tracking-widest">
              &copy; 2025 Craniora Academy. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

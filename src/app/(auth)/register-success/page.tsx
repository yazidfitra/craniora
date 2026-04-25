import { CheckCircle, LogIn } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Pendaftaran Berhasil | Craniora Academy",
};

export default function RegisterSuccessPage() {
  return (
    <div className="w-full max-w-lg">
      <div className="bg-surface-card rounded-xl border border-primary-50 shadow-lg shadow-primary-container/5 overflow-hidden">
        {/* Success Visual Section */}
        <div className="relative h-48 bg-primary-container flex items-center justify-center">
          {/* Abstract Background Elements */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-0 right-0 w-32 h-32 bg-on-primary-container rounded-full blur-3xl -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary-400 rounded-full blur-3xl -ml-16 -mb-16" />
          </div>
          <div className="relative z-10 bg-white p-6 rounded-full shadow-xl shadow-black/20">
            <CheckCircle
              className="w-16 h-16 text-success"
              fill="currentColor"
              stroke="white"
              strokeWidth={1}
            />
          </div>
        </div>

        {/* Text Content Section */}
        <div className="p-6 text-center">
          <h2 className="font-[var(--font-heading)] text-[30px] font-semibold text-primary-container mb-2 leading-tight">
            Pendaftaran Berhasil!
          </h2>
          <div className="w-16 h-1 bg-secondary-500 mx-auto mb-4 rounded-full" />
          <p className="text-secondary mb-8 leading-relaxed">
            Terima kasih telah bergabung dengan{" "}
            <span className="font-semibold text-primary-400">
              Craniora Academy
            </span>
            . Silakan login untuk mulai menggunakan aplikasi.
          </p>

          {/* Action Button */}
          <Link
            className="inline-flex items-center justify-center w-full bg-primary-container text-on-primary font-[var(--font-heading)] font-semibold text-base px-8 py-4 rounded-lg shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 active:scale-95"
            href="/login"
          >
            Kembali ke Login
            <LogIn className="w-5 h-5 ml-2" />
          </Link>
        </div>

        {/* Footer/Support Section */}
        <div className="px-6 py-4 bg-surface-container-low border-t border-primary-50 text-center">
          <p className="text-xs text-secondary">
            Butuh bantuan?{" "}
            <a
              className="text-primary-400 font-semibold hover:underline"
              href="#"
            >
              Hubungi Tim Akademik
            </a>
          </p>
        </div>
      </div>

      {/* Academic Motto */}
      <p className="mt-8 text-center text-xs text-slate-400 tracking-widest uppercase">
        Methodical Excellence &bull; Medical Community
      </p>
    </div>
  );
}

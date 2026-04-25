"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!email.trim()) {
      setError("Email wajib diisi.");
      setLoading(false);
      return;
    }
    if (!password.trim()) {
      setError("Kata sandi wajib diisi.");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      if (authError.message.includes("Invalid login credentials")) {
        setError("Email atau kata sandi salah. Silakan coba lagi.");
      } else if (authError.message.includes("Email not confirmed")) {
        setError("Email belum dikonfirmasi. Periksa inbox email Anda.");
      } else {
        setError(authError.message);
      }
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="bg-error-container text-on-error-container text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Email */}
      <div>
        <label
          className="block text-xs font-semibold text-primary-400 uppercase tracking-wider mb-2"
          htmlFor="email"
        >
          Email Mahasiswa
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline">
            <Mail className="w-5 h-5" />
          </div>
          <input
            className="block w-full pl-12 pr-4 py-3 bg-secondary-100 border border-border-subtle rounded-lg text-base focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all outline-none"
            id="email"
            name="email"
            placeholder="nama@students.unp.id"
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label
            className="block text-xs font-semibold text-primary-400 uppercase tracking-wider"
            htmlFor="password"
          >
            Kata Sandi
          </label>
          <a
            className="text-xs font-semibold text-primary-400 hover:text-primary transition-colors"
            href="#"
          >
            Lupa sandi?
          </a>
        </div>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline">
            <Lock className="w-5 h-5" />
          </div>
          <input
            className="block w-full pl-12 pr-12 py-3 bg-secondary-100 border border-border-subtle rounded-lg text-base focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all outline-none"
            id="password"
            name="password"
            placeholder="••••••••"
            required
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-outline cursor-pointer hover:text-primary-400 transition-colors"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Remember Me */}
      <div className="flex items-center">
        <input
          className="w-4 h-4 rounded border-border-subtle text-primary-400 focus:ring-primary-400"
          id="remember"
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        />
        <label
          className="ml-2 text-sm text-on-surface-variant"
          htmlFor="remember"
        >
          Ingat saya di perangkat ini
        </label>
      </div>

      {/* Submit */}
      <button
        className="w-full bg-primary-container text-white font-bold py-4 rounded-lg shadow-lg shadow-primary-container/20 hover:bg-primary-400 active:scale-95 transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        type="submit"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Memproses...
          </>
        ) : (
          <>
            Masuk
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>

      {/* Register Link */}
      <div className="mt-10 pt-8 border-t border-border-subtle text-center">
        <p className="text-on-surface-variant text-sm">
          Belum memiliki akun mahasiswa?{" "}
          <Link
            className="text-primary-400 font-bold hover:underline ml-1"
            href="/register"
          >
            Daftar di sini
          </Link>
        </p>
      </div>
    </form>
  );
}

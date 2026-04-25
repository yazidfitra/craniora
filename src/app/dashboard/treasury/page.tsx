"use client";

import {
  Info,
  History,
  CheckCircle,
  Clock,
  HelpCircle,
} from "lucide-react";

interface PaymentMonth {
  month: string;
  status: "lunas" | "pending" | "belum";
  paidDate?: string;
  note?: string;
}

const MONTHLY_FEE = 10000;

const payments: PaymentMonth[] = [
  { month: "Desember", status: "belum", note: "Belum dibayar" },
  { month: "November", status: "belum", note: "Belum dibayar" },
  { month: "Oktober", status: "belum", note: "Belum dibayar" },
  { month: "September", status: "pending", note: "Menunggu verifikasi..." },
  { month: "Agustus", status: "lunas", paidDate: "05 Aug 2025" },
  { month: "Juli", status: "lunas", paidDate: "03 Jul 2025" },
  { month: "Juni", status: "lunas", paidDate: "02 Jun 2025" },
  { month: "Mei", status: "lunas", paidDate: "04 May 2025" },
  { month: "April", status: "lunas", paidDate: "01 Apr 2025" },
  { month: "Maret", status: "lunas", paidDate: "03 Mar 2025" },
  { month: "Februari", status: "lunas", paidDate: "05 Feb 2025" },
  { month: "Januari", status: "lunas", paidDate: "02 Jan 2025" },
];

export default function TreasuryPage() {
  const paidCount = payments.filter((p) => p.status === "lunas").length;
  const pendingCount = payments.filter((p) => p.status === "pending").length;
  const unpaidCount = payments.filter((p) => p.status === "belum").length;
  const totalPaid = paidCount * MONTHLY_FEE;
  const totalUnpaid = (unpaidCount + pendingCount) * MONTHLY_FEE;
  const compliancePct = payments.length > 0 ? Math.round((paidCount / payments.length) * 100) : 0;

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

  const nextDue = payments.find((p) => p.status === "belum" || p.status === "pending");

  return (
    <main className="max-w-[1280px] mx-auto px-4 py-8 pb-24">
      {/* Balance Card */}
      <div className="mb-8 p-6 rounded-xl bg-primary-container text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
        <div className="relative z-10">
          <p className="text-xs text-on-primary-container mb-1 font-medium tracking-wide">
            Iuran Kas Bulanan
          </p>
          <div className="flex items-baseline gap-2">
            <span className="font-[var(--font-heading)] text-4xl font-bold text-white">
              {formatCurrency(MONTHLY_FEE)}
            </span>
            <span className="text-on-primary-container text-sm">/ bulan</span>
          </div>
          {nextDue && (
            <div className="mt-4 flex items-center gap-2 text-on-primary-container bg-white/10 w-fit px-3 py-1.5 rounded-lg backdrop-blur-sm">
              <Info className="w-4 h-4" />
              <p className="text-xs font-medium">
                Belum lunas: {nextDue.month}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Status Pembayaran */}
      <div className="mb-8">
        <h2 className="font-[var(--font-heading)] text-xl font-semibold text-primary-container mb-4 flex items-center gap-2">
          <History className="w-5 h-5" />
          Status Pembayaran
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {payments.map((p) => (
            <div
              key={p.month}
              className={`bg-surface-card rounded-xl p-5 shadow-sm flex justify-between items-center ${
                p.status === "belum"
                  ? "border-2 border-primary-container/20 relative overflow-hidden"
                  : "border border-primary-50"
              }`}
            >
              {p.status === "belum" && (
                <div className="absolute left-0 top-0 h-full w-1 bg-error" />
              )}
              <div>
                <p className="font-[var(--font-heading)] text-xl font-semibold text-primary-container">
                  {p.month}
                </p>
                <p
                  className={`text-xs mt-1 font-medium ${
                    p.status === "belum"
                      ? "text-error"
                      : p.status === "pending"
                        ? "text-warning"
                        : "text-slate-400"
                  }`}
                >
                  {p.status === "lunas"
                    ? `Dibayar ${p.paidDate}`
                    : p.status === "pending"
                      ? p.note || "Menunggu verifikasi..."
                      : p.note || "Belum dibayar"}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    p.status === "lunas"
                      ? "bg-success/10 text-success"
                      : p.status === "pending"
                        ? "bg-warning/10 text-warning"
                        : "bg-error/10 text-error"
                  }`}
                >
                  {p.status === "lunas"
                    ? "Lunas"
                    : p.status === "pending"
                      ? "Pending"
                      : "Belum"}
                </span>
                {p.status === "lunas" && (
                  <CheckCircle className="w-6 h-6 text-success" fill="currentColor" stroke="white" strokeWidth={1.5} />
                )}
                {p.status === "pending" && (
                  <Clock className="w-6 h-6 text-warning" />
                )}
                {p.status === "belum" && (
                  <button className="bg-primary-container text-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-primary-400 transition-colors shadow-sm">
                    Bayar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats + Help */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-secondary-100 rounded-xl p-6 border border-secondary-container">
          <h3 className="font-[var(--font-heading)] text-xl font-semibold text-primary-container mb-4">
            Ringkasan Tabungan
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-secondary-container pb-2">
              <span className="text-sm text-secondary">Total Terbayar</span>
              <span className="text-base font-bold text-primary-container">
                {formatCurrency(totalPaid)}
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-secondary-container pb-2">
              <span className="text-sm text-secondary">Tunggakan</span>
              <span className="text-base font-bold text-error">
                {formatCurrency(totalUnpaid)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-secondary">Persentase Kepatuhan</span>
              <span className="text-base font-bold text-success">{compliancePct}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-primary-50 shadow-sm flex flex-col justify-center items-center text-center">
          <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-4">
            <HelpCircle className="w-8 h-8 text-primary-container" />
          </div>
          <h3 className="font-[var(--font-heading)] text-xl font-semibold text-primary-container">
            Butuh Bantuan?
          </h3>
          <p className="text-sm text-slate-500 mt-2 mb-4">
            Hubungi bendahara kelas jika ada ketidaksesuaian data pembayaran.
          </p>
          <button className="w-full py-3 border border-primary-container text-primary-container rounded-lg font-bold hover:bg-primary-50 transition-colors">
            Hubungi Bendahara
          </button>
        </div>
      </div>
    </main>
  );
}

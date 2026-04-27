"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  LayoutDashboard,
  CalendarDays,
  Wallet,
  Share2,
  Dices,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  UserCircle,
  Menu,
  X,
} from "lucide-react";

// Lazy load FAB menu
const FabMenu = dynamic(() => import("./fab-menu"), {
  ssr: false,
});

interface DashboardShellProps {
  fullName: string;
  email: string;
  avatarUrl?: string | null;
  children: React.ReactNode;
}

const mainNavItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Jadwal", href: "/dashboard/schedule", icon: CalendarDays },
  { label: "CraniShare", href: "/dashboard/notes", icon: Share2 },
  { label: "Uang Kas", href: "/dashboard/treasury", icon: Wallet },
  { label: "Tools", href: "/dashboard/tools", icon: Dices },
];

const secondaryNavItems = [
  { label: "Notifikasi", href: "/dashboard/notifications", icon: Bell },
  { label: "Profil", href: "/dashboard/profile", icon: UserCircle },
  { label: "Pengaturan", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardShell({
  fullName,
  email,
  avatarUrl,
  children,
}: DashboardShellProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const initials = fullName
    ? fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  const isNavActive = (href: string) =>
    href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(href);

  return (
    <>
      {/* ===== DESKTOP SIDEBAR ===== */}
      <aside
        className={`hidden lg:flex flex-col fixed top-0 left-0 h-screen bg-white border-r border-slate-200 z-50 transition-all duration-300 ${
          collapsed ? "w-[72px]" : "w-[260px]"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-slate-200 shrink-0">
          <div className="w-9 h-9 rounded-full overflow-hidden shrink-0">
            <Image
              src="/logo-crania.webp"
              alt="Craniora Academy"
              width={36}
              height={36}
              className="w-full h-full object-cover"
            />
          </div>
          {!collapsed && (
            <span className="font-[var(--font-heading)] text-primary-container font-bold text-base truncate">
              Craniora Academy
            </span>
          )}
        </div>

        {/* Main Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p
            className={`text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-2 ${
              collapsed ? "text-center" : "px-3"
            }`}
          >
            {collapsed ? "---" : "Menu Utama"}
          </p>
          {mainNavItems.map((item) => {
            const active = isNavActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  active
                    ? "bg-primary-container text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-primary-container"
                } ${collapsed ? "justify-center" : ""}`}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}

          <div className="pt-4">
            <p
              className={`text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-2 ${
                collapsed ? "text-center" : "px-3"
              }`}
            >
              {collapsed ? "---" : "Lainnya"}
            </p>
            {secondaryNavItems.map((item) => {
              const active = isNavActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    active
                      ? "bg-primary-container text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-primary-container"
                  } ${collapsed ? "justify-center" : ""}`}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="mx-3 mb-2 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span>Tutup Sidebar</span>
            </>
          )}
        </button>

        {/* User Profile + Logout */}
        <div className="border-t border-slate-200 px-3 py-3 shrink-0">
          <div
            className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}
          >
            <div className="w-9 h-9 rounded-full overflow-hidden bg-primary-400 flex items-center justify-center shrink-0">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={fullName}
                  width={36}
                  height={36}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white text-xs font-bold">{initials}</span>
              )}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-primary-container truncate">
                  {fullName}
                </p>
                <p className="text-[11px] text-slate-400 truncate">{email}</p>
              </div>
            )}
            {!collapsed && (
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-error hover:bg-error/5 transition-colors"
                  title="Keluar"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </aside>

      {/* ===== MOBILE HEADER ===== */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40 flex justify-between items-center w-full px-4 h-16 lg:hidden">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 rounded-lg hover:bg-slate-50 transition-colors text-primary-container"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        <span className="text-lg font-bold text-primary-container font-[var(--font-heading)]">
          Craniora Academy
        </span>

        <Link href="/dashboard/profile" className="p-2">
          <div className="w-9 h-9 rounded-full overflow-hidden border border-primary-50 bg-primary-400 flex items-center justify-center">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={fullName || "Profile"}
                width={36}
                height={36}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white text-xs font-bold">{initials}</span>
            )}
          </div>
        </Link>
      </header>

      {/* ===== MOBILE SLIDE-IN SIDEBAR ===== */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-50 lg:hidden animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Sidebar */}
          <aside className="fixed top-0 left-0 h-screen w-[280px] bg-white z-[60] shadow-2xl lg:hidden flex flex-col animate-in slide-in-from-left duration-300">
            {/* Header */}
            <div className="flex items-center justify-between px-4 h-16 border-b border-slate-200 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full overflow-hidden">
                  <Image
                    src="/logo-crania.webp"
                    alt="Craniora Academy"
                    width={36}
                    height={36}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="font-[var(--font-heading)] text-primary-container font-bold text-base">
                  Craniora Academy
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-50 transition-colors text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-2 px-3">
                Menu Utama
              </p>
              {mainNavItems.map((item) => {
                const active = isNavActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                      active
                        ? "bg-primary-container text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-50 hover:text-primary-container"
                    }`}
                  >
                    <item.icon className="w-5 h-5 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              <div className="pt-4">
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-2 px-3">
                  Lainnya
                </p>
                {secondaryNavItems.map((item) => {
                  const active = isNavActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                        active
                          ? "bg-primary-container text-white shadow-sm"
                          : "text-slate-600 hover:bg-slate-50 hover:text-primary-container"
                      }`}
                    >
                      <item.icon className="w-5 h-5 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* User Profile + Logout */}
            <div className="border-t border-slate-200 px-3 py-3 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full overflow-hidden bg-primary-400 flex items-center justify-center shrink-0">
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt={fullName}
                      width={36}
                      height={36}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-xs font-bold">{initials}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-primary-container truncate">
                    {fullName}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">{email}</p>
                </div>
                <form action="/auth/signout" method="post">
                  <button
                    type="submit"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-error hover:bg-error/5 transition-colors"
                    title="Keluar"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          </aside>
        </>
      )}

      {/* ===== MAIN CONTENT ===== */}
      <div
        className="pb-8 transition-all duration-300"
      >
        <div
          className="transition-all duration-300 lg:ml-[var(--sidebar-width)]"
          style={
            {
              "--sidebar-width": collapsed ? "72px" : "260px",
            } as React.CSSProperties
          }
        >
          {children}
        </div>
      </div>

      {/* ===== FAB with Quick Actions ===== */}
      <FabMenu />
    </>
  );
}

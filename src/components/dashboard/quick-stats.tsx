import {
  CalendarDays,
  ClipboardList,
  UserCheck,
  Wallet,
  ArrowRight,
  AlertTriangle,
  TrendingUp,
  CheckCircle,
} from "lucide-react";

interface QuickStatsProps {
  scheduleCount: number;
  nextScheduleTime: string | null;
  nextScheduleSubject: string | null;
}

export default function QuickStats({
  scheduleCount,
  nextScheduleTime,
  nextScheduleSubject,
}: QuickStatsProps) {
  const stats = [
    {
      label: "Jadwal",
      value: nextScheduleTime || (scheduleCount > 0 ? `${scheduleCount}` : "-"),
      icon: CalendarDays,
      iconBg: "bg-primary-fixed",
      iconColor: "text-on-primary-fixed",
      badge: nextScheduleSubject || (scheduleCount === 0 ? "Tidak ada jadwal" : `${scheduleCount} mata kuliah`),
      badgeIcon: ArrowRight,
      badgeColor: scheduleCount > 0 ? "text-success" : "text-slate-400",
    },
    {
      label: "Tugas",
      value: "-",
      icon: ClipboardList,
      iconBg: "bg-secondary-container",
      iconColor: "text-on-secondary-container",
      badge: "Segera hadir",
      badgeIcon: AlertTriangle,
      badgeColor: "text-secondary",
    },
    {
      label: "Kehadiran",
      value: "-",
      icon: UserCheck,
      iconBg: "bg-primary-50",
      iconColor: "text-primary-400",
      badge: "Segera hadir",
      badgeIcon: TrendingUp,
      badgeColor: "text-secondary",
    },
    {
      label: "Kas",
      value: "-",
      icon: Wallet,
      iconBg: "bg-tertiary-fixed",
      iconColor: "text-on-tertiary-fixed",
      badge: "Segera hadir",
      badgeIcon: CheckCircle,
      badgeColor: "text-secondary",
    },
  ];

  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-surface-card p-[1.5rem] rounded-xl border border-primary-50 shadow-sm hover:shadow-md transition-all duration-200 group"
        >
          <div className="flex justify-between items-start mb-4">
            <div
              className={`p-2 ${stat.iconBg} ${stat.iconColor} rounded-lg`}
            >
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
          <div className="text-xs text-secondary mb-1 tracking-wide">
            {stat.label}
          </div>
          <div className="font-[var(--font-heading)] text-primary-container text-2xl font-semibold">
            {stat.value}
          </div>
          <div
            className={`text-[10px] ${stat.badgeColor} font-medium flex items-center mt-2`}
          >
            <stat.badgeIcon className="w-3 h-3 mr-1" />
            {stat.badge}
          </div>
        </div>
      ))}
    </section>
  );
}

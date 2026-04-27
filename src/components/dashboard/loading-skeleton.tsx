export function DashboardSkeleton() {
  return (
    <main className="max-w-[1280px] mx-auto px-4 pt-8 space-y-8">
      {/* Greeting Skeleton */}
      <section className="space-y-1">
        <div className="h-10 w-48 bg-slate-200 rounded-lg animate-pulse" />
        <div className="h-5 w-64 bg-slate-100 rounded animate-pulse" />
      </section>

      {/* Daily Quote Skeleton */}
      <div className="bg-gradient-to-br from-primary-container to-primary-400 rounded-2xl p-6 shadow-lg">
        <div className="h-6 w-3/4 bg-white/20 rounded animate-pulse mb-2" />
        <div className="h-4 w-32 bg-white/10 rounded animate-pulse" />
      </div>

      {/* Quick Stats Skeleton */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-surface-card p-6 rounded-xl border border-primary-50 shadow-sm"
          >
            <div className="h-10 w-10 bg-slate-200 rounded-lg animate-pulse mb-4" />
            <div className="h-4 w-16 bg-slate-100 rounded animate-pulse mb-2" />
            <div className="h-8 w-12 bg-slate-200 rounded animate-pulse" />
          </div>
        ))}
      </section>

      {/* Content Grid Skeleton */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="h-64 bg-surface-card rounded-2xl border border-primary-50 shadow-sm animate-pulse" />
        </div>
        <div className="space-y-6">
          <div className="h-32 bg-surface-card rounded-2xl border border-primary-50 shadow-sm animate-pulse" />
          <div className="h-64 bg-surface-card rounded-2xl border border-primary-50 shadow-sm animate-pulse" />
        </div>
      </section>
    </main>
  );
}

export function ScheduleSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-surface-card rounded-xl border border-primary-50 p-4 shadow-sm"
        >
          <div className="h-4 w-24 bg-slate-200 rounded animate-pulse mb-2" />
          <div className="h-6 w-48 bg-slate-100 rounded animate-pulse mb-2" />
          <div className="h-3 w-32 bg-slate-100 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}

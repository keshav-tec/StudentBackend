export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-400/20 hover:bg-white/[0.05] hover:shadow-[0_8px_30px_rgba(139,92,246,0.08)]">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-violet-500/10 blur-3xl transition-all duration-300 group-hover:bg-violet-500/20" />

      <div className="relative flex items-start justify-between">
        {/* Content */}
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
            {title}
          </p>

          <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-100">
            {value}
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            {subtitle}
          </p>
        </div>

        {/* Icon */}
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-400/20 bg-gradient-to-br from-violet-500/15 to-cyan-500/10 text-violet-300 transition-all duration-300 group-hover:border-violet-400/30 group-hover:text-cyan-300 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.15)]">
          <Icon size={21} />
        </div>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-5 right-5 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </div>
  );
}
import {
  Star,
  CalendarCheck,
  BadgeCheck,
} from "lucide-react";

export default function TutorCard({ tutor, onBook }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#090911]/90 p-5 shadow-xl shadow-black/10 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/20 hover:shadow-[0_15px_40px_rgba(0,0,0,0.25)]">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-violet-600/[0.08] blur-[60px] transition-all duration-300 group-hover:bg-violet-500/[0.14]" />

      {/* =================================================
          TUTOR HEADER
      ================================================= */}

      <div className="relative flex items-start gap-4">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-violet-400/20 bg-gradient-to-br from-violet-600/70 to-cyan-500/60 text-sm font-bold text-white shadow-[0_0_20px_rgba(139,92,246,0.12)]">
            {tutor.avatar}
          </div>

          {/* Online indicator */}
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#090911] bg-emerald-400" />
        </div>

        {/* Tutor information */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate font-semibold tracking-wide text-white/90">
              {tutor.name}
            </h3>

            {tutor.verified && (
              <BadgeCheck
                size={17}
                className="shrink-0 text-cyan-400"
              />
            )}
          </div>

          <p className="mt-1 truncate text-sm text-slate-500">
            {tutor.subject}
          </p>

          <div className="mt-2.5 flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 rounded-lg border border-amber-400/10 bg-amber-400/[0.05] px-2 py-1 text-amber-300">
              <Star
                size={13}
                fill="currentColor"
              />
              {tutor.rating}
            </span>

            <span className="text-slate-600">
              {tutor.sessions} sessions
            </span>
          </div>
        </div>
      </div>

      {/* =================================================
          AVAILABILITY
      ================================================= */}

      <div className="relative mt-5 rounded-xl border border-white/[0.06] bg-white/[0.025] p-3.5">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600">
          Next available
        </p>

        <div className="mt-1.5 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />

          <p className="text-sm font-medium text-slate-300">
            {tutor.available}
          </p>
        </div>
      </div>

      {/* =================================================
          BOOK BUTTON
      ================================================= */}

      <button
        onClick={() => onBook(tutor)}
        className="group/button relative mt-4 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl border border-violet-400/20 bg-gradient-to-r from-violet-600/80 to-violet-500/80 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(139,92,246,0.08)] transition-all duration-300 hover:border-cyan-400/20 hover:from-violet-500 hover:to-cyan-500 hover:shadow-[0_0_25px_rgba(139,92,246,0.18)]"
      >
        <CalendarCheck
          size={17}
          className="transition-transform group-hover/button:scale-110"
        />

        Book Session
      </button>
    </div>
  );
}
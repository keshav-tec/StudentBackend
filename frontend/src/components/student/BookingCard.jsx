import { CalendarDays, Video } from "lucide-react";

export default function BookingCard({ booking }) {
  return (
    <div className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#090911]/90 p-5 shadow-xl shadow-black/10 backdrop-blur-xl transition-all duration-300 hover:border-violet-400/20 hover:shadow-[0_15px_40px_rgba(0,0,0,0.25)] sm:flex-row sm:items-center sm:justify-between">
      
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -left-16 -top-16 h-32 w-32 rounded-full bg-violet-600/[0.07] blur-[60px] transition-all duration-300 group-hover:bg-violet-500/[0.12]" />

      {/* Booking information */}
      <div className="relative flex items-center gap-4">
        
        {/* Calendar icon */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10 text-violet-300 shadow-[0_0_20px_rgba(139,92,246,0.08)]">
          <CalendarDays size={21} />
        </div>

        <div className="min-w-0">
          <h3 className="truncate font-semibold tracking-wide text-white/90">
            {booking.subject}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            With{" "}
            <span className="text-slate-400">
              {booking.tutor}
            </span>
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-lg border border-white/[0.06] bg-white/[0.025] px-2.5 py-1 text-slate-500">
              {booking.date}
            </span>

            <span className="text-slate-700">•</span>

            <span className="text-slate-500">
              {booking.time}
            </span>
          </div>
        </div>
      </div>

      {/* Join Session */}
      <button
        type="button"
        className="group/button relative flex shrink-0 items-center justify-center gap-2 overflow-hidden rounded-xl border border-cyan-400/20 bg-cyan-500/[0.07] px-4 py-2.5 text-sm font-semibold text-cyan-300 transition-all duration-300 hover:border-cyan-300/30 hover:bg-cyan-500/15 hover:text-cyan-200 hover:shadow-[0_0_20px_rgba(34,211,238,0.08)]"
      >
        <Video
          size={17}
          className="transition-transform duration-300 group-hover/button:scale-110"
        />

        Join Session
      </button>
    </div>
  );
}
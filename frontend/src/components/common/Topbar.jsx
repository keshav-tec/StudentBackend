import { Menu, Bell } from "lucide-react";

export default function Topbar({ student, onMenuClick }) {
  const initials =
    student?.name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "ST";

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/10 bg-[#05050b]/80 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      {/* Mobile Menu */}
      <button
        onClick={onMenuClick}
        className="rounded-xl border border-white/10 bg-white/[0.04] p-2.5 text-slate-300 transition-all hover:border-violet-400/30 hover:bg-violet-500/10 hover:text-white lg:hidden"
      >
        <Menu size={21} />
      </button>

      {/* Dashboard Title */}
      <div className="hidden lg:block">
        <h2 className="bg-gradient-to-r from-white via-violet-200 to-cyan-200 bg-clip-text text-lg font-semibold tracking-wide text-transparent">
          Student Dashboard
        </h2>

        <p className="mt-0.5 text-xs tracking-wide text-slate-500">
          Learn. Ask. Connect. Grow.
        </p>
      </div>

      {/* Right Section */}
      <div className="ml-auto flex items-center gap-3 sm:gap-4">
        {/* Notification */}
        <button className="group relative rounded-xl border border-white/10 bg-white/[0.03] p-2.5 transition-all hover:border-violet-400/30 hover:bg-violet-500/10">
          <Bell
            size={19}
            className="text-slate-400 transition-colors group-hover:text-violet-300"
          />

          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
        </button>

        {/* Student Profile */}
        <div className="flex items-center gap-3 border-l border-white/10 pl-3 sm:pl-4">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold tracking-wide text-slate-200">
              {student?.name || "Student"}
            </p>

            <p className="mt-0.5 text-[11px] capitalize tracking-wider text-slate-500">
              {student?.role || "Student"}
            </p>
          </div>

          {/* Avatar */}
          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/30 bg-gradient-to-br from-violet-600/80 to-cyan-500/70 text-sm font-bold text-white shadow-[0_0_20px_rgba(139,92,246,0.25)]">
              {initials}
            </div>

            {/* Online indicator */}
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#05050b] bg-emerald-400" />
          </div>
        </div>
      </div>
    </header>
  );
}
import {
  LayoutDashboard,
  MessageCircleQuestion,
  Users,
  CalendarDays,
  Gift,
  UserCircle,
  LogOut,
  X,
} from "lucide-react";

export default function Sidebar({
  activeSection,
  setActiveSection,
  mobileOpen,
  setMobileOpen,
  onLogout,
}) {
  const menuItems = [
    {
      id: "overview",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "doubt",
      label: "Ask a Doubt",
      icon: MessageCircleQuestion,
    },
    {
      id: "tutors",
      label: "Find Tutors",
      icon: Users,
    },
    {
      id: "bookings",
      label: "My Bookings",
      icon: CalendarDays,
    },
    {
      id: "rewards",
      label: "My Rewards",
      icon: Gift,
    },
    {
      id: "profile",
      label: "Profile",
      icon: UserCircle,
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-screen w-64 flex-col
          border-r border-white/10 bg-[#05050b]/95
          shadow-[10px_0_40px_rgba(0,0,0,0.25)]
          backdrop-blur-xl
          transition-transform duration-300
          lg:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo / Header */}
        <div className="relative flex h-20 items-center justify-between border-b border-white/10 px-6">
          {/* Ambient glow */}
          <div className="pointer-events-none absolute left-4 top-2 h-12 w-24 rounded-full bg-violet-600/10 blur-2xl" />

          <div className="relative">
            <h1 className="text-xl font-bold tracking-wide">
              <span className="bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent">
                Peer
              </span>
              <span className="text-slate-200">Connect</span>
            </h1>

            <p className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-slate-500">
              Peer Learning Hub
            </p>
          </div>

          {/* Mobile Close */}
          <button
            className="rounded-lg border border-white/10 bg-white/[0.03] p-2 text-slate-400 transition-all hover:border-violet-400/30 hover:bg-violet-500/10 hover:text-white lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <X size={19} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto p-4">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
            Workspace
          </p>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setMobileOpen(false);
                }}
                className={`
                  group relative flex w-full items-center gap-3
                  overflow-hidden rounded-xl px-4 py-3
                  text-sm font-medium transition-all duration-200
                  ${
                    active
                      ? "border border-violet-400/20 bg-gradient-to-r from-violet-500/15 to-cyan-500/5 text-white shadow-[0_0_20px_rgba(139,92,246,0.08)]"
                      : "border border-transparent text-slate-400 hover:border-white/10 hover:bg-white/[0.04] hover:text-slate-100"
                  }
                `}
              >
                {/* Active indicator */}
                {active && (
                  <span className="absolute left-0 top-1/2 h-7 w-0.5 -translate-y-1/2 rounded-full bg-gradient-to-b from-violet-400 to-cyan-400 shadow-[0_0_10px_rgba(139,92,246,0.8)]" />
                )}

                {/* Icon */}
                <span
                  className={`
                    flex h-8 w-8 items-center justify-center rounded-lg
                    transition-all
                    ${
                      active
                        ? "bg-violet-500/15 text-violet-300"
                        : "bg-white/[0.03] text-slate-500 group-hover:bg-white/[0.06] group-hover:text-violet-300"
                    }
                  `}
                >
                  <Icon size={18} />
                </span>

                <span>{item.label}</span>

                {/* Active glow dot */}
                {active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.9)]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-white/10 p-4">
          {/* Small system status */}
          <div className="mb-3 flex items-center gap-2 px-3 text-[10px] uppercase tracking-[0.15em] text-slate-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_7px_rgba(52,211,153,0.8)]" />
            Platform Online
          </div>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="group flex w-full items-center gap-3 rounded-xl border border-transparent px-4 py-3 text-sm font-medium text-slate-500 transition-all hover:border-red-400/10 hover:bg-red-500/5 hover:text-red-400"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.03] transition-all group-hover:bg-red-500/10">
              <LogOut size={18} />
            </span>

            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
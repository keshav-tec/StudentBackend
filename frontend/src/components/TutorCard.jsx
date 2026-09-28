export default function TutorCard({ tutor }) {
  const initials =
    tutor?.initials ||
    tutor?.name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ||
    "TU";

  const name = tutor?.name || "Tutor";
  const subject = tutor?.subject || "Subject";
  const specialty = tutor?.specialty || "Peer Tutor";
  const rating = tutor?.rating ?? "New";
  const reviews = tutor?.reviews ?? 0;

  return (
    <article className="group w-[255px] shrink-0 rounded-[24px] border border-white/10 bg-white/[0.045] p-4 backdrop-blur-xl transition duration-500 hover:-translate-y-3 hover:border-violet-400/30 hover:bg-white/[0.07] hover:shadow-[0_20px_60px_rgba(99,102,241,0.18)]">

      {/* Avatar */}
      <div className="relative mx-auto flex h-16 w-16 items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-violet-500/20 blur-xl transition group-hover:bg-cyan-400/20" />

        <div className="relative grid h-14 w-14 place-items-center rounded-full border border-white/20 bg-gradient-to-br from-violet-500 via-indigo-500 to-cyan-400 text-sm font-black text-white shadow-lg">
          {initials}
        </div>

        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#090a12] bg-emerald-400" />
      </div>

      {/* Tutor information */}
      <div className="mt-4 text-center">
        <h3 className="text-sm font-bold text-white">
          {name}
        </h3>

        <p className="mt-1 text-[11px] font-semibold text-violet-300">
          {subject}
        </p>

        <p className="mt-1 text-[10px] text-white/35">
          {specialty}
        </p>
      </div>

      {/* Rating */}
      <div className="mt-4 flex items-center justify-center gap-1 text-xs">
        <span className="text-cyan-300">★</span>

        <span className="font-bold text-white">
          {rating}
        </span>

        <span className="text-white/30">
          ({reviews})
        </span>
      </div>

      {/* Book */}
      <button
        type="button"
        className="mt-4 w-full rounded-xl border border-violet-300/15 bg-violet-500/15 px-4 py-2.5 text-xs font-bold text-violet-100 transition group-hover:border-violet-300/30 group-hover:bg-violet-500/25"
      >
        Book Session
      </button>
    </article>
  );
}
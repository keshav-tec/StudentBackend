import TutorCard from "./student/TutorCard";

const tutors = [
  {
    initials: "AK",
    name: "Ananya Kumar",
    subject: "Mathematics",
    specialty: "Calculus & Algebra",
    rating: "4.9",
    reviews: 124,
  },
  {
    initials: "RS",
    name: "Rahul Sharma",
    subject: "Data Structures",
    specialty: "DSA & Algorithms",
    rating: "4.8",
    reviews: 98,
  },
  {
    initials: "PS",
    name: "Priya Singh",
    subject: "Operating Systems",
    specialty: "OS & Computer Networks",
    rating: "4.9",
    reviews: 87,
  },
];

export default function Testimonials() {
  return (
    <section
      id="tutors"
      className="relative w-full overflow-hidden bg-[#05050b] px-5 py-20 sm:px-8 lg:px-12 xl:px-16"
    >
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0 futuristic-grid opacity-30" />

      {/* =====================================================
          FULL-WIDTH CONTENT
      ===================================================== */}

      <div className="relative w-full">

        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="mx-auto w-full text-center">

          <h2 className="text-3xl font-black text-white sm:text-4xl">
            Top Peer Tutors
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-white/50 sm:text-base">
            Learn from students who have mastered the subjects you are
            studying.
          </p>

        </div>

        {/* ===================================================
            TUTOR CARDS
        =================================================== */}

        <div className="mt-10 flex w-full gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

          {tutors.map((tutor) => (
            <div
              key={tutor.name}
              className="shrink-0"
            >
              <TutorCard tutor={tutor} />
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}
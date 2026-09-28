import { useState } from "react";

export default function ContactFooter() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
    }, 3000);
  };

  return (
    <>
      <section
        id="contact"
        className="relative overflow-hidden bg-[#05050b] py-24"
      >
        <div className="absolute inset-0 futuristic-grid opacity-40" />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="flex flex-col justify-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-300/60">
              Contact
            </p>

            <h2 className="mt-5 text-5xl font-black">
              Let's build a
              <br />
              <span className="gradient-text">better learning network.</span>
            </h2>

            <p className="mt-6 max-w-lg text-sm leading-7 text-white/40">
              Questions about tutoring, sessions, or joining Peerly?
              Send us a message and our academic support team will get back to
              you.
            </p>

            <div className="mt-8 space-y-3 text-xs text-white/40">
              <p>✉ support@peerly.edu</p>
              <p>⌖ Academic Innovation Hub</p>
            </div>
          </div>

          <div className="glass-strong rounded-[28px] p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <input
                  required
                  placeholder="Your name"
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-violet-400/40"
                />

                <input
                  type="email"
                  required
                  placeholder="University email"
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-violet-400/40"
                />
              </div>

              <textarea
                rows="6"
                required
                placeholder="How can we help?"
                className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-violet-400/40"
              />

              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-900/30 transition hover:-translate-y-0.5"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 bg-[#030308]">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-12 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <div className="text-lg font-black">Peerly</div>

            <p className="mt-2 text-xs text-white/25">
              Peer tutoring. Shared knowledge. Better learning.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-7 gap-y-3 text-xs text-white/30">
            <a href="#home" className="hover:text-white">
              Home
            </a>
            <a href="#tutors" className="hover:text-white">
              Tutors
            </a>
            <a href="#about" className="hover:text-white">
              About
            </a>
            <a href="#contact" className="hover:text-white">
              Contact
            </a>
            <span>Privacy</span>
            <span>Terms</span>
          </div>

          <div className="text-[10px] text-white/20">
            © 2026 Peerly
          </div>
        </div>
      </footer>

      {submitted && (
        <div className="fixed bottom-6 right-6 z-[100] rounded-2xl border border-emerald-300/10 bg-[#0d0d18] px-5 py-4 text-xs font-semibold text-emerald-300 shadow-2xl">
          ✓ Message submitted successfully
        </div>
      )}
    </>
  );
}
import Navbar from "../components/Navbar.jsx";
import Hero from "../components/Hero.jsx";
import HowItWorks from "../components/HowItWorks.jsx";
import About from "../components/About.jsx";
import Testimonials from "../components/Testimonials.jsx";
import ContactFooter from "../components/ContactFooter.jsx";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-[#05050b]">
      <Navbar />

      <div className="w-full">
        <Hero />
        <HowItWorks />
        <About />
        <Testimonials />
        <ContactFooter />
      </div>
    </main>
  );
}
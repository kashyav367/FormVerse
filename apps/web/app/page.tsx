import Navbar from "~/components/landing/navbar";
import Hero from "~/components/landing/hero";
import Features from "~/components/landing/feature-strip";
import Pricing from "~/components/landing/pricing";
import Footer from "~/components/landing/footer";

export default function HomePage() {
  return (
    <main
      className="
      bg-[#f9f3ee]
      min-h-screen
      overflow-x-hidden
      "
    >
      <Navbar />
      <Hero />
      <Features />
      <Pricing />
      <Footer />
    </main>
  );
}
import Footer from "@/components/home/footer";
import Features from "../components/home/features";
import HeroSection from "../components/home/heroSection";
import CallToAction from "@/components/home/callToAction";
import Testimonials from "../components/home/testimonials";
import Navbar from "../components/home/navbar";

export default function LandingPage() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      <HeroSection/>
      <Features/>
      <Testimonials/>
      <CallToAction/>
      <Footer />
    </div>
  )
}

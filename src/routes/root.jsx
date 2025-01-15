import FAQ from '../components/home/faq';
import Features from '../components/home/features';
import Advantage from '../components/home/advantage';
import Testimonial from "../components/home/testimonial";
import HeroSection from '../components/home/heroSection';
import CallToActionBanner from '../components/home/callToActionBanner';
import CallToActionFooter from '../components/home/callToActionFooter';
import HomepageFooter from "../components/shared/footer/homepageFooter";
import HomepageNavbar from "../components/shared/navbar/homepageNavbar";

export default function Root() {

  return (
    <>
      <HomepageNavbar/>
      <HeroSection/>
      <Advantage/>
      <Features/>
      <Testimonial/>
      <CallToActionBanner/>
      <FAQ/>
      <CallToActionFooter/>
      <HomepageFooter/>
    </>
  );
}
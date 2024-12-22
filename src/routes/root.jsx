import FAQ from '../components/home/faq';
import Features from '../components/home/features';
import Advantage from '../components/home/advantage';
import Testimonial from "../components/home/testimonial";
import HeroSection from '../components/home/heroSection';
import HomepageFooter from "../components/footer/homepageFooter";
import HomepageNavbar from "../components/navbar/homepageNavbar";
import CallToActionBanner from '../components/home/callToActionBanner';
import CallToActionFooter from '../components/home/callToActionFooter';

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
import xericsDashboard from '@/assets/images/dashboard.png';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <div className="text-center lg:px-18 lg:py-14 py-14 md:pt-20 md:pb-56 px-4">
      <div className="lg:text-6xl text-3xl font-medium text-black md:font-medium capitalize lg:mb-4">unlock your team&apos;s</div>
      <div className="lg:text-6xl text-3xl font-medium text-black capitalize">productivity with <span className="text-blue-600">xerics management</span></div>
      <p className="lg:my-12 lg:text-base my-8 text-sm md:px-28  lg:px-56">Streamline your workflow, enhance team collaboration, and achieve your goals effortlessly</p>
      <Link to='/signin' className="btn btn-base bg-blue-500 hover:bg-blue-700 text-base-100 capitalize">Get Started <i className="pi pi-arrow-right"></i></Link>
      <div 
        className="lg:mx-auto mt-8 lg:w-3/4 md:left-28 lg:mt-14 w-full lg:h-[700px] h-64 bg-contain bg-no-repeat lg:bg-contain lg:border bg-center rounded-lg" 
        style={{ backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255, 1)), url(${xericsDashboard})` }} 
      />
      <div className="flex flex-wrap content-center justify-center gap-3 mt-8 lg:mt-28 lg:w-[480px] lg:mx-auto">
        <span className=" flex items-center gap-x-2 capitalize font-medium text-xs border p-2 rounded-full">
          <i className="text-blue-500 pi pi-check-circle"></i> 
          Task management
        </span>
        <span className=" flex items-center gap-x-2 capitalize font-medium text-xs border p-2 rounded-full">
          <i className="text-blue-500 pi pi-check-circle"></i> 
          Collaboration tools
        </span>
        <span className=" flex items-center gap-x-2 capitalize font-medium text-xs border p-2 rounded-full">
          <i className="text-blue-500 pi pi-check-circle"></i> 
          Tasks & To Do&apos;s
        </span>
        <span className=" flex items-center gap-x-2 capitalize font-medium text-xs border p-2 rounded-full">
          <i className="text-blue-500 pi pi-check-circle"></i> 
          Project management
        </span>
        <span className=" flex items-center gap-x-2 capitalize font-medium text-xs border p-2 rounded-full">
          <i className="text-blue-500 pi pi-check-circle"></i> 
          Goals & strategy
        </span>
      </div>
    </div>
  )
}

export default HeroSection;
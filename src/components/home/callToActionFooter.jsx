import { Link } from "react-router-dom";

const CallToActionFooter = () => {
  return (
    <div className="bg-blue-600 text-base-100 text-center lg:py-14 py-14 space-y-4">
      <p className='text-2xl lg:text-3xl font-medium'>Ready to transform your projects? Get Started Today!</p>
      <Link to='/signin' className="btn btn-md btn-white text-blue-500 capitalize">Get Started <i className="pi pi-arrow-right"></i></Link>
    </div>
  )
}

export default CallToActionFooter;
import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../../../assets/images/logo.png";

const RootNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav>
      <div className="navbar w-full lg:py-4 lg:px-24">
      <div className="navbar-start">
        <img src={Logo}/>
      </div>
       <div className="navbar-center hidden md:flex lg:flex">
         <ul className="menu menu-horizontal px-1 capitalize">
           <li><a href={'/#features'} className="underlink active:bg-transparent hover:bg-transparent">features</a></li>
           <li><a href={'/#testimonials'} className="underlink hover:bg-transparent">testimonials</a></li>
           <li><a href={'/#faq'} className="underlink hover:bg-transparent">FAQ</a></li>
         </ul>
       </div>
       <div className="navbar-end">
         <Link to="/signin" className="btn btn-sm hidden md:flex btn-outline font-medium hover:border-blue-500 hover:bg-blue-500">login</Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden lg:hidden xl:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-300"
        >
          <i className={`pi text-2xl ${isOpen ? 'transform rotate-90 transition-transform duration-300 pi-times' : 'transition-transform duration-300 pi-bars'}`}></i>
        </button>
       </div>
     </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden lg:hidden xl:hidden shadow-md ${
          isOpen 
            ? 'transform opacity-100 scale-y-100 transition-transform duration-300 ease-out' 
            : 'transform opacity-0 scale-y-0 h-0 transition-transform duration-300 ease-in'
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white">
          
           <a href="/#features"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-500 hover:bg-gray-50 transition-colors duration-300"
          >
            Features
          </a>
          
           <a href="/#testimonials"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-500 hover:bg-gray-50 transition-colors duration-300"
          >
            Testimonials
          </a>
          
           <a href="/#faq"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-500 hover:bg-gray-50 transition-colors duration-300"
          >
            FAQ
          </a>
          <Link
            to="/signin"
            className="block px-3 py-2 rounded-md text-center text-base font-medium text-white bg-blue-500 transition-colors duration-300"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default RootNavbar;
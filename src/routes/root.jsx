import RootNavbar from "../components/rootnavbar";
import xerics from '../assets/images/xerics.png';
import illustration from '../assets/images/illustration.png';
import illustration_2 from '../assets/images/illustration_2.png';
import Footer from "../components/footer";

export default function Root() {

  return (
    <>
      <RootNavbar/>
      <div className="text-center lg:px-18 lg:pb-48  pt-10 md:pt-20 md:pb-56 pb-28 px-2">
       <div className="lg:text-7xl text-5xl md:font-medium capitalize lg:mb-5">skyrocket your</div>
       <div className="lg:text-7xl text-5xl capitalize font-black"> team&apos;s productivity. </div>
        <p className="lg:my-14 my-8 text-sm md:px-28 lg:px-56">Looking for an Intranet/Extranet WordPress theme with all-around compatibility? Woffice can have it pixel-perfect for you in no time!</p>
        <button className="btn btn-base btn-primary capitalize">Test it out <i className="pi pi-arrow-right"></i></button>
      </div>

      <div className="lg:h-auto relative text-center pt-32 pb-14 bg-[#141126] ">
        <img className="lg:mx-auto lg:w-3/4 absolute -top-14 md:-top-28 md:w-3/4 w-4/5 left-9 md:left-28" src={xerics} alt="screenshot" />

        <div className="grid grid-cols-1 md:grid-cols-2 px-5 gap-5 md:mt-28 md:px-24 lg:grid-cols-4 lg:pt-20 lg:px-2">
          <div className="text-center text-white flex justify-center content-center">
            <img className="lg:h-8" src={'https://woffice.io/wp-content/themes/woffice-landing/assets/images/home-page/woffice-pink-right.png'} alt="screenshot" />
              <span className="text-white lg:text-left">#1 community WordPress theme</span>
          </div>
          <div className="text-center text-white flex justify-center content-center">
            <img className="lg:h-8" src={'https://woffice.io/wp-content/themes/woffice-landing/assets/images/home-page/woffice-pink-right.png'} alt="screenshot" />
              <span className="text-white lg:text-left">#1 community WordPress theme</span>
          </div>
          <div className="text-center text-white flex justify-center content-center">
            <img className="lg:h-8" src={'https://woffice.io/wp-content/themes/woffice-landing/assets/images/home-page/woffice-pink-right.png'} alt="screenshot" />
              <span className="text-white lg:text-left">#1 community WordPress theme</span>
          </div>
          <div className="text-center text-white flex justify-center content-center">
            <img className="lg:h-8" src={'https://woffice.io/wp-content/themes/woffice-landing/assets/images/home-page/woffice-pink-right.png'} alt="screenshot" />
              <span className="text-white lg:text-left">#1 community WordPress theme</span>
          </div>
          
        </div>
          <button className="btn btn-base btn-primary capitalize mt-5">explore plans <i className="pi pi-arrow-right"></i></button>
      </div>
      
      <div className="flex flex-col lg:flex-row lg:px-12 py-10 px-4 md:px-24">
      <img className="lg:h-72 lg:order-2 lg:self-center" src={illustration_2} alt="screenshot" />
      <div className="text-center py-4 lg:order-1 lg:text-left">
        <i className="pi pi-th-large text-2xl bg-red-100 p-5 rounded-full text-red-500"></i>
        <p className="text-3xl font-bold my-4 md:text-4xl">Intranet/Extranet Theme That’s Multipurpose</p>
        <p className="md:px-8 lg:px-0">Providing a flexible, one-stop solution for your intranet/extranet website requirements. Woffice is highly functional and smart to go for with inbuilt shortcodes, freedom of functionality, comprehensive compatibility with most WordPress plugins, and feature-packed bundles to keep your community website up and going.Test It Out </p>
        <button className="btn btn-base btn-primary capitalize mt-8">test it out <i className="pi pi-arrow-right"></i></button>
      </div>
      </div>
      <div className="flex flex-col  lg:flex-row lg:px-12 py-10 px-4 md:px-24">
      <img className="lg:h-80 lg:order-1 lg:self-center" src={illustration} alt="screenshot" />
      <div className="text-center py-4 lg:order-2 lg:text-right">
        <i className="pi pi-id-card text-2xl bg-blue-100 p-5 rounded-full text-blue-500"></i>
        <p className="text-3xl font-bold my-4 md:text-4xl">Intranet/Extranet Theme That’s Multipurpose</p>
        <p className="md:px-8">Providing a flexible, one-stop solution for your intranet/extranet website requirements. Woffice is highly functional and smart to go for with inbuilt shortcodes, freedom of functionality, comprehensive compatibility with most WordPress plugins, and feature-packed bundles to keep your community website up and going.Test It Out </p>
        <button className="btn btn-base btn-primary capitalize mt-8">test it out <i className="pi pi-arrow-right"></i></button>
      </div>
      </div>

      <div className="pt-24 pb-14 px-5 gap-5 bg-[#141126] relative md:px-24 ">
        <span className="text-gray-100 text-3xl lg:text-5xl">And, everything else to sync your community with…</span>
        <img className="float-right w-24 rotate-90 mt-12" src="https://woffice.io/wp-content/themes/woffice-landing/assets/images/home-page/woffice-grad-arrow.png"/>
        <div className="mt-28 md:space-y-10 lg:grid lg:grid-rows-">
          <div className="card bg-[#211E34] shadow-xl">
            <figure className="px-5 pt-10">
              <img src="https://woffice.io/wp-content/themes/woffice-landing/assets/images/home-page/woffice-calender.png" alt="Shoes" className="rounded-xl" />
            </figure>
            <div className="card-body items-center text-center ">
              <h2 className="card-title text-white">Woffice Is A Great Choice For You, If…</h2>
              <p className="text-gray-400">You’re looking forward to building an online interactive community space that your teammates or employees would love to collaborate with. You want to build a secure, private network for internal teams and external partners. And, you’re looking for a power-packed theme that offers features such as role-based access control.</p>
            </div>
          </div>
          <div className="card bg-[#211E34] shadow-xl">
            <figure className="px-5 pt-10">
              <img src="https://woffice.io/wp-content/themes/woffice-landing/assets/images/home-page/woffice-calender.png" alt="Shoes" className="rounded-xl" />
            </figure>
            <div className="card-body items-center text-center ">
              <h2 className="card-title text-white">Woffice Is A Great Choice For You, If…</h2>
              <p className="text-gray-400">You’re looking forward to building an online interactive community space that your teammates or employees would love to collaborate with. You want to build a secure, private network for internal teams and external partners. And, you’re looking for a power-packed theme that offers features such as role-based access control.</p>
            </div>
          </div>
          <div className="card bg-[#211E34] shadow-xl">
            <figure className="px-5 pt-10">
              <img src="https://woffice.io/wp-content/themes/woffice-landing/assets/images/home-page/woffice-calender.png" alt="Shoes" className="rounded-xl" />
            </figure>
            <div className="card-body items-center text-center ">
              <h2 className="card-title text-white">Woffice Is A Great Choice For You, If…</h2>
              <p className="text-gray-400">You’re looking forward to building an online interactive community space that your teammates or employees would love to collaborate with. You want to build a secure, private network for internal teams and external partners. And, you’re looking for a power-packed theme that offers features such as role-based access control.</p>
            </div>
          </div>
          <div className="card bg-[#211E34] shadow-xl">
            <figure className="px-5 pt-10">
              <img src="https://woffice.io/wp-content/themes/woffice-landing/assets/images/home-page/woffice-calender.png" alt="Shoes" className="rounded-xl" />
            </figure>
            <div className="card-body items-center text-center ">
              <h2 className="card-title text-white">Woffice Is A Great Choice For You, If…</h2>
              <p className="text-gray-400">You’re looking forward to building an online interactive community space that your teammates or employees would love to collaborate with. You want to build a secure, private network for internal teams and external partners. And, you’re looking for a power-packed theme that offers features such as role-based access control.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-red-300 shadow-xl my-28 mx-2 md:mx-14">
        <figure className="px-5 pt-10">
          <img src="https://woffice.io/wp-content/themes/woffice-landing/assets/images/pricing_page_img/woffice-Subscribe.png" alt="Shoes" className="rounded-xl" />
        </figure>
        <div className="card-body items-center text-center ">
          <h2 className="card-title text-white">Nice To Meet You!</h2>
          <p className="text-gray-100">You’re looking forward to building an online interactive .</p>
        </div>
        <input className="input py-7 font-medium text-black mx-2 my-10" placeholder="Enter E-mail Address"/>
      </div>
      <Footer/>
    </>
  );
}
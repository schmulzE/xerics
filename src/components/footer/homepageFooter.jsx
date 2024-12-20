import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function InputWithButton() {
  return (
    <div className="flex w-full lg:max-w-sm items-center space-x-2">
      <Input type="email" placeholder="Enter your email" />
      <Button type="submit" className="bg-blue-500 hover:bg-blue-700 hover:text-white">Subscribe</Button>
    </div>
  )
}


const Footer = () => {
  return (
    <div className="lg:px-12 px-4">
      <div className="bg-base-100 text-base-content lg:py-12 py-8 grid lg:grid-cols-2 lg:items-center space-y-4 lg:space-y-0">
        <div className="w-full max-w-sm space-y-4">
          <h1 className="text-3xl capitalize">subscribe</h1>
          <p className="text-gray-400 text-xs">subscribe to our newsletter and never miss an updates. stay informed about the latest news, and exclusive offers</p>
        </div>
        <div className="flex lg:justify-end">
          <div className="space-y-4">
           <span className="text-ms font-medium">Stay up to date</span>
            <InputWithButton/>
            <span className="text-xs block mt-2">By subscribing you agree to our <strong className="underline cursor-pointer">Privacy Policy</strong></span>
          </div>
        </div>
      </div>

      <hr/>

      <div className="bg-base-100 py-8 lg:py-12 text-base-content flex lg:flex-row flex-col justify-between lg:items-center">
        <div className="basis-1/4">
          <h1 className="text-4xl capitalize">xerics</h1>
        </div>
        <ul className="grid lg:grid-cols-4 gap-x-8 gap-y-4 font-medium text-sm basis-2/3">
          <li>
            <a href="#">About us</a>
          </li>
          <li>
            <a href="#">24/7 support</a>
          </li>
          <li>
            <a href="#">Contact sales</a>
          </li>
          <li>
            <a href="#">Integration</a>
          </li>
          <li>
            <a href="#">Pricing</a>
          </li>
          <li>
            <a href="#">Features</a>
          </li>
          <li>
            <a href="#">Enterprise</a>
          </li>
          <li>
            <a href="#">Privacy Policy</a>
          </li>
        </ul>
      </div>

      <hr/>

      <div className="py-8 w-full flex lg:flex-row flex-col gap-y-8 lg:gap-y-0 lg:justify-between lg:items-center">
        <ul className="menu pl-0 ml-0 w-36">
          <li>
            <details>
              <summary><i className="pi pi-globe"></i>English</summary>
            </details>
          </li>
        </ul>
        <p className="text-sm text-gray-500">All right reserved © 2024 XERICS</p>
        <ul className="text-lg text-base-content flex gap-x-8 ">
          <li><i className="pi pi-instagram"></i></li>
          <li><i className="pi pi-facebook"></i></li>
          <li><i className="pi pi-twitter"></i></li>
          <li><i className="pi pi-youtube"></i></li>
          <li><i className="pi pi-linkedin"></i></li>
        </ul>
      </div>
    </div>
  )
}

export default Footer
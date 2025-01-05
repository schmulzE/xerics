import { Link } from 'react-router-dom';
import Planning from '@/assets/images/Planning.jpg';

const CallToActionBanner = () => {
  return (
    <div className='px-14 pt-14 grid lg:grid-cols-2 items-center lg:px-24 lg:py-14'>
      <div className='text-center lg:text-left space-y-4'>
        <p className='text-2xl lg:text-4xl font-semibold'>Run your client work on the platform built for it</p>
        <Link to='/signin' className="btn btn-md bg-blue-500 hover:bg-blue-700 text-base-100 capitalize">Get Started</Link>
      </div>
      <div className='w-full h-72 lg:h-96 bg-contain bg-no-repeat lg:bg-cover bg-center rounded-lg' style={{ backgroundImage : `url(${Planning})`}}/>
    </div>
  )
}

export default CallToActionBanner;
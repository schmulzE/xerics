import { Link } from "react-router-dom";
import { MixerHorizontalIcon, TimerIcon } from "@radix-ui/react-icons";

const Advantage = () => {
  return (
    <div className="lg:h-auto text-center py-14 space-y-4 lg:px-24 px-4 bg-base-200">
      <div className='lg:grid lg:grid-cols-2 lg:items-center mb-8 space-y-8 lg:space-y-0'>
        <div className='lg:text-left space-y-4'>
          <span className="text-blue-500 bg-blue-50 font-medium rounded-full text-xs uppercase p-2">advantage</span>
          <h2 className="text-4xl font-medium lg:w-96">The ultimate solution for any need</h2>
        </div>
        <div className='lg:flex lg:justify-end lg:self-end'>
          <Link to='/signin' className="btn btn-base bg-blue-500 hover:bg-blue-700 text-base-100 capitalize">Explore More</Link>
        </div>
      </div>

      <div className="text-left flex flex-col lg:flex-row gap-4">
        <div className="border rounded-md p-8 bg-base-100">
          <MixerHorizontalIcon className="w-12 h-12 border rounded-full p-2 text-purple-500"/>
          <h3 className="mt-4 capitalize text-sm text-left font-semibold">seamless set-up</h3>
          <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. In accusantium non quia reprehenderit illo tempora impedit.</p>
        </div>
        <div className="border rounded-md p-8 bg-base-100">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-12 border rounded-full p-2 text-pink-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 0 1-.657.643 48.39 48.39 0 0 1-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 0 1-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 0 0-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 0 1-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 0 0 .657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 0 1-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 0 0 5.427-.63 48.05 48.05 0 0 0 .582-4.717.532.532 0 0 0-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 0 0 .658-.663 48.422 48.422 0 0 0-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 0 1-.61-.58v0Z" />
          </svg>
          <h3 className="mt-4 capitalize text-sm text-left font-semibold">seamless set-up</h3>
          <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. In accusantium non quia reprehenderit illo tempora impedit.</p>
        </div>
        <div className="border rounded-md p-8 bg-base-100">
          <TimerIcon className="w-12 h-12 border rounded-full p-2 text-orange-500"/>
          <h3 className="mt-4 capitalize text-sm text-left font-semibold">seamless set-up</h3>
          <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. In accusantium non quia reprehenderit illo tempora impedit.</p>
        </div>
      </div>
    </div>
  )
}

export default Advantage;
